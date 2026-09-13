import { Router } from 'express';
import { paymentController } from '../../controllers/payment.controller.js';
import {
  processPaymentValidation,
  updatePaymentStatusValidation,
  listPaymentValidation,
  paymentIdParamValidation,
} from '../../validations/payment.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All payment endpoints require authentication
router.use(authenticate);

// Process a Payment (Cashier & Owner)
router.post(
  '/',
  hasPermission(PERMISSIONS.CREATE_PAYMENT),
  processPaymentValidation,
  validateRequest,
  paymentController.processPayment
);

// List Payments with pagination, search, status/method filters, date range & sorting
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_PAYMENT),
  listPaymentValidation,
  validateRequest,
  paymentController.getPayments
);

// Get single Payment details by ID or invoiceNumber
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_PAYMENT),
  paymentController.getPaymentById
);

// Update Payment status (Manager & Owner)
router.patch(
  '/:id/status',
  hasPermission(PERMISSIONS.READ_PAYMENT),
  updatePaymentStatusValidation,
  validateRequest,
  paymentController.updatePaymentStatus
);

// Delete Payment record by ID (Manager & Owner)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.READ_PAYMENT),
  paymentIdParamValidation,
  validateRequest,
  paymentController.deletePayment
);

export default router;
