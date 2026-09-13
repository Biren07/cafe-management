import { menuRepository } from '../repositories/menu.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

class MenuService {
  /**
   * Create a new menu item with category validation & Cloudinary image upload
   * @param {Object} menuData
   * @param {Object} [file] - Express.Multer file object
   * @returns {Promise<MenuItem>}
   */
  async createMenuItem(menuData, file) {
    const { name, category, price, preparationTime, isAvailable } = menuData;

    // Validate Category existence
    const existingCategory = await categoryRepository.findById(category);
    if (!existingCategory) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.INVALID_CATEGORY_ID
      );
    }

    // Duplicate check for Name
    const existingItem = await menuRepository.findByName(name);
    if (existingItem) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `Menu item with name '${name}' already exists.`
      );
    }

    // Coerce numeric & boolean fields
    if (price !== undefined) menuData.price = parseFloat(price);
    if (preparationTime !== undefined) menuData.preparationTime = parseInt(preparationTime, 10);
    if (isAvailable !== undefined) {
      menuData.isAvailable = isAvailable === true || isAvailable === 'true';
    }

    // Handle Cloudinary Image Upload
    if (file && file.path) {
      const uploadResult = await uploadOnCloudinary(file.path, 'menu');
      if (uploadResult) {
        menuData.image = uploadResult.secure_url;
        menuData.imagePublicId = uploadResult.public_id;
      }
    }

    return await menuRepository.createMenuItem(menuData);
  }

  /**
   * List menu items with pagination, filtering, searching, dynamic sorting, and populated Category
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getMenuItems(queryParams) {
    return await menuRepository.findMenuItems(queryParams);
  }

  /**
   * Get single menu item by ID
   * @param {string} id
   * @returns {Promise<MenuItem>}
   */
  async getMenuItemById(id) {
    const menuItem = await menuRepository.findById(id);
    if (!menuItem) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.MENU_ITEM_NOT_FOUND);
    }
    return menuItem;
  }

  /**
   * Update existing menu item by ID with optional image replacement & category re-validation
   * @param {string} id
   * @param {Object} updateData
   * @param {Object} [file] - Express.Multer file object
   * @returns {Promise<MenuItem>}
   */
  async updateMenuItem(id, updateData, file) {
    const existingItem = await menuRepository.findById(id);
    if (!existingItem) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.MENU_ITEM_NOT_FOUND);
    }

    // Validate Category if updated
    if (updateData.category && updateData.category !== existingItem.category._id.toString()) {
      const categoryExists = await categoryRepository.findById(updateData.category);
      if (!categoryExists) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.INVALID_CATEGORY_ID
        );
      }
    }

    // Duplicate check for Name if changing
    if (updateData.name && updateData.name.trim().toLowerCase() !== existingItem.name.toLowerCase()) {
      const duplicateName = await menuRepository.findByName(updateData.name);
      if (duplicateName && duplicateName._id.toString() !== id) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Menu item with name '${updateData.name}' already exists.`
        );
      }
    }

    // Coerce numeric & boolean fields if provided
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.preparationTime !== undefined) {
      updateData.preparationTime = parseInt(updateData.preparationTime, 10);
    }
    if (updateData.isAvailable !== undefined) {
      updateData.isAvailable = updateData.isAvailable === true || updateData.isAvailable === 'true';
    }

    // Handle Cloudinary Image Replacement
    if (file && file.path) {
      const uploadResult = await uploadOnCloudinary(file.path, 'menu');
      if (uploadResult) {
        if (existingItem.imagePublicId) {
          await deleteFromCloudinary(existingItem.imagePublicId);
        }
        updateData.image = uploadResult.secure_url;
        updateData.imagePublicId = uploadResult.public_id;
      }
    }

    return await menuRepository.updateMenuItem(id, updateData);
  }

  /**
   * Delete menu item by ID and clean up Cloudinary asset
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteMenuItem(id) {
    const menuItem = await menuRepository.findById(id);
    if (!menuItem) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.MENU_ITEM_NOT_FOUND);
    }

    if (menuItem.imagePublicId) {
      await deleteFromCloudinary(menuItem.imagePublicId);
    }

    return await menuRepository.deleteMenuItem(id);
  }
}

export const menuService = new MenuService();
