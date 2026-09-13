import { User } from './user';

export interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
  receiptImage?: string;
  receiptImagePublicId?: string;
  createdBy: User | string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
