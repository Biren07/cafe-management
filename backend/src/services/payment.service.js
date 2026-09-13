import mongoose from 'mongoose';
import { paymentRepository } from '../repositories/payment.repository.js';
import { orderRepository } from '../repositories/order.repository.js';
import { orderService } from './order.service.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

class PaymentService {
  /**
   * Generate a unique invoice number (e.g. INV-20260805-7281)
   * @returns {Promise<string>}
   */
  async generateInvoiceNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    let invoiceNumber = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      invoiceNumber = `INV-${dateStr}-${randomDigits}`;
      const existing = await paymentRepository.findByInvoiceNumber(invoiceNumber);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      invoiceNumber = `INV-${dateStr}-${Date.now().toString().slice(-4)}`;
    }

    return invoiceNumber;
  }

  /**
   * Process a payment, generate invoice number, and synchronize target Order status
   * @param {Object} paymentInput
   * @param {string} userId - ID of staff user processing payment
   * @returns {Promise<Payment>}
   */
  async processPayment(paymentInput, userId) {
    const {
      order: orderId,
      amount,
      paymentMethod,
      onlineProvider,
      referenceNumber,
      paymentStatus,
    } = paymentInput;

    // Validate target Order
    const targetOrder = await orderRepository.findById(orderId);
    if (!targetOrder) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.INVALID_ORDER_FOR_PAYMENT
      );
    }

    // Check if order is already completed / paid
    if (targetOrder.status === 'COMPLETED') {
      const existingPayment = await paymentRepository.findByOrder(orderId);
      if (existingPayment && existingPayment.paymentStatus === 'COMPLETED') {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.PAYMENT_ALREADY_COMPLETED
        );
      }
    }

    const finalAmount = amount !== undefined && amount !== null ? parseFloat(amount) : targetOrder.total;
    const finalMethod = paymentMethod ? paymentMethod.toUpperCase() : 'CASH';
    const status = paymentStatus ? paymentStatus.toUpperCase() : 'COMPLETED';

    const invoiceNumber = await this.generateInvoiceNumber();

    const paymentData = {
      invoiceNumber,
      order: targetOrder._id,
      amount: finalAmount,
      paymentMethod: finalMethod,
      onlineProvider: onlineProvider ? onlineProvider.toUpperCase() : '',
      paymentStatus: status,
      referenceNumber: referenceNumber || '',
      processedBy: userId,
    };

    const payment = await paymentRepository.createPayment(paymentData);

    // Synchronize Order & Table status to COMPLETED & AVAILABLE if payment succeeded
    if (status === 'COMPLETED') {
      await orderService.updateOrderStatus(targetOrder._id, 'COMPLETED');
    }

    return payment;
  }

  /**
   * List payments with pagination, filtering, searching, date range, and dynamic sorting
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getPayments(queryParams) {
    return await paymentRepository.findPayments(queryParams);
  }

  /**
   * Get single payment details by Mongo ID or Invoice Number
   * @param {string} idOrInvoiceNumber
   * @returns {Promise<Payment>}
   */
  async getPaymentById(idOrInvoiceNumber) {
    let payment = null;
    if (mongoose.Types.ObjectId.isValid(idOrInvoiceNumber)) {
      payment = await paymentRepository.findById(idOrInvoiceNumber);
    }

    if (!payment) {
      payment = await paymentRepository.findByInvoiceNumber(idOrInvoiceNumber);
    }

    if (!payment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
    }

    return payment;
  }

  /**
   * Update Payment status (PENDING, COMPLETED, FAILED, REFUNDED)
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Payment>}
   */
  async updatePaymentStatus(id, status) {
    const existingPayment = await paymentRepository.findById(id);
    if (!existingPayment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
    }

    const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
    const formattedStatus = status.toUpperCase();

    if (!validStatuses.includes(formattedStatus)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Payment status must be one of: ${validStatuses.join(', ')}`
      );
    }

    const updatedPayment = await paymentRepository.updatePaymentStatus(id, formattedStatus);

    if (formattedStatus === 'COMPLETED' && existingPayment.order) {
      const orderId = existingPayment.order._id || existingPayment.order;
      await orderService.updateOrderStatus(orderId, 'COMPLETED');
    }

    return updatedPayment;
  }

  /**
   * Delete Payment record by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deletePayment(id) {
    const existingPayment = await paymentRepository.findById(id);
    if (!existingPayment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
    }

    return await paymentRepository.deletePayment(id);
  }
}

export const paymentService = new PaymentService();
