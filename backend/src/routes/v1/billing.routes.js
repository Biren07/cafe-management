import { Router } from 'express';
import { billingController } from '../../controllers/billing.controller.js';
import {
  generateBillValidation,
  updateBillStatusValidation,
  splitBillValidation,
  billIdParamValidation,
  listBillsValidation,
} from '../../validations/billing.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All billing endpoints require authentication
router.use(authenticate);

// 1. Generate Bill from Order
router.post(
  '/generate',
  hasPermission(PERMISSIONS.MANAGE_BILLING),
  generateBillValidation,
  validateRequest,
  billingController.generateBill
);

// 2. List Bills with pagination, search, status filter, date range & sorting
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_BILLING),
  listBillsValidation,
  validateRequest,
  billingController.getBills
);

// 3. Get single Bill by ID or Receipt Number
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_BILLING),
  billIdParamValidation,
  validateRequest,
  billingController.getBillById
);

// 4. Generate Printable Invoice JSON & log print history
router.post(
  '/:id/print',
  hasPermission(PERMISSIONS.READ_BILLING),
  billIdParamValidation,
  validateRequest,
  billingController.printInvoice
);

// 5. Split Bill among multiple people
router.post(
  '/:id/split',
  hasPermission(PERMISSIONS.MANAGE_BILLING),
  splitBillValidation,
  validateRequest,
  billingController.splitBill
);

// 6. Update Bill Status (PENDING, PAID, CANCELLED)
router.patch(
  '/:id/status',
  hasPermission(PERMISSIONS.MANAGE_BILLING),
  updateBillStatusValidation,
  validateRequest,
  billingController.updateBillStatus
);

export default router;
