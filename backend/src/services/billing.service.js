import mongoose from 'mongoose';
import { billingRepository } from '../repositories/billing.repository.js';
import { orderRepository } from '../repositories/order.repository.js';
import { orderService } from './order.service.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { BILL_STATUS } from '../models/billing.model.js';

/**
 * Transaction runner with standalone fallback
 */
const withTransaction = async (work) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    if (error.message && (error.message.includes('replica set') || error.message.includes('Transaction numbers'))) {
      return await work(null);
    }
    throw error;
  } finally {
    session.endSession();
  }
};

class BillingService {
  /**
   * Generate a unique receipt number (e.g. RCP-20260805-4829)
   * @returns {Promise<string>}
   */
  async generateReceiptNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    let receiptNumber = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      receiptNumber = `RCP-${dateStr}-${randomDigits}`;
      const existing = await billingRepository.findByReceiptNumber(receiptNumber);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      receiptNumber = `RCP-${dateStr}-${Date.now().toString().slice(-4)}`;
    }

    return receiptNumber;
  }

  /**
   * Generate a new Bill from an Order with auto-calculated subtotals and financials
   * @param {Object} inputData
   * @param {string} inputData.order - MongoId of Order
   * @param {number} [inputData.tax]
   * @param {number} [inputData.discount]
   * @param {number} [inputData.serviceCharge]
   * @param {string} userId - ID of staff user generating the bill
   * @returns {Promise<Billing>}
   */
  async generateBill(inputData, userId) {
    const { order: orderId, tax, discount, serviceCharge } = inputData;

    // Validate target Order
    const targetOrder = await orderRepository.findById(orderId);
    if (!targetOrder) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.INVALID_ORDER_FOR_BILLING
      );
    }

    // Check if a bill already exists for this order
    const existingBill = await billingRepository.findByOrder(orderId);
    if (existingBill) {
      return existingBill;
    }

    // Auto-calculate financial fields
    const subtotal = targetOrder.subtotal;
    const taxAmount = tax !== undefined && tax !== null ? Math.max(0, parseFloat(tax)) : targetOrder.tax;
    const discountAmount = discount !== undefined && discount !== null ? Math.max(0, parseFloat(discount)) : targetOrder.discount;
    const serviceChargeAmount = serviceCharge !== undefined && serviceCharge !== null ? Math.max(0, parseFloat(serviceCharge)) : targetOrder.serviceCharge;
    const grandTotal = Math.max(0, subtotal + taxAmount + serviceChargeAmount - discountAmount);

    const receiptNumber = await this.generateReceiptNumber();

    const billData = {
      receiptNumber,
      order: targetOrder._id,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      serviceCharge: serviceChargeAmount,
      grandTotal,
      status: targetOrder.status === 'COMPLETED' ? BILL_STATUS.PAID : BILL_STATUS.PENDING,
      history: [
        {
          action: 'GENERATED',
          details: `Bill generated for Order #${targetOrder.orderNumber}`,
          performedBy: userId,
          timestamp: new Date(),
        },
      ],
      createdBy: userId,
    };

    return await withTransaction(async (session) => {
      return await billingRepository.createBill(billData, { session });
    });
  }

  /**
   * List bills with pagination, filtering, searching, date range, and dynamic sorting
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getBills(queryParams) {
    return await billingRepository.findBills(queryParams);
  }

  /**
   * Get single bill details by Mongo ID or Receipt Number
   * @param {string} idOrReceiptNumber
   * @returns {Promise<Billing>}
   */
  async getBillById(idOrReceiptNumber) {
    let bill = null;
    if (mongoose.Types.ObjectId.isValid(idOrReceiptNumber)) {
      bill = await billingRepository.findById(idOrReceiptNumber);
    }

    if (!bill) {
      bill = await billingRepository.findByReceiptNumber(idOrReceiptNumber);
    }

    if (!bill) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.BILL_NOT_FOUND
      );
    }

    return bill;
  }

  /**
   * Generate structured printable invoice JSON for printing receipt
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async printInvoice(id, userId) {
    const bill = await this.getBillById(id);

    // Record print event in audit history
    await billingRepository.addHistoryEntry(bill._id, {
      action: 'PRINTED',
      details: `Printable receipt requested by user`,
      performedBy: userId,
      timestamp: new Date(),
    });

    const order = bill.order;
    const tableInfo = order && order.table ? `${order.table.tableName} (${order.table.tableNumber})` : 'TAKE_AWAY';

    // Format itemized breakdown
    const items = (order ? order.items : []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.subtotal,
    }));

    return {
      cafe: {
        name: 'Cafe Management System',
        address: '123 Main Street, City Center',
        phone: '+1 (555) 019-2834',
        email: 'billing@cafemanagement.com',
        website: 'https://cafemanagement.com',
      },
      invoiceHeader: {
        receiptNumber: bill.receiptNumber,
        orderNumber: order ? order.orderNumber : 'N/A',
        orderType: order ? order.orderType : 'N/A',
        table: tableInfo,
        issueDate: bill.createdAt,
        billStatus: bill.status,
        servedBy: bill.createdBy ? bill.createdBy.name : 'Staff',
      },
      items,
      financialSummary: {
        subtotal: bill.subtotal,
        tax: bill.tax,
        discount: bill.discount,
        serviceCharge: bill.serviceCharge,
        grandTotal: bill.grandTotal,
      },
      splitDetails: bill.isSplit
        ? {
            isSplit: true,
            splitCount: bill.splitCount,
            perPersonAmount: (bill.grandTotal / bill.splitCount).toFixed(2),
            breakdown: bill.splitDetails,
          }
        : { isSplit: false },
      footer: {
        thankYouMessage: 'Thank you for dining with us! Please come again.',
      },
    };
  }

  /**
   * Split bill among multiple people
   * @param {string} id
   * @param {Object} splitInput
   * @param {number} splitInput.splitCount
   * @param {Array<number>} [splitInput.customAmounts]
   * @param {string} userId
   * @returns {Promise<Billing>}
   */
  async splitBill(id, splitInput, userId) {
    const bill = await this.getBillById(id);
    const { splitCount, customAmounts } = splitInput;

    const count = parseInt(splitCount, 10);
    if (isNaN(count) || count < 2) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'Split count must be an integer of at least 2.'
      );
    }

    let splitDetails = [];

    if (Array.isArray(customAmounts) && customAmounts.length === count) {
      const sum = customAmounts.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
      if (Math.abs(sum - bill.grandTotal) > 0.01) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Sum of custom split amounts ($${sum.toFixed(2)}) must equal Grand Total ($${bill.grandTotal.toFixed(2)}).`
        );
      }

      splitDetails = customAmounts.map((amt, idx) => ({
        personIndex: idx + 1,
        amount: parseFloat(amt),
        status: BILL_STATUS.PENDING,
      }));
    } else {
      const equalAmount = parseFloat((bill.grandTotal / count).toFixed(2));
      const totalEqualSum = equalAmount * count;
      const remainder = parseFloat((bill.grandTotal - totalEqualSum).toFixed(2));

      splitDetails = Array.from({ length: count }, (_, idx) => ({
        personIndex: idx + 1,
        amount: idx === count - 1 ? parseFloat((equalAmount + remainder).toFixed(2)) : equalAmount,
        status: BILL_STATUS.PENDING,
      }));
    }

    const historyEntry = {
      action: 'SPLIT',
      details: `Bill split into ${count} equal/custom shares`,
      performedBy: userId,
      timestamp: new Date(),
    };

    return await withTransaction(async (session) => {
      return await billingRepository.updateSplitBill(
        bill._id,
        count,
        splitDetails,
        historyEntry,
        { session }
      );
    });
  }

  /**
   * Update bill status (PENDING, PAID, CANCELLED)
   * Automatically updates associated Order status to COMPLETED and frees Table to AVAILABLE if PAID.
   * @param {string} id
   * @param {string} status
   * @param {string} userId
   * @returns {Promise<Billing>}
   */
  async updateBillStatus(id, status, userId) {
    const bill = await this.getBillById(id);
    const validStatuses = [BILL_STATUS.PENDING, BILL_STATUS.PAID, BILL_STATUS.CANCELLED];
    const formattedStatus = status.toUpperCase();

    if (!validStatuses.includes(formattedStatus)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Status must be one of: ${validStatuses.join(', ')}`
      );
    }

    const historyEntry = {
      action: 'STATUS_UPDATED',
      details: `Bill status changed from ${bill.status} to ${formattedStatus}`,
      performedBy: userId,
      timestamp: new Date(),
    };

    return await withTransaction(async (session) => {
      const updatedBill = await billingRepository.updateBillStatus(
        bill._id,
        formattedStatus,
        historyEntry,
        { session }
      );

      // If Bill is marked PAID, automatically update target Order to COMPLETED
      if (formattedStatus === BILL_STATUS.PAID && bill.order) {
        const orderId = bill.order._id || bill.order;
        await orderService.updateOrderStatus(orderId, 'COMPLETED');
      }

      return updatedBill;
    });
  }
}

export const billingService = new BillingService();
