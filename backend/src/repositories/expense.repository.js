import { Expense } from '../models/expense.model.js';

class ExpenseRepository {
  /**
   * Create new Expense record
   * @param {Object} expenseData
   * @returns {Promise<Expense>}
   */
  async create(expenseData) {
    const expense = await Expense.create(expenseData);
    return await expense.populate('createdBy', 'name email role');
  }

  /**
   * Find Expense by ID (excluding soft-deleted)
   * @param {string} id
   * @returns {Promise<Expense|null>}
   */
  async findById(id) {
    return await Expense.findOne({ _id: id, isDeleted: false })
      .populate('createdBy', 'name email role')
      .exec();
  }

  /**
   * Find paginated expenses with search, filtering, and sorting
   * @param {Object} options
   * @returns {Promise<{ expenses: Array<Expense>, total: number, page: number, limit: number, totalPages: number }>}
   */
  async findAll({
    page = 1,
    limit = 10,
    search = '',
    category = '',
    startDate = null,
    endDate = null,
    minAmount = null,
    maxAmount = null,
    sortBy = 'expenseDate',
    sortOrder = 'desc',
  }) {
    const query = { isDeleted: false };

    // Search by title, description, or category
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category.trim() !== '') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Date range filtering
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) {
        query.expenseDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.expenseDate.$lte = end;
      }
    }

    // Amount range filtering
    if (minAmount !== null || maxAmount !== null) {
      query.amount = {};
      if (minAmount !== null && !isNaN(minAmount)) {
        query.amount.$gte = Number(minAmount);
      }
      if (maxAmount !== null && !isNaN(maxAmount)) {
        query.amount.$lte = Number(maxAmount);
      }
    }

    // Sorting
    const sort = {};
    const validSortFields = ['expenseDate', 'createdAt', 'updatedAt', 'amount', 'title', 'category'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'expenseDate';
    sort[sortField] = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email role')
        .exec(),
      Expense.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: expenses,
      expenses,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update Expense record by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Expense|null>}
   */
  async update(id, updateData) {
    return await Expense.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email role')
      .exec();
  }

  /**
   * Soft delete Expense record by ID
   * @param {string} id
   * @returns {Promise<Expense|null>}
   */
  async softDelete(id) {
    return await Expense.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();
  }
}

export const expenseRepository = new ExpenseRepository();
