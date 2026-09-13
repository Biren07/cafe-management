import { Router } from 'express';
import { expenseController } from '../../controllers/expense.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';
import {
  createExpenseValidation,
  updateExpenseValidation,
  listExpenseValidation,
  expenseIdParamValidation,
} from '../../validations/expense.validation.js';

const router = Router();

// All expense endpoints require authentication
router.use(authenticate);

// Create expense
router.post(
  '/',
  hasPermission(PERMISSIONS.MANAGE_EXPENSES),
  upload.single('receiptImage'),
  createExpenseValidation,
  validateRequest,
  expenseController.createExpense
);

// Get paginated expenses (with search, filter, sort)
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_EXPENSES),
  listExpenseValidation,
  validateRequest,
  expenseController.getAllExpenses
);

// Get single expense details by ID
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_EXPENSES),
  expenseIdParamValidation,
  validateRequest,
  expenseController.getExpenseById
);

// Update expense by ID
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_EXPENSES),
  upload.single('receiptImage'),
  updateExpenseValidation,
  validateRequest,
  expenseController.updateExpense
);

// Soft delete expense by ID
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_EXPENSES),
  expenseIdParamValidation,
  validateRequest,
  expenseController.deleteExpense
);

export default router;
