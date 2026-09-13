import { Router } from 'express';
import { tableController } from '../../controllers/table.controller.js';
import {
  createTableValidation,
  updateTableValidation,
  updateStatusValidation,
  tableIdParamValidation,
  listTablesValidation,
} from '../../validations/table.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All table endpoints require authentication
router.use(authenticate);

// 1. Create a new table
router.post(
  '/',
  hasPermission(PERMISSIONS.MANAGE_TABLES),
  createTableValidation,
  validateRequest,
  tableController.createTable
);

// 2. Get paginated table list with search, filter, and sort
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_TABLES),
  listTablesValidation,
  validateRequest,
  tableController.getTables
);

// 3. Get single table details by ID
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_TABLES),
  tableIdParamValidation,
  validateRequest,
  tableController.getTableById
);

// 4. Update table details
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_TABLES),
  tableIdParamValidation,
  updateTableValidation,
  validateRequest,
  tableController.updateTable
);

// 5. Update table status (AVAILABLE, OCCUPIED, CLEANING, RESERVED)
router.patch(
  '/:id/status',
  hasPermission(PERMISSIONS.READ_TABLES),
  tableIdParamValidation,
  updateStatusValidation,
  validateRequest,
  tableController.updateTableStatus
);

// 6. Delete table (Soft Delete)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_TABLES),
  tableIdParamValidation,
  validateRequest,
  tableController.deleteTable
);

export default router;
