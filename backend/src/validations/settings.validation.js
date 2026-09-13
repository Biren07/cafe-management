import { body } from 'express-validator';

export const updateSettingsValidation = [
  body('cafeName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Cafe name cannot be empty')
    .isLength({ min: 2, max: 150 })
    .withMessage('Cafe name must be between 2 and 150 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone number cannot exceed 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),
  body('vatNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('VAT/Tax number cannot exceed 50 characters'),
  body('currency')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Currency symbol/code cannot exceed 10 characters'),
  body('receiptFooter')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Receipt footer cannot exceed 500 characters'),
  body('businessHours')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Business hours cannot exceed 200 characters'),
  body('taxPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Tax percentage must be a number between 0 and 100'),
  body('serviceChargePercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Service charge percentage must be a number between 0 and 100'),
];
