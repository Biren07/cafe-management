import { body, query, param } from 'express-validator';

export const createEmployeeValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position/Designation is required')
    .isLength({ max: 100 })
    .withMessage('Position cannot exceed 100 characters'),
  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a non-negative number'),
  body('shift')
    .optional()
    .toUpperCase()
    .isIn(['MORNING', 'EVENING', 'NIGHT', 'FULL_TIME', 'PART_TIME'])
    .withMessage('Shift must be one of: MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED'])
    .withMessage('Status must be one of: ACTIVE, ON_LEAVE, TERMINATED, RESIGNED'),
  body('phone')
    .optional()
    .trim()
    .isString(),
  body('user')
    .optional()
    .isMongoId()
    .withMessage('Invalid User ID format'),
  body('createLoginAccount')
    .optional()
    .isBoolean()
    .withMessage('createLoginAccount must be a boolean'),
  body('role')
    .optional()
    .toUpperCase()
    .isIn(['ADMIN', 'STAFF'])
    .withMessage('Role must be either ADMIN or STAFF'),
  body('password')
    .optional()
    .custom((value, { req }) => {
      if (req.body.createLoginAccount && (!value || value.length < 6)) {
        throw new Error('Password is required and must be at least 6 characters long for login account');
      }
      return true;
    }),
];

export const recordAttendanceValidation = [
  param('id').isMongoId().withMessage('Invalid Employee ID format'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date string (YYYY-MM-DD)'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'])
    .withMessage('Status must be one of: PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE'),
  body('checkIn')
    .optional()
    .isISO8601()
    .withMessage('checkIn must be a valid ISO8601 date time'),
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('checkOut must be a valid ISO8601 date time'),
  body('notes')
    .optional()
    .trim()
    .isString(),
];

export const updateEmployeeValidation = [
  param('id').isMongoId().withMessage('Invalid Employee ID format'),
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ min: 2, max: 100 }),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('position')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Position cannot be empty')
    .isLength({ max: 100 }),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a non-negative number'),
  body('shift')
    .optional()
    .toUpperCase()
    .isIn(['MORNING', 'EVENING', 'NIGHT', 'FULL_TIME', 'PART_TIME'])
    .withMessage('Shift must be one of: MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED'])
    .withMessage('Status must be one of: ACTIVE, ON_LEAVE, TERMINATED, RESIGNED'),
  body('phone').optional().trim().isString(),
  body('user').optional().isMongoId().withMessage('Invalid User ID format'),
];

export const listEmployeeValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search query must be a string'),
  query('position')
    .optional()
    .trim()
    .isString(),
  query('shift')
    .optional()
    .toUpperCase()
    .isIn(['MORNING', 'EVENING', 'NIGHT', 'FULL_TIME', 'PART_TIME'])
    .withMessage('Shift filter must be MORNING, EVENING, NIGHT, FULL_TIME, or PART_TIME'),
  query('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED'])
    .withMessage('Status filter must be ACTIVE, ON_LEAVE, TERMINATED, or RESIGNED'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['createdAt', 'updatedAt', 'fullName', 'salary', 'status', 'employeeId'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, fullName, salary, status, employeeId'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const employeeIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Employee ID format'),
];
