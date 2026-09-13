import { Payment } from '../models/payment.model.js';

class PaymentRepository {
  /**
   * Create a new Payment document
   * @param {Object} paymentData
   * @returns {Promise<Payment>}
   */
  async createPayment(paymentData) {
    const payment = new Payment(paymentData);
    const savedPayment = await payment.save();
    return await Payment.findById(savedPayment._id)
      .populate('order')
      .populate('processedBy', 'name email role')
      .exec();
  }

  /**
   * Find Payment by Mongo ID
   * @param {string} id
   * @returns {Promise<Payment|null>}
   */
  async findById(id) {
    return await Payment.findById(id)
      .populate('order')
      .populate('processedBy', 'name email role')
      .exec();
  }

  /**
   * Find Payment by unique Invoice Number
   * @param {string} invoiceNumber
   * @returns {Promise<Payment|null>}
   */
  async findByInvoiceNumber(invoiceNumber) {
    return await Payment.findOne({ invoiceNumber: invoiceNumber.toUpperCase() })
      .populate('order')
      .populate('processedBy', 'name email role')
      .exec();
  }

  /**
   * Find Payment by Order Mongo ID
   * @param {string} orderId
   * @returns {Promise<Payment|null>}
   */
  async findByOrder(orderId) {
    return await Payment.findOne({ order: orderId })
      .populate('order')
      .populate('processedBy', 'name email role')
      .exec();
  }

  /**
   * Find payments with pagination, filtering, searching, date range, and dynamic sorting
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching invoiceNumber or referenceNumber
   * @param {string} [options.paymentStatus] - Filter by payment status (PENDING, COMPLETED, FAILED, REFUNDED)
   * @param {string} [options.paymentMethod] - Filter by payment method (CASH, ONLINE)
   * @param {string|Date} [options.startDate] - Start date filter
   * @param {string|Date} [options.endDate] - End date filter
   * @param {string} [options.sortBy='createdAt'] - Field to sort by
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{payments: Array<Payment>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findPayments({
    page = 1,
    limit = 10,
    search,
    paymentStatus,
    paymentMethod,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};

    // Payment Status Filter
    if (paymentStatus) {
      query.paymentStatus = paymentStatus.toUpperCase();
    }

    // Payment Method Filter
    if (paymentMethod) {
      query.paymentMethod = paymentMethod.toUpperCase();
    }

    // Date Range Filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) query.createdAt.$lte = end;
      }
    }

    // Search Filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { invoiceNumber: searchRegex },
        { referenceNumber: searchRegex },
      ];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'amount', 'paymentStatus', 'invoiceNumber'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('order')
        .populate('processedBy', 'name email role')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Payment.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: payments,
      payments,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update Payment status
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Payment|null>}
   */
  async updatePaymentStatus(id, status) {
    const payment = await Payment.findById(id);
    if (!payment) return null;

    payment.paymentStatus = status.toUpperCase();
    await payment.save();

    return await Payment.findById(id)
      .populate('order')
      .populate('processedBy', 'name email role')
      .exec();
  }

  /**
   * Delete Payment record by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deletePayment(id) {
    const result = await Payment.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export const paymentRepository = new PaymentRepository();
