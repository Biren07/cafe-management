import { Order } from './order';
import { User } from './user';

export type PaymentMethod = 'CASH' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  _id: string;
  invoiceNumber: string;
  order: Order | string;
  amount: number;
  paymentMethod: PaymentMethod;
  onlineProvider?: string;
  paymentStatus: PaymentStatus;
  referenceNumber?: string;
  processedBy?: User | string;
  createdAt: string;
  updatedAt: string;
}
