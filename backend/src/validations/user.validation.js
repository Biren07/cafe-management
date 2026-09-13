import { body, query, param } from 'express-validator';
import { ROLE_LIST } from '../constants/roles.js';

export const createStaffValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .trim()
    .isString()
    .withMessage('Phone must be a valid string'),
  body('role')
    .optional()
    .toUpperCase()
    .isIn(ROLE_LIST)
    .withMessage(`Role must be one of: ${ROLE_LIST.join(', ')}`),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be either ACTIVE or INACTIVE'),
];

export const updateStaffValidation = [
  param('id').isMongoId().withMessage('Invalid User ID format'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 }),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone').optional().trim().isString(),
  body('role')
    .optional()
    .toUpperCase()
    .isIn(ROLE_LIST)
    .withMessage(`Role must be one of: ${ROLE_LIST.join(', ')}`),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be either ACTIVE or INACTIVE'),
];

export const listStaffValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .toUpperCase()
    .isIn(ROLE_LIST)
    .withMessage(`Role filter must be one of: ${ROLE_LIST.join(', ')}`),
  query('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status filter must be ACTIVE or INACTIVE'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search query must be a string'),
];

export const userIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid User ID format'),
];

