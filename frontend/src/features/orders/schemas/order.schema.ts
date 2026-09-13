import { z } from 'zod';

export const orderItemSchema = z.object({
  menuItem: z.string().min(1, 'Menu item is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
});

export const orderFormSchema = z
  .object({
    orderType: z.enum(['DINE_IN', 'TAKE_AWAY']),
    table: z.string().optional().or(z.literal('')),
    items: z.array(orderItemSchema).min(1, 'At least one menu item is required'),
    tax: z.coerce.number().min(0, 'Tax cannot be negative').default(0),
    discount: z.coerce.number().min(0, 'Discount cannot be negative').default(0),
    serviceCharge: z.coerce.number().min(0, 'Service charge cannot be negative').default(0),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.orderType === 'DINE_IN' && (!data.table || data.table.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Dining table selection is required for Dine-In orders',
      path: ['table'],
    }
  );

export type OrderFormData = z.infer<typeof orderFormSchema>;
