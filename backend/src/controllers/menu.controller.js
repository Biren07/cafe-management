import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { menuService } from '../services/menu.service.js';

class MenuController {
  /**
   * Create a new menu item (with optional image file)
   */
  createMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await menuService.createMenuItem(req.body, req.file);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          menuItem,
          RESPONSE_MESSAGES.MENU_ITEM_CREATED
        )
      );
  });

  /**
   * List menu items with pagination, filtering, searching, dynamic sorting, and Category population
   */
  getMenuItems = asyncHandler(async (req, res) => {
    const result = await menuService.getMenuItems(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.MENU_ITEMS_FETCHED
        )
      );
  });

  /**
   * Get single menu item by ID
   */
  getMenuItemById = asyncHandler(async (req, res) => {
    const menuItem = await menuService.getMenuItemById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          menuItem,
          RESPONSE_MESSAGES.MENU_ITEM_FETCHED
        )
      );
  });

  /**
   * Update menu item by ID (with optional image replacement)
   */
  updateMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await menuService.updateMenuItem(
      req.params.id,
      req.body,
      req.file
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          menuItem,
          RESPONSE_MESSAGES.MENU_ITEM_UPDATED
        )
      );
  });

  /**
   * Delete menu item by ID
   */
  deleteMenuItem = asyncHandler(async (req, res) => {
    await menuService.deleteMenuItem(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.MENU_ITEM_DELETED
        )
      );
  });
}

export const menuController = new MenuController();
