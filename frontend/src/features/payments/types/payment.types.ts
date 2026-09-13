import { Payment, PaymentMethod, PaymentStatus } from '@/types/payment';

export type { Payment, PaymentMethod, PaymentStatus };

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProcessPaymentInput {
  order: string;
  amount?: number;
  paymentMethod: PaymentMethod;
  onlineProvider?: string;
  paymentStatus?: PaymentStatus;
  referenceNumber?: string;
}

export interface UpdatePaymentStatusInput {
  id: string;
  paymentStatus: PaymentStatus;
}
