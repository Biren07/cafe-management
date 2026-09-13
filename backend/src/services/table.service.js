import { tableRepository } from '../repositories/table.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { TABLE_STATUS } from '../models/table.model.js';

class TableService {
  /**
   * Create a new cafe table
   * @param {Object} tableData
   * @param {string|number} tableData.tableNumber
   * @param {string} tableData.tableName
   * @param {number} tableData.capacity
   * @param {string} [tableData.status]
   * @param {string} [tableData.description]
   * @param {boolean} [tableData.isActive]
   * @returns {Promise<Object>}
   */
  async createTable(tableData) {
    const { tableNumber, status, isActive } = tableData;

    // Check unique table number
    const existingTable = await tableRepository.findByTableNumber(tableNumber);
    if (existingTable) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        RESPONSE_MESSAGES.TABLE_NUMBER_EXISTS
      );
    }

    // Business Rule: Cannot set status to OCCUPIED for an inactive table
    const targetStatus = status ? status.toUpperCase() : TABLE_STATUS.AVAILABLE;
    const targetIsActive = isActive !== undefined ? Boolean(isActive) : true;

    if (!targetIsActive && targetStatus === TABLE_STATUS.OCCUPIED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.CANNOT_OCCUPY_INACTIVE_TABLE
      );
    }

    return await tableRepository.createTable({
      ...tableData,
      status: targetStatus,
      isActive: targetIsActive,
    });
  }

  /**
   * Get all tables with pagination, search, sorting, and filtering
   * @param {Object} queryParams
   * @returns {Promise<{tables: Array<Object>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async getAllTables(queryParams) {
    return await tableRepository.findTables(queryParams);
  }

  /**
   * Get table by ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getTableById(id) {
    const table = await tableRepository.findById(id);
    if (!table) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.TABLE_NOT_FOUND
      );
    }
    return table;
  }

  /**
   * Update table details
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateTable(id, updateData) {
    const existingTable = await tableRepository.findById(id);
    if (!existingTable) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.TABLE_NOT_FOUND
      );
    }

    // Check uniqueness if tableNumber is modified
    if (
      updateData.tableNumber &&
      updateData.tableNumber.toString().trim() !== existingTable.tableNumber
    ) {
      const duplicateNumber = await tableRepository.findByTableNumber(
        updateData.tableNumber,
        id
      );
      if (duplicateNumber) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          RESPONSE_MESSAGES.TABLE_NUMBER_EXISTS
        );
      }
    }

    // Check status vs active logic
    const nextIsActive =
      updateData.isActive !== undefined
        ? Boolean(updateData.isActive)
        : existingTable.isActive;

    const nextStatus = updateData.status
      ? updateData.status.toUpperCase()
      : existingTable.status;

    if (!nextIsActive && nextStatus === TABLE_STATUS.OCCUPIED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.CANNOT_OCCUPY_INACTIVE_TABLE
      );
    }

    const updatedTable = await tableRepository.updateTable(id, {
      ...updateData,
      status: nextStatus,
      isActive: nextIsActive,
    });

    return updatedTable;
  }

  /**
   * Update table status
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateTableStatus(id, status) {
    const table = await tableRepository.findById(id);
    if (!table) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.TABLE_NOT_FOUND
      );
    }

    const formattedStatus = status.toUpperCase();

    // Business Rule: Cannot occupy an inactive table
    if (!table.isActive && formattedStatus === TABLE_STATUS.OCCUPIED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.CANNOT_OCCUPY_INACTIVE_TABLE
      );
    }

    return await tableRepository.updateStatus(id, formattedStatus);
  }

  /**
   * Soft delete table
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteTable(id) {
    const table = await tableRepository.findById(id);
    if (!table) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.TABLE_NOT_FOUND
      );
    }

    // Business Rule: Cannot delete occupied table
    if (table.status === TABLE_STATUS.OCCUPIED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.CANNOT_DELETE_OCCUPIED_TABLE
      );
    }

    await tableRepository.softDelete(id);
    return true;
  }
}

export const tableService = new TableService();
