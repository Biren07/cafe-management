import { Table } from '../models/table.model.js';

class TableRepository {
  /**
   * Create a new Table document
   * @param {Object} tableData
   * @returns {Promise<Table>}
   */
  async createTable(tableData) {
    const table = new Table(tableData);
    return await table.save();
  }

  /**
   * Find Table by ID (excluding soft-deleted ones)
   * @param {string} id
   * @returns {Promise<Table|null>}
   */
  async findById(id) {
    return await Table.findOne({ _id: id, isDeleted: false }).exec();
  }

  /**
   * Find Table by Table Number (case-insensitive string/number comparison)
   * @param {string|number} tableNumber
   * @param {string} [excludeId]
   * @returns {Promise<Table|null>}
   */
  async findByTableNumber(tableNumber, excludeId = null) {
    const query = {
      tableNumber: { $regex: new RegExp(`^${tableNumber.toString().trim()}$`, 'i') },
      isDeleted: false,
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await Table.findOne(query).exec();
  }

  /**
   * Find tables with pagination, filtering, searching, and sorting
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching tableName, tableNumber, or description
   * @param {string} [options.status] - Filter by status (AVAILABLE, OCCUPIED, CLEANING, RESERVED)
   * @param {number} [options.minCapacity] - Filter by minimum capacity
   * @param {boolean} [options.isActive] - Filter by active status
   * @param {string} [options.sortBy='tableNumber'] - Field to sort by
   * @param {string} [options.sortOrder='asc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{tables: Array<Table>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findTables({
    page = 1,
    limit = 10,
    search,
    status,
    minCapacity,
    isActive,
    sortBy = 'tableNumber',
    sortOrder = 'asc',
  }) {
    const query = { isDeleted: false };

    // Status Filter
    if (status) {
      query.status = status.toUpperCase();
    }

    // IsActive Filter
    if (isActive !== undefined && isActive !== null) {
      query.isActive = isActive === true || isActive === 'true';
    }

    // Min Capacity Filter
    if (minCapacity && !isNaN(parseInt(minCapacity, 10))) {
      query.capacity = { $gte: parseInt(minCapacity, 10) };
    }

    // Search Filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { tableName: searchRegex },
        { tableNumber: searchRegex },
        { description: searchRegex },
      ];
    }

    // Sorting Configuration
    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'tableNumber',
      'tableName',
      'capacity',
      'status',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'tableNumber';
    const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [tables, total] = await Promise.all([
      Table.find(query).sort(sortOptions).skip(skip).limit(limitNum).exec(),
      Table.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: tables,
      tables,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update table by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Table|null>}
   */
  async updateTable(id, updateData) {
    const table = await this.findById(id);
    if (!table) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        table[key] = updateData[key];
      }
    });

    await table.save();
    return table;
  }

  /**
   * Update table status
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Table|null>}
   */
  async updateStatus(id, status) {
    const table = await this.findById(id);
    if (!table) return null;

    table.status = status.toUpperCase();
    await table.save();
    return table;
  }

  /**
   * Soft delete table by ID
   * @param {string} id
   * @returns {Promise<Table|null>}
   */
  async softDelete(id) {
    const table = await this.findById(id);
    if (!table) return null;

    table.isDeleted = true;
    table.isActive = false;
    await table.save();
    return table;
  }
}

export const tableRepository = new TableRepository();
