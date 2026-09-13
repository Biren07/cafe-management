import { Billing } from '../models/billing.model.js';

class BillingRepository {
  /**
   * Create a new Billing document
   * @param {Object} billData
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing>}
   */
  async createBill(billData, options = {}) {
    const { session } = options;
    const bill = new Billing(billData);
    const savedBill = await bill.save({ session });

    return await Billing.findById(savedBill._id)
      .populate({
        path: 'order',
        populate: [
          { path: 'items.menuItem', select: 'name price category image' },
          { path: 'table', select: 'tableNumber tableName capacity status' },
          { path: 'createdBy', select: 'name email role' },
        ],
      })
      .populate('createdBy', 'name email role')
      .populate('history.performedBy', 'name email role')
      .session(session || null)
      .exec();
  }

  /**
   * Find Billing by ID with populated references
   * @param {string} id
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing|null>}
   */
  async findById(id, options = {}) {
    const { session } = options;
    return await Billing.findById(id)
      .populate({
        path: 'order',
        populate: [
          { path: 'items.menuItem', select: 'name price category image' },
          { path: 'table', select: 'tableNumber tableName capacity status' },
          { path: 'createdBy', select: 'name email role' },
        ],
      })
      .populate('createdBy', 'name email role')
      .populate('history.performedBy', 'name email role')
      .session(session || null)
      .exec();
  }

  /**
   * Find Billing by unique Receipt Number
   * @param {string} receiptNumber
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing|null>}
   */
  async findByReceiptNumber(receiptNumber, options = {}) {
    const { session } = options;
    return await Billing.findOne({ receiptNumber: receiptNumber.toUpperCase() })
      .populate({
        path: 'order',
        populate: [
          { path: 'items.menuItem', select: 'name price category image' },
          { path: 'table', select: 'tableNumber tableName capacity status' },
          { path: 'createdBy', select: 'name email role' },
        ],
      })
      .populate('createdBy', 'name email role')
      .populate('history.performedBy', 'name email role')
      .session(session || null)
      .exec();
  }

  /**
   * Find Billing by target Order ID
   * @param {string} orderId
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing|null>}
   */
  async findByOrder(orderId, options = {}) {
    const { session } = options;
    return await Billing.findOne({ order: orderId })
      .populate({
        path: 'order',
        populate: [
          { path: 'items.menuItem', select: 'name price category image' },
          { path: 'table', select: 'tableNumber tableName capacity status' },
          { path: 'createdBy', select: 'name email role' },
        ],
      })
      .populate('createdBy', 'name email role')
      .populate('history.performedBy', 'name email role')
      .session(session || null)
      .exec();
  }

  /**
   * Find bills with pagination, filtering, searching, date range, and sorting
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching receiptNumber
   * @param {string} [options.status] - Filter by status (PENDING, PAID, CANCELLED)
   * @param {boolean} [options.isSplit] - Filter by split status
   * @param {string|Date} [options.startDate] - Start date filter
   * @param {string|Date} [options.endDate] - End date filter
   * @param {string} [options.sortBy='createdAt'] - Field to sort by
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{bills: Array<Billing>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findBills({
    page = 1,
    limit = 10,
    search,
    status,
    isSplit,
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

    // IsSplit Filter
    if (isSplit !== undefined && isSplit !== null) {
      query.isSplit = isSplit === true || isSplit === 'true';
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
      query.$or = [{ receiptNumber: searchRegex }];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'grandTotal', 'status', 'receiptNumber'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [bills, total] = await Promise.all([
      Billing.find(query)
        .populate({
          path: 'order',
          populate: [
            { path: 'items.menuItem', select: 'name price category image' },
            { path: 'table', select: 'tableNumber tableName capacity status' },
            { path: 'createdBy', select: 'name email role' },
          ],
        })
        .populate('createdBy', 'name email role')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Billing.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: bills,
      bills,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update Bill status with audit history log
   * @param {string} id
   * @param {string} status
   * @param {Object} historyEntry
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing|null>}
   */
  async updateBillStatus(id, status, historyEntry, options = {}) {
    const { session } = options;
    const bill = await Billing.findById(id).session(session || null);
    if (!bill) return null;

    bill.status = status.toUpperCase();
    if (historyEntry) {
      bill.history.push(historyEntry);
    }
    await bill.save({ session });

    return await this.findById(id, { session });
  }

  /**
   * Update Split Bill configuration & details with audit history log
   * @param {string} id
   * @param {number} splitCount
   * @param {Array<Object>} splitDetails
   * @param {Object} historyEntry
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing|null>}
   */
  async updateSplitBill(id, splitCount, splitDetails, historyEntry, options = {}) {
    const { session } = options;
    const bill = await Billing.findById(id).session(session || null);
    if (!bill) return null;

    bill.isSplit = true;
    bill.splitCount = splitCount;
    bill.splitDetails = splitDetails;
    if (historyEntry) {
      bill.history.push(historyEntry);
    }

    await bill.save({ session });
    return await this.findById(id, { session });
  }

  /**
   * Append audit log history entry to bill
   * @param {string} id
   * @param {Object} historyEntry
   * @param {Object} [options]
   * @param {ClientSession} [options.session]
   * @returns {Promise<Billing|null>}
   */
  async addHistoryEntry(id, historyEntry, options = {}) {
    const { session } = options;
    const bill = await Billing.findById(id).session(session || null);
    if (!bill) return null;

    bill.history.push(historyEntry);
    await bill.save({ session });

    return await this.findById(id, { session });
  }
}

export const billingRepository = new BillingRepository();
