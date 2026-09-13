import { Router } from 'express';
import { authController } from '../../controllers/auth.controller.js';
import {
  loginValidation,
  changePasswordValidation,
} from '../../validations/auth.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

// ==========================================
// PUBLIC OWNER ENDPOINTS
// ==========================================

// 1. Dedicated Owner Login Endpoint
router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.ownerLogin
);

// ==========================================
// PROTECTED OWNER ENDPOINTS (OWNER ONLY)
// ==========================================

// Middleware stack for protected owner routes
router.use(authenticate);
router.use(authorize(ROLES.OWNER));

// 2. Get Owner Profile
router.get('/profile', authController.getProfile);

// 3. Change Owner Password
router.post(
  '/change-password',
  changePasswordValidation,
  validateRequest,
  authController.changePassword
);

export default router;
