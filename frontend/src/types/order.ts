import { MenuItem } from './menu';
import { DiningTable } from './table';
import { User } from './user';

export type OrderType = 'DINE_IN' | 'TAKE_AWAY';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  menuItem: MenuItem | string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  orderType: OrderType;
  table?: DiningTable | string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}
