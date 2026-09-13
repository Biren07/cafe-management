import { Router } from 'express';
import { authController } from '../../controllers/auth.controller.js';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  changePasswordValidation,
} from '../../validations/auth.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, allowFirstOwnerOrCreateUser } from '../../middlewares/auth.middleware.js';

const router = Router();

// Register User (First Owner bootstrap or Owner creating users)
router.post(
  '/register',
  allowFirstOwnerOrCreateUser,
  registerValidation,
  validateRequest,
  authController.register
);

// Login User
router.post('/login', loginValidation, validateRequest, authController.login);

// Dedicated Owner Login
router.post(
  '/owner-login',
  loginValidation,
  validateRequest,
  authController.ownerLogin
);

// Refresh Access Token
router.post(
  '/refresh-token',
  refreshTokenValidation,
  validateRequest,
  authController.refreshToken
);

// Logout User
router.post('/logout', authenticate, authController.logout);

// Change Password
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validateRequest,
  authController.changePassword
);

// Get Authenticated User Profile
router.get('/profile', authenticate, authController.getProfile);

export default router;
