import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Menu item name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be 80 characters or less'),
  category: z.string().min(1, 'Category selection is required'),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a valid number' })
    .min(0, 'Price cannot be negative'),
  isAvailable: z.boolean(),
  image: z.any().optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
