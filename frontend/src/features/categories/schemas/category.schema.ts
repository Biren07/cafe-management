import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  image: z.any().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
