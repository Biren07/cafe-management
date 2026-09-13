import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { tableService } from '../services/table.service.js';

class TableController {
  /**
   * Create a new table
   * POST /api/v1/tables
   */
  createTable = asyncHandler(async (req, res) => {
    const table = await tableService.createTable(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          table,
          RESPONSE_MESSAGES.TABLE_CREATED
        )
      );
  });

  /**
   * List all tables with pagination, search, sorting & filtering
   * GET /api/v1/tables
   */
  getTables = asyncHandler(async (req, res) => {
    const result = await tableService.getAllTables(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.TABLES_FETCHED
        )
      );
  });

  /**
   * Get single table details by ID
   * GET /api/v1/tables/:id
   */
  getTableById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const table = await tableService.getTableById(id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          table,
          RESPONSE_MESSAGES.TABLE_FETCHED
        )
      );
  });

  /**
   * Update table details
   * PUT /api/v1/tables/:id
   */
  updateTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const table = await tableService.updateTable(id, req.body);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          table,
          RESPONSE_MESSAGES.TABLE_UPDATED
        )
      );
  });

  /**
   * Update table status
   * PATCH /api/v1/tables/:id/status
   */
  updateTableStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const table = await tableService.updateTableStatus(id, status);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          table,
          RESPONSE_MESSAGES.TABLE_STATUS_UPDATED
        )
      );
  });

  /**
   * Delete table (Soft delete)
   * DELETE /api/v1/tables/:id
   */
  deleteTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await tableService.deleteTable(id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.TABLE_DELETED
        )
      );
  });
}

export const tableController = new TableController();
