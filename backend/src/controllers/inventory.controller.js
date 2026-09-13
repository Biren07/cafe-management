import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { inventoryService } from '../services/inventory.service.js';

class InventoryController {
  /**
   * Add new inventory item (Manager & Owner)
   */
  createInventoryItem = asyncHandler(async (req, res) => {
    const item = await inventoryService.createInventoryItem(
      req.body,
      req.user._id
    );
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          item,
          RESPONSE_MESSAGES.INVENTORY_ITEM_CREATED
        )
      );
  });

  /**
   * List inventory items with pagination, filtering, searching, and sorting
   */
  getInventoryItems = asyncHandler(async (req, res) => {
    const result = await inventoryService.getInventoryItems(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.INVENTORY_FETCHED
        )
      );
  });

  /**
   * List items requiring reordering (currentStock <= minimumStock)
   */
  getLowStockItems = asyncHandler(async (req, res) => {
    const result = await inventoryService.getLowStockItems(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.LOW_STOCK_FETCHED
        )
      );
  });

  /**
   * Get single inventory item details by ID
   */
  getInventoryItemById = asyncHandler(async (req, res) => {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          item,
          RESPONSE_MESSAGES.INVENTORY_ITEM_FETCHED
        )
      );
  });

  /**
   * Get transaction history log for an inventory item
   */
  getItemHistory = asyncHandler(async (req, res) => {
    const history = await inventoryService.getItemHistory(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          history,
          RESPONSE_MESSAGES.INVENTORY_HISTORY_FETCHED
        )
      );
  });

  /**
   * Stock In movement (Add stock)
   */
  stockIn = asyncHandler(async (req, res) => {
    const item = await inventoryService.stockIn(
      req.params.id,
      req.body.quantity,
      req.body.reason,
      req.user._id
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          item,
          RESPONSE_MESSAGES.STOCK_IN_SUCCESS
        )
      );
  });

  /**
   * Stock Out movement (Reduce stock)
   */
  stockOut = asyncHandler(async (req, res) => {
    const item = await inventoryService.stockOut(
      req.params.id,
      req.body.quantity,
      req.body.reason,
      req.user._id
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          item,
          RESPONSE_MESSAGES.STOCK_OUT_SUCCESS
        )
      );
  });

  /**
   * Update inventory item metadata
   */
  updateInventoryItem = asyncHandler(async (req, res) => {
    const item = await inventoryService.updateInventoryItem(
      req.params.id,
      req.body
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          item,
          RESPONSE_MESSAGES.INVENTORY_ITEM_UPDATED
        )
      );
  });

  /**
   * Delete inventory item by ID
   */
  deleteInventoryItem = asyncHandler(async (req, res) => {
    await inventoryService.deleteInventoryItem(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.INVENTORY_ITEM_DELETED
        )
      );
  });
}

export const inventoryController = new InventoryController();
