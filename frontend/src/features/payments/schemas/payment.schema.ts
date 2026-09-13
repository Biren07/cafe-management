import { z } from 'zod';

export const paymentFormSchema = z.object({
  order: z.string().min(1, 'Order selection is required'),
  amount: z.coerce.number().min(0, 'Amount cannot be negative').optional(),
  paymentMethod: z.enum(['CASH', 'ONLINE']),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).default('COMPLETED'),
  referenceNumber: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
