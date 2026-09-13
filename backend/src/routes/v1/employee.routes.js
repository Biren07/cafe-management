import { Router } from 'express';
import { employeeController } from '../../controllers/employee.controller.js';
import {
  createEmployeeValidation,
  recordAttendanceValidation,
  updateEmployeeValidation,
  listEmployeeValidation,
  employeeIdParamValidation,
} from '../../validations/employee.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All employee endpoints require authentication
router.use(authenticate);

// Create a new employee record (Manager & Owner)
router.post(
  '/',
  hasPermission(PERMISSIONS.MANAGE_EMPLOYEE),
  createEmployeeValidation,
  validateRequest,
  employeeController.createEmployee
);

// List employees with pagination, search, position/shift/status filters & sorting
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_EMPLOYEE),
  listEmployeeValidation,
  validateRequest,
  employeeController.getEmployees
);

// Get single employee profile details by Mongo ID or Employee ID (e.g. EMP-1001)
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_EMPLOYEE),
  employeeController.getEmployeeById
);

// Record or update daily attendance for an employee (Manager & Owner)
router.post(
  '/:id/attendance',
  hasPermission(PERMISSIONS.MANAGE_EMPLOYEE),
  recordAttendanceValidation,
  validateRequest,
  employeeController.recordAttendance
);

// Get attendance history logs for an employee
router.get(
  '/:id/attendance',
  hasPermission(PERMISSIONS.READ_EMPLOYEE),
  employeeIdParamValidation,
  validateRequest,
  employeeController.getEmployeeAttendance
);

// Update employee metadata (salary, shift, status, position, etc.)
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_EMPLOYEE),
  updateEmployeeValidation,
  validateRequest,
  employeeController.updateEmployee
);

// Delete employee record by ID (Manager & Owner ONLY)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_EMPLOYEE),
  employeeIdParamValidation,
  validateRequest,
  employeeController.deleteEmployee
);

export default router;
