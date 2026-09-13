import { z } from 'zod';

export const inventoryFormSchema = z.object({
  itemName: z
    .string()
    .trim()
    .min(2, 'Item name must be at least 2 characters')
    .max(100, 'Item name cannot exceed 100 characters'),
  unit: z
    .string()
    .trim()
    .min(1, 'Unit of measurement is required')
    .max(30, 'Unit cannot exceed 30 characters'),
  minimumStock: z.coerce.number().min(0, 'Minimum stock cannot be negative'),
  currentStock: z.coerce.number().min(0, 'Current stock cannot be negative'),
  category: z.string().optional().or(z.literal('')),
});

export type InventoryFormData = z.infer<typeof inventoryFormSchema>;

export const stockMovementSchema = z.object({
  quantity: z.coerce.number().gt(0, 'Quantity must be greater than 0'),
  reason: z.string().optional(),
});

export type StockMovementFormData = z.infer<typeof stockMovementSchema>;
