import { Order } from '../models/order.model.js';

class OrderRepository {
  /**
   * Create a new Order document
   * @param {Object} orderData
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Order>}
   */
  async createOrder(orderData, options = {}) {
    const { session } = options;
    const order = new Order(orderData);
    const savedOrder = await order.save({ session });
    
    return await Order.findById(savedOrder._id)
      .populate('items.menuItem', 'name price category image')
      .populate('createdBy', 'name email role')
      .populate('table', 'tableNumber tableName capacity status isActive')
      .session(session || null)
      .exec();
  }

  /**
   * Find Order by Mongo ID with populated references
   * @param {string} id
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Order|null>}
   */
  async findById(id, options = {}) {
    const { session } = options;
    return await Order.findById(id)
      .populate('items.menuItem', 'name price category image')
      .populate('createdBy', 'name email role')
      .populate('table', 'tableNumber tableName capacity status isActive')
      .session(session || null)
      .exec();
  }

  /**
   * Find Order by unique Order Number
   * @param {string} orderNumber
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Order|null>}
   */
  async findByOrderNumber(orderNumber, options = {}) {
    const { session } = options;
    return await Order.findOne({ orderNumber: orderNumber.toUpperCase() })
      .populate('items.menuItem', 'name price category image')
      .populate('createdBy', 'name email role')
      .populate('table', 'tableNumber tableName capacity status isActive')
      .session(session || null)
      .exec();
  }

  /**
   * Find orders with pagination, filtering, searching, date range, and sorting
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching orderNumber or notes
   * @param {string} [options.status] - Filter by order status (PENDING, PREPARING, SERVED, COMPLETED, CANCELLED)
   * @param {string} [options.orderType] - Filter by order type (DINE_IN, TAKE_AWAY)
   * @param {string} [options.table] - Filter by table ID
   * @param {string|Date} [options.startDate] - Start date filter
   * @param {string|Date} [options.endDate] - End date filter
   * @param {string} [options.sortBy='createdAt'] - Field to sort by
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{orders: Array<Order>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findOrders({
    page = 1,
    limit = 10,
    search,
    status,
    orderType,
    table,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};

    // Status Filter
    if (status) {
      query.status = status.toUpperCase();
    }

    // Order Type Filter
    if (orderType) {
      query.orderType = orderType.toUpperCase();
    }

    // Table Filter
    if (table) {
      query.table = table;
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
        { orderNumber: searchRegex },
        { notes: searchRegex },
      ];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'total', 'status', 'orderNumber'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.menuItem', 'name price category image')
        .populate('createdBy', 'name email role')
        .populate('table', 'tableNumber tableName capacity status isActive')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: orders,
      orders,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update Order status
   * @param {string} id
   * @param {string} status
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Order|null>}
   */
  async updateOrderStatus(id, status, options = {}) {
    const { session } = options;
    const order = await Order.findById(id).session(session || null);
    if (!order) return null;

    order.status = status.toUpperCase();
    await order.save({ session });

    return await Order.findById(id)
      .populate('items.menuItem', 'name price category image')
      .populate('createdBy', 'name email role')
      .populate('table', 'tableNumber tableName capacity status isActive')
      .session(session || null)
      .exec();
  }

  /**
   * Update Order details
   * @param {string} id
   * @param {Object} updateData
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Order|null>}
   */
  async updateOrder(id, updateData, options = {}) {
    const { session } = options;
    const order = await Order.findById(id).session(session || null);
    if (!order) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        order[key] = updateData[key];
      }
    });

    await order.save({ session });

    return await Order.findById(id)
      .populate('items.menuItem', 'name price category image')
      .populate('createdBy', 'name email role')
      .populate('table', 'tableNumber tableName capacity status isActive')
      .session(session || null)
      .exec();
  }

  /**
   * Delete Order by ID
   * @param {string} id
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<boolean>}
   */
  async deleteOrder(id, options = {}) {
    const { session } = options;
    const result = await Order.findByIdAndDelete(id, { session }).exec();
    return !!result;
  }
}

export const orderRepository = new OrderRepository();
