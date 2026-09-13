import { body, query, param } from 'express-validator';

export const createOrderValidation = [
  body('orderType')
    .optional()
    .toUpperCase()
    .isIn(['DINE_IN', 'TAKE_AWAY'])
    .withMessage('Order type must be either DINE_IN or TAKE_AWAY'),
  body('table')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Table ID must be a valid Mongo ID format')
    .custom((value, { req }) => {
      const type = (req.body.orderType || 'DINE_IN').toUpperCase();
      if (type === 'DINE_IN' && !value) {
        throw new Error('Table ID is required for DINE_IN orders.');
      }
      if (type === 'TAKE_AWAY' && value) {
        throw new Error('Table should not be assigned for TAKE_AWAY orders.');
      }
      return true;
    }),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Menu item ID is required')
    .isMongoId()
    .withMessage('Invalid Menu Item ID format'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),
  body('tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be a non-negative number'),
  body('discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a non-negative number'),
  body('serviceCharge')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Service charge must be a non-negative number'),
  body('notes')
    .optional()
    .trim()
    .isString(),
];

export const updateOrderStatusValidation = [
  param('id').isMongoId().withMessage('Invalid Order ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .toUpperCase()
    .isIn(['PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, PREPARING, SERVED, COMPLETED, CANCELLED'),
];

export const updateOrderValidation = [
  param('id').isMongoId().withMessage('Invalid Order ID format'),
  body('orderType')
    .optional()
    .toUpperCase()
    .isIn(['DINE_IN', 'TAKE_AWAY'])
    .withMessage('Order type must be DINE_IN or TAKE_AWAY'),
  body('table')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Table ID must be a valid Mongo ID format'),
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  body('items.*.menuItem')
    .optional()
    .isMongoId()
    .withMessage('Invalid Menu Item ID format'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('tax').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('serviceCharge').optional().isFloat({ min: 0 }),
  body('notes').optional().trim().isString(),
];

export const listOrderValidation = [
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
  query('status')
    .optional()
    .toUpperCase()
    .isIn(['PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status filter must be one of: PENDING, PREPARING, SERVED, COMPLETED, CANCELLED'),
  query('orderType')
    .optional()
    .toUpperCase()
    .isIn(['DINE_IN', 'TAKE_AWAY'])
    .withMessage('Order type filter must be DINE_IN or TAKE_AWAY'),
  query('table')
    .optional()
    .isMongoId()
    .withMessage('Table filter must be a valid Mongo ID'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO8601 date string'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO8601 date string'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['createdAt', 'updatedAt', 'total', 'status', 'orderNumber'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, total, status, orderNumber'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const orderIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Order ID format'),
];
