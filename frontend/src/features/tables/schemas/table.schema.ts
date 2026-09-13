import { z } from 'zod';

export const tableSchema = z.object({
  tableNumber: z
    .string()
    .trim()
    .min(1, 'Table number is required')
    .max(20, 'Table number cannot exceed 20 characters'),
  tableName: z
    .string()
    .trim()
    .min(1, 'Table name is required')
    .max(100, 'Table name cannot exceed 100 characters'),
  capacity: z.coerce
    .number({ invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1 person'),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'CLEANING', 'RESERVED']),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
});

export type TableFormData = z.infer<typeof tableSchema>;
