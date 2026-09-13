import { MenuItem } from '../models/menu.model.js';

class MenuRepository {
  /**
   * Create a new Menu Item document
   * @param {Object} menuData
   * @returns {Promise<MenuItem>}
   */
  async createMenuItem(menuData) {
    const menuItem = new MenuItem(menuData);
    const savedItem = await menuItem.save();
    return await MenuItem.findById(savedItem._id).populate('category', 'name slug image status').exec();
  }

  /**
   * Find Menu Item by ID with populated Category
   * @param {string} id
   * @returns {Promise<MenuItem|null>}
   */
  async findById(id) {
    return await MenuItem.findById(id)
      .populate('category', 'name slug image status')
      .exec();
  }

  /**
   * Find Menu Item by Name (case-insensitive)
   * @param {string} name
   * @returns {Promise<MenuItem|null>}
   */
  async findByName(name) {
    return await MenuItem.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    }).exec();
  }

  /**
   * Find menu items with pagination, filtering, searching, dynamic sorting, and Category population
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching name or description
   * @param {string} [options.category] - Filter by Category ObjectId
   * @param {boolean|string} [options.isAvailable] - Filter by availability status
   * @param {number} [options.minPrice] - Minimum price filter
   * @param {number} [options.maxPrice] - Maximum price filter
   * @param {string} [options.sortBy='createdAt'] - Sort field
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{menuItems: Array<MenuItem>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findMenuItems({
    page = 1,
    limit = 10,
    search,
    category,
    isAvailable,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};

    // Filter by Category ObjectId
    if (category) {
      query.category = category;
    }

    // Filter by Availability
    if (isAvailable !== undefined && isAvailable !== null && isAvailable !== '') {
      query.isAvailable = isAvailable === true || isAvailable === 'true';
    }

    // Filter by Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) query.price.$gte = min;
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) query.price.$lte = max;
      }
    }

    // Search by Name or Description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'price', 'name', 'preparationTime'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [menuItems, total] = await Promise.all([
      MenuItem.find(query)
        .populate('category', 'name slug image status')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      MenuItem.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: menuItems,
      menuItems,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update Menu Item by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<MenuItem|null>}
   */
  async updateMenuItem(id, updateData) {
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        menuItem[key] = updateData[key];
      }
    });

    await menuItem.save();
    return await MenuItem.findById(id).populate('category', 'name slug image status').exec();
  }

  /**
   * Delete Menu Item by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteMenuItem(id) {
    const result = await MenuItem.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export const menuRepository = new MenuRepository();
