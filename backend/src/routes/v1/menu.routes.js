import { Router } from 'express';
import { menuController } from '../../controllers/menu.controller.js';
import {
  createMenuValidation,
  updateMenuValidation,
  listMenuValidation,
  menuIdParamValidation,
} from '../../validations/menu.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

// All menu endpoints require authentication
router.use(authenticate);

// Create Menu Item (Manager & Owner)
router.post(
  '/',
  hasPermission(PERMISSIONS.MANAGE_MENU),
  upload.single('image'),
  createMenuValidation,
  validateRequest,
  menuController.createMenuItem
);

// Get Menu Items List with search, category/price filters, pagination & sorting
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_MENU),
  listMenuValidation,
  validateRequest,
  menuController.getMenuItems
);

// Get Single Menu Item by ID
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_MENU),
  menuIdParamValidation,
  validateRequest,
  menuController.getMenuItemById
);

// Update Menu Item by ID (Manager & Owner)
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_MENU),
  upload.single('image'),
  updateMenuValidation,
  validateRequest,
  menuController.updateMenuItem
);

// Delete Menu Item by ID (Manager & Owner)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_MENU),
  menuIdParamValidation,
  validateRequest,
  menuController.deleteMenuItem
);

export default router;
