import { Category } from '../models/category.model.js';

class CategoryRepository {
  /**
   * Create a new Category document
   * @param {Object} categoryData
   * @returns {Promise<Category>}
   */
  async createCategory(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  /**
   * Find Category by ID
   * @param {string} id
   * @returns {Promise<Category|null>}
   */
  async findById(id) {
    return await Category.findById(id).exec();
  }

  /**
   * Find Category by Slug
   * @param {string} slug
   * @returns {Promise<Category|null>}
   */
  async findBySlug(slug) {
    return await Category.findOne({ slug: slug.toLowerCase() }).exec();
  }

  /**
   * Find Category by Name (case-insensitive)
   * @param {string} name
   * @returns {Promise<Category|null>}
   */
  async findByName(name) {
    return await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    }).exec();
  }

  /**
   * Find categories with pagination, filtering, searching, and sorting
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching name, description, or slug
   * @param {string} [options.status] - Filter by status (ACTIVE, INACTIVE)
   * @param {string} [options.sortBy='createdAt'] - Field to sort by
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{categories: Array<Category>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findCategories({
    page = 1,
    limit = 10,
    search,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};

    // Status Filter
    if (status) {
      query.status = status.toUpperCase();
    }

    // Search Filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { slug: searchRegex },
      ];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'status', 'slug'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [categories, total] = await Promise.all([
      Category.find(query).sort(sortOptions).skip(skip).limit(limitNum).exec(),
      Category.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: categories,
      categories,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update category by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Category|null>}
   */
  async updateCategory(id, updateData) {
    const category = await Category.findById(id);
    if (!category) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        category[key] = updateData[key];
      }
    });

    if (updateData.status) {
      category.isActive = updateData.status === 'ACTIVE';
    }

    await category.save();
    return category;
  }

  /**
   * Delete category by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteCategory(id) {
    const result = await Category.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export const categoryRepository = new CategoryRepository();
