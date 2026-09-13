import { Router } from 'express';
import { categoryController } from '../../controllers/category.controller.js';
import {
  createCategoryValidation,
  updateCategoryValidation,
  listCategoryValidation,
  categoryIdParamValidation,
} from '../../validations/category.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

// All category endpoints require authentication
router.use(authenticate);

// Create Category (Manager & Owner)
router.post(
  '/',
  hasPermission(PERMISSIONS.MANAGE_CATEGORY),
  upload.single('image'),
  createCategoryValidation,
  validateRequest,
  categoryController.createCategory
);

// Get Categories List with search, filtering, pagination & sorting
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_CATEGORY),
  listCategoryValidation,
  validateRequest,
  categoryController.getCategories
);

// Get Single Category by ID
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_CATEGORY),
  categoryIdParamValidation,
  validateRequest,
  categoryController.getCategoryById
);

// Update Category by ID (Manager & Owner)
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_CATEGORY),
  upload.single('image'),
  updateCategoryValidation,
  validateRequest,
  categoryController.updateCategory
);

// Delete Category by ID (Manager & Owner)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_CATEGORY),
  categoryIdParamValidation,
  validateRequest,
  categoryController.deleteCategory
);

export default router;
