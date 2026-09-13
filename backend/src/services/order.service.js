import mongoose from 'mongoose';
import { orderRepository } from '../repositories/order.repository.js';
import { menuRepository } from '../repositories/menu.repository.js';
import { tableRepository } from '../repositories/table.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { TABLE_STATUS } from '../models/table.model.js';

/**
 * Execute work inside a MongoDB Session Transaction with fallback for standalone instances
 * @param {Function} work - Callback accepting session parameter
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
    // Fallback if local standalone MongoDB does not support replica set transactions
    if (error.message && (error.message.includes('replica set') || error.message.includes('Transaction numbers'))) {
      return await work(null);
    }
    throw error;
  } finally {
    session.endSession();
  }
};

class OrderService {
  /**
   * Generate a unique order number (e.g. ORD-20260805-4829)
   * @returns {Promise<string>}
   */
  async generateOrderNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    let orderNumber = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      orderNumber = `ORD-${dateStr}-${randomDigits}`;
      const existing = await orderRepository.findByOrderNumber(orderNumber);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      orderNumber = `ORD-${dateStr}-${Date.now().toString().slice(-4)}`;
    }

    return orderNumber;
  }

  /**
   * Create a new Order with table status synchronization and price snapshotting
   * @param {Object} orderInput
   * @param {string} userId - ID of staff user creating the order
   * @returns {Promise<Order>}
   */
  async createOrder(orderInput, userId) {
    const { items: inputItems, orderType, table: tableId, tax, discount, serviceCharge, notes } = orderInput;

    if (!Array.isArray(inputItems) || inputItems.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.INVALID_ORDER_ITEMS);
    }

    const type = orderType ? orderType.toUpperCase() : 'DINE_IN';
    let targetTable = null;

    // Validation for DINE_IN orders
    if (type === 'DINE_IN') {
      if (!tableId) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Table assignment is required for DINE_IN orders.'
        );
      }

      targetTable = await tableRepository.findById(tableId);
      if (!targetTable) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.TABLE_NOT_FOUND);
      }

      if (!targetTable.isActive) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.CANNOT_OCCUPY_INACTIVE_TABLE
        );
      }

      if (targetTable.status === TABLE_STATUS.OCCUPIED) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Table '${targetTable.tableNumber}' is currently OCCUPIED. Cannot place a new order.`
        );
      }
    }

    // Process & snapshot menu items
    let orderSubtotal = 0;
    const processedItems = [];

    for (const item of inputItems) {
      const menuItem = await menuRepository.findById(item.menuItem);

      if (!menuItem) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Menu item with ID '${item.menuItem}' not found.`
        );
      }

      if (!menuItem.isAvailable) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Menu item '${menuItem.name}' is currently unavailable.`
        );
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = menuItem.price;
      const itemSubtotal = price * quantity;

      orderSubtotal += itemSubtotal;

      processedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price,
        quantity,
        subtotal: itemSubtotal,
      });
    }

    // Financial calculations
    const taxAmount = Math.max(0, parseFloat(tax) || 0);
    const discountAmount = Math.max(0, parseFloat(discount) || 0);
    const serviceChargeAmount = Math.max(0, parseFloat(serviceCharge) || 0);
    const finalTotal = Math.max(0, orderSubtotal + taxAmount + serviceChargeAmount - discountAmount);

    const orderNumber = await this.generateOrderNumber();

    const orderData = {
      orderNumber,
      orderType: type,
      table: type === 'DINE_IN' ? targetTable._id : null,
      items: processedItems,
      subtotal: orderSubtotal,
      tax: taxAmount,
      discount: discountAmount,
      serviceCharge: serviceChargeAmount,
      total: finalTotal,
      status: 'PENDING',
      notes: notes || '',
      createdBy: userId,
    };

    // Transactional Execution
    return await withTransaction(async (session) => {
      const createdOrder = await orderRepository.createOrder(orderData, { session });

      // Automatically change Table status to OCCUPIED for DINE_IN orders
      if (type === 'DINE_IN' && targetTable) {
        await tableRepository.updateStatus(targetTable._id, TABLE_STATUS.OCCUPIED);
      }

      return createdOrder;
    });
  }

  /**
   * List orders with pagination, filtering, search, date range, and populated references
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getOrders(queryParams) {
    return await orderRepository.findOrders(queryParams);
  }

  /**
   * Get single order details by Mongo ID or Order Number
   * @param {string} idOrOrderNumber
   * @returns {Promise<Order>}
   */
  async getOrderById(idOrOrderNumber) {
    let order = null;
    if (mongoose.Types.ObjectId.isValid(idOrOrderNumber)) {
      order = await orderRepository.findById(idOrOrderNumber);
    }

    if (!order) {
      order = await orderRepository.findByOrderNumber(idOrOrderNumber);
    }

    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }

  /**
   * Update Order Status (PENDING -> PREPARING -> SERVED -> COMPLETED / CANCELLED)
   * Automatically frees up Table to AVAILABLE upon COMPLETED or CANCELLED status.
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Order>}
   */
  async updateOrderStatus(id, status) {
    const existingOrder = await orderRepository.findById(id);
    if (!existingOrder) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ORDER_NOT_FOUND);
    }

    const validStatuses = ['PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED'];
    const formattedStatus = status.toUpperCase();

    if (!validStatuses.includes(formattedStatus)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Status must be one of: ${validStatuses.join(', ')}`
      );
    }

    return await withTransaction(async (session) => {
      const updatedOrder = await orderRepository.updateOrderStatus(id, formattedStatus, { session });

      // If status is COMPLETED or CANCELLED, reset associated DINE_IN Table to AVAILABLE
      if (['COMPLETED', 'CANCELLED'].includes(formattedStatus) && existingOrder.table) {
        const tableId = existingOrder.table._id || existingOrder.table;
        await tableRepository.updateStatus(tableId, TABLE_STATUS.AVAILABLE);
      }

      return updatedOrder;
    });
  }

  /**
   * Update order details & re-calculate totals
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Order>}
   */
  async updateOrder(id, updateData) {
    const existingOrder = await orderRepository.findById(id);
    if (!existingOrder) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ORDER_NOT_FOUND);
    }

    if (updateData.items && Array.isArray(updateData.items)) {
      let orderSubtotal = 0;
      const processedItems = [];

      for (const item of updateData.items) {
        const menuItem = await menuRepository.findById(item.menuItem);
        if (!menuItem) {
          throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            `Menu item with ID '${item.menuItem}' not found.`
          );
        }

        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        const price = menuItem.price;
        const itemSubtotal = price * quantity;

        orderSubtotal += itemSubtotal;

        processedItems.push({
          menuItem: menuItem._id,
          name: menuItem.name,
          price,
          quantity,
          subtotal: itemSubtotal,
        });
      }

      updateData.items = processedItems;
      updateData.subtotal = orderSubtotal;
    }

    // Re-calculate final total
    const subtotal = updateData.subtotal !== undefined ? updateData.subtotal : existingOrder.subtotal;
    const tax = updateData.tax !== undefined ? parseFloat(updateData.tax) : existingOrder.tax;
    const discount = updateData.discount !== undefined ? parseFloat(updateData.discount) : existingOrder.discount;
    const serviceCharge = updateData.serviceCharge !== undefined ? parseFloat(updateData.serviceCharge) : existingOrder.serviceCharge;

    updateData.tax = tax;
    updateData.discount = discount;
    updateData.serviceCharge = serviceCharge;
    updateData.total = Math.max(0, subtotal + tax + serviceCharge - discount);

    return await orderRepository.updateOrder(id, updateData);
  }

  /**
   * Delete order by ID and free up associated Table
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteOrder(id) {
    const existingOrder = await orderRepository.findById(id);
    if (!existingOrder) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ORDER_NOT_FOUND);
    }

    return await withTransaction(async (session) => {
      if (existingOrder.table) {
        const tableId = existingOrder.table._id || existingOrder.table;
        await tableRepository.updateStatus(tableId, TABLE_STATUS.AVAILABLE);
      }
      return await orderRepository.deleteOrder(id, { session });
    });
  }
}

export const orderService = new OrderService();
