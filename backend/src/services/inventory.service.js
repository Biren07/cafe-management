import { inventoryRepository } from '../repositories/inventory.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

class InventoryService {
  /**
   * Create a new inventory item
   * @param {Object} itemData
   * @param {string} userId - ID of user creating the item
   * @returns {Promise<Inventory>}
   */
  async createInventoryItem(itemData, userId) {
    const { itemName, category, currentStock, minimumStock } = itemData;

    // Check duplicate Item Name
    const existing = await inventoryRepository.findByName(itemName);
    if (existing) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `Inventory item with name '${itemName}' already exists.`
      );
    }

    // Validate Category if provided
    if (category) {
      const categoryExists = await categoryRepository.findById(category);
      if (!categoryExists) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.INVALID_CATEGORY_ID
        );
      }
    }

    const stock = Math.max(0, parseFloat(currentStock) || 0);
    const minStock = Math.max(0, parseFloat(minimumStock) || 0);

    itemData.currentStock = stock;
    itemData.minimumStock = minStock;

    // Log initial stock entry if stock > 0
    if (stock > 0) {
      itemData.history = [
        {
          type: 'IN',
          quantity: stock,
          previousStock: 0,
          newStock: stock,
          reason: 'Initial Stock Entry',
          performedBy: userId || null,
          createdAt: new Date(),
        },
      ];
    }

    return await inventoryRepository.createInventoryItem(itemData);
  }

  /**
   * List inventory items with pagination, filtering, search, and dynamic sorting
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getInventoryItems(queryParams) {
    return await inventoryRepository.findInventoryItems(queryParams);
  }

  /**
   * List low stock inventory items (currentStock <= minimumStock)
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getLowStockItems(queryParams) {
    return await inventoryRepository.findLowStockItems(queryParams);
  }

  /**
   * Get single inventory item details by ID
   * @param {string} id
   * @returns {Promise<Inventory>}
   */
  async getInventoryItemById(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.INVENTORY_ITEM_NOT_FOUND);
    }
    return item;
  }

  /**
   * Get transaction history logs for an inventory item
   * @param {string} id
   * @returns {Promise<Array>}
   */
  async getItemHistory(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.INVENTORY_ITEM_NOT_FOUND);
    }
    return item.history;
  }

  /**
   * Add stock (Stock In) for an inventory item
   * @param {string} id
   * @param {number} quantity
   * @param {string} [reason]
   * @param {string} userId
   * @returns {Promise<Inventory>}
   */
  async stockIn(id, quantity, reason, userId) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.INVENTORY_ITEM_NOT_FOUND);
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Stock In quantity must be a number greater than 0.');
    }

    return await inventoryRepository.recordStockMovement(
      id,
      'IN',
      numQty,
      reason || 'Stock In Restock',
      userId
    );
  }

  /**
   * Remove stock (Stock Out) for an inventory item
   * @param {string} id
   * @param {number} quantity
   * @param {string} [reason]
   * @param {string} userId
   * @returns {Promise<Inventory>}
   */
  async stockOut(id, quantity, reason, userId) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.INVENTORY_ITEM_NOT_FOUND);
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Stock Out quantity must be a number greater than 0.');
    }

    if (item.currentStock < numQty) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `${RESPONSE_MESSAGES.INSUFFICIENT_STOCK} Available: ${item.currentStock} ${item.unit}, Requested: ${numQty} ${item.unit}.`
      );
    }

    return await inventoryRepository.recordStockMovement(
      id,
      'OUT',
      numQty,
      reason || 'Stock Out Reduction',
      userId
    );
  }

  /**
   * Update Inventory Item metadata
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Inventory>}
   */
  async updateInventoryItem(id, updateData) {
    const existingItem = await inventoryRepository.findById(id);
    if (!existingItem) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.INVENTORY_ITEM_NOT_FOUND);
    }

    if (updateData.itemName && updateData.itemName.trim().toLowerCase() !== existingItem.itemName.toLowerCase()) {
      const duplicate = await inventoryRepository.findByName(updateData.itemName);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Inventory item with name '${updateData.itemName}' already exists.`
        );
      }
    }

    if (updateData.category && updateData.category !== (existingItem.category ? existingItem.category._id.toString() : '')) {
      const categoryExists = await categoryRepository.findById(updateData.category);
      if (!categoryExists) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.INVALID_CATEGORY_ID
        );
      }
    }

    if (updateData.minimumStock !== undefined) {
      updateData.minimumStock = Math.max(0, parseFloat(updateData.minimumStock) || 0);
    }

    if (updateData.currentStock !== undefined) {
      updateData.currentStock = Math.max(0, parseFloat(updateData.currentStock) || 0);
    }

    return await inventoryRepository.updateInventoryItem(id, updateData);
  }

  /**
   * Delete Inventory Item by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteInventoryItem(id) {
    const existingItem = await inventoryRepository.findById(id);
    if (!existingItem) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.INVENTORY_ITEM_NOT_FOUND);
    }

    return await inventoryRepository.deleteInventoryItem(id);
  }
}

export const inventoryService = new InventoryService();
