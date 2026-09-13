import { Order } from './order';
import { User } from './user';

export type BillStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface SplitDetail {
  shareIndex: number;
  amount: number;
  isPaid: boolean;
  paidAt?: string;
}

export interface Bill {
  _id: string;
  receiptNumber: string;
  order: Order | string;
  subtotal: number;
  tax: number;
  discount: number;
  serviceCharge: number;
  grandTotal: number;
  status: BillStatus;
  isSplit: boolean;
  splitDetails?: SplitDetail[];
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}
