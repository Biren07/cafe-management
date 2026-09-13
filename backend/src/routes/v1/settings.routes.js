import { Router } from 'express';
import { settingsController } from '../../controllers/settings.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, authorize, hasPermission } from '../../middlewares/auth.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { PERMISSIONS } from '../../constants/permissions.js';
import { updateSettingsValidation } from '../../validations/settings.validation.js';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

// GET /settings (Admin or users with READ_SETTINGS)
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_SETTINGS),
  settingsController.getSettings
);

// PUT /settings (Strictly restricted to ADMIN)
router.put(
  '/',
  authorize(ROLES.ADMIN),
  upload.single('logo'),
  updateSettingsValidation,
  validateRequest,
  settingsController.updateSettings
);

// POST /settings/payment-qr (Upload or update QR code for FONEPAY, ESEWA, KHALTI - ADMIN only)
router.post(
  '/payment-qr',
  authorize(ROLES.ADMIN),
  upload.single('qrImage'),
  settingsController.uploadPaymentQr
);

// DELETE /settings/payment-qr/:provider (Delete QR code by provider - ADMIN only)
router.delete(
  '/payment-qr/:provider',
  authorize(ROLES.ADMIN),
  settingsController.deletePaymentQr
);

export default router;
