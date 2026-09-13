import { Router } from 'express';
import { userController } from '../../controllers/user.controller.js';
import {
  createStaffValidation,
  updateStaffValidation,
  listStaffValidation,
  userIdParamValidation,
} from '../../validations/user.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, authorize, hasPermission } from '../../middlewares/auth.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All staff endpoints require authentication
router.use(authenticate);

// Create new Staff user (Admin ONLY)
router.post(
  '/',
  authorize(ROLES.ADMIN),
  createStaffValidation,
  validateRequest,
  userController.createStaff
);

// List Staff members with pagination, filtering & search (Admin)
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_USER),
  listStaffValidation,
  validateRequest,
  userController.listStaff
);

// Get single Staff profile by ID
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_USER),
  userIdParamValidation,
  validateRequest,
  userController.getStaffById
);

// Update Staff member profile (Admin)
router.put(
  '/:id',
  hasPermission(PERMISSIONS.READ_USER),
  updateStaffValidation,
  validateRequest,
  userController.updateStaff
);

// Deactivate Staff account (Admin ONLY)
router.patch(
  '/:id/deactivate',
  authorize(ROLES.ADMIN),
  userIdParamValidation,
  validateRequest,
  userController.deactivateStaff
);

// Delete Staff account (Admin ONLY)
router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  userIdParamValidation,
  validateRequest,
  userController.deleteStaff
);

export default router;
