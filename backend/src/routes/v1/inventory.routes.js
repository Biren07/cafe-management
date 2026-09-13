import { Router } from 'express';
import { inventoryController } from '../../controllers/inventory.controller.js';
import {
  createInventoryValidation,
  stockMovementValidation,
  updateInventoryValidation,
  listInventoryValidation,
  inventoryIdParamValidation,
} from '../../validations/inventory.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All inventory endpoints require authentication
router.use(authenticate);

// Add new inventory item (Manager & Owner)
router.post(
  '/',
  hasPermission(PERMISSIONS.MANAGE_INVENTORY),
  createInventoryValidation,
  validateRequest,
  inventoryController.createInventoryItem
);

// Retrieve list of inventory items
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_INVENTORY),
  listInventoryValidation,
  validateRequest,
  inventoryController.getInventoryItems
);

// Get items requiring reordering (currentStock <= minimumStock)
router.get(
  '/low-stock',
  hasPermission(PERMISSIONS.READ_INVENTORY),
  listInventoryValidation,
  validateRequest,
  inventoryController.getLowStockItems
);

// Get single inventory item details by ID
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_INVENTORY),
  inventoryIdParamValidation,
  validateRequest,
  inventoryController.getInventoryItemById
);

// Get transaction history logs for an inventory item
router.get(
  '/:id/history',
  hasPermission(PERMISSIONS.READ_INVENTORY),
  inventoryIdParamValidation,
  validateRequest,
  inventoryController.getItemHistory
);

// Record Stock In movement (Add stock)
router.post(
  '/:id/stock-in',
  hasPermission(PERMISSIONS.MANAGE_INVENTORY),
  stockMovementValidation,
  validateRequest,
  inventoryController.stockIn
);

// Record Stock Out movement (Reduce stock)
router.post(
  '/:id/stock-out',
  hasPermission(PERMISSIONS.MANAGE_INVENTORY),
  stockMovementValidation,
  validateRequest,
  inventoryController.stockOut
);

// Update inventory item metadata (Manager & Owner)
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_INVENTORY),
  updateInventoryValidation,
  validateRequest,
  inventoryController.updateInventoryItem
);

// Delete inventory item by ID (Manager & Owner ONLY)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_INVENTORY),
  inventoryIdParamValidation,
  validateRequest,
  inventoryController.deleteInventoryItem
);

export default router;
