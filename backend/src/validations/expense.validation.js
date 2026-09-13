import { body, query, param } from 'express-validator';

export const createExpenseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Expense title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Expense title must be between 2 and 200 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Expense category is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Expense amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('expenseDate')
    .optional()
    .isISO8601()
    .withMessage('Expense date must be a valid ISO 8601 date string'),
];

export const updateExpenseValidation = [
  param('id').isMongoId().withMessage('Invalid Expense ID format'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Expense title cannot be empty')
    .isLength({ min: 2, max: 200 })
    .withMessage('Expense title must be between 2 and 200 characters'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Expense category cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('expenseDate')
    .optional()
    .isISO8601()
    .withMessage('Expense date must be a valid ISO 8601 date string'),
];

export const listExpenseValidation = [
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
  query('category')
    .optional()
    .trim()
    .isString()
    .withMessage('Category query must be a string'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date string'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date string'),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minAmount must be a non-negative number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxAmount must be a non-negative number'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['expenseDate', 'createdAt', 'updatedAt', 'amount', 'title', 'category'])
    .withMessage('sortBy must be one of: expenseDate, createdAt, updatedAt, amount, title, category'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const expenseIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Expense ID format'),
];
