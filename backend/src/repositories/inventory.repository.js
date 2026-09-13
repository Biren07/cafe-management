import { Inventory } from '../models/inventory.model.js';

class InventoryRepository {
  /**
   * Create a new Inventory Item document
   * @param {Object} itemData
   * @returns {Promise<Inventory>}
   */
  async createInventoryItem(itemData) {
    const inventory = new Inventory(itemData);
    const savedItem = await inventory.save();
    return await Inventory.findById(savedItem._id)
      .populate('category', 'name slug image status')
      .exec();
  }

  /**
   * Find Inventory Item by ID with populated Category and User references
   * @param {string} id
   * @returns {Promise<Inventory|null>}
   */
  async findById(id) {
    return await Inventory.findById(id)
      .populate('category', 'name slug image status')
      .populate('history.performedBy', 'name email role')
      .exec();
  }

  /**
   * Find Inventory Item by Name (case-insensitive)
   * @param {string} itemName
   * @returns {Promise<Inventory|null>}
   */
  async findByName(itemName) {
    return await Inventory.findOne({
      itemName: { $regex: new RegExp(`^${itemName.trim()}$`, 'i') },
    }).exec();
  }

  /**
   * Find inventory items with pagination, filtering, searching, dynamic sorting, and Category population
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching itemName or unit
   * @param {string} [options.category] - Filter by Category ObjectId
   * @param {boolean|string} [options.isLowStock] - Filter by low stock status
   * @param {string} [options.sortBy='createdAt'] - Field to sort by
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{items: Array<Inventory>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findInventoryItems({
    page = 1,
    limit = 10,
    search,
    category,
    isLowStock,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Low Stock
    if (isLowStock !== undefined && isLowStock !== null && isLowStock !== '') {
      query.isLowStock = isLowStock === true || isLowStock === 'true';
    }

    // Search by Item Name or Unit
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ itemName: searchRegex }, { unit: searchRegex }];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'itemName', 'currentStock', 'minimumStock'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Inventory.find(query)
        .populate('category', 'name slug image status')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Inventory.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * List items with low stock (currentStock <= minimumStock)
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @returns {Promise<Object>}
   */
  async findLowStockItems({ page = 1, limit = 10 }) {
    const query = {
      $expr: { $lte: ['$currentStock', '$minimumStock'] },
    };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Inventory.find(query)
        .populate('category', 'name slug image status')
        .sort({ currentStock: 1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Inventory.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Record Stock In or Stock Out movement and log transaction history entry
   * @param {string} id
   * @param {string} type - 'IN', 'OUT', or 'ADJUSTMENT'
   * @param {number} quantity
   * @param {string} reason
   * @param {string} userId
   * @returns {Promise<Inventory|null>}
   */
  async recordStockMovement(id, type, quantity, reason, userId) {
    const item = await Inventory.findById(id);
    if (!item) return null;

    const previousStock = item.currentStock;
    let newStock = previousStock;

    if (type === 'IN') {
      newStock = previousStock + quantity;
    } else if (type === 'OUT') {
      newStock = Math.max(0, previousStock - quantity);
    } else if (type === 'ADJUSTMENT') {
      newStock = quantity;
    }

    item.currentStock = newStock;
    item.isLowStock = newStock <= item.minimumStock;

    item.history.push({
      type,
      quantity,
      previousStock,
      newStock,
      reason: reason || '',
      performedBy: userId || null,
      createdAt: new Date(),
    });

    await item.save();

    return await Inventory.findById(id)
      .populate('category', 'name slug image status')
      .populate('history.performedBy', 'name email role')
      .exec();
  }

  /**
   * Update Inventory Item metadata
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Inventory|null>}
   */
  async updateInventoryItem(id, updateData) {
    const item = await Inventory.findById(id);
    if (!item) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        item[key] = updateData[key];
      }
    });

    item.isLowStock = item.currentStock <= item.minimumStock;
    await item.save();

    return await Inventory.findById(id)
      .populate('category', 'name slug image status')
      .exec();
  }

  /**
   * Delete Inventory Item by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteInventoryItem(id) {
    const result = await Inventory.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export const inventoryRepository = new InventoryRepository();
