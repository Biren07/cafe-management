import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { categoryService } from '../services/category.service.js';

class CategoryController {
  /**
   * Create a new category (with optional image file)
   */
  createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body, req.file);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          category,
          RESPONSE_MESSAGES.CATEGORY_CREATED
        )
      );
  });

  /**
   * List categories with pagination, filtering, searching, and sorting
   */
  getCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getCategories(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.CATEGORIES_FETCHED
        )
      );
  });

  /**
   * Get single category by ID
   */
  getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          category,
          RESPONSE_MESSAGES.CATEGORY_FETCHED
        )
      );
  });

  /**
   * Update category by ID (with optional image file update)
   */
  updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
      req.file
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          category,
          RESPONSE_MESSAGES.CATEGORY_UPDATED
        )
      );
  });

  /**
   * Delete category by ID
   */
  deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.CATEGORY_DELETED
        )
      );
  });
}

export const categoryController = new CategoryController();
