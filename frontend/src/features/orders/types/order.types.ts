import { Order, OrderItem, OrderStatus, OrderType } from '@/types/order';

export type { Order, OrderItem, OrderStatus, OrderType };

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  orderType?: OrderType;
  table?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOrderItemInput {
  menuItem: string;
  quantity: number;
}

export interface CreateOrderInput {
  orderType?: OrderType;
  table?: string | null;
  items: CreateOrderItemInput[];
  tax?: number;
  discount?: number;
  serviceCharge?: number;
  notes?: string;
}

export interface UpdateOrderStatusInput {
  id: string;
  status: OrderStatus;
}

export interface UpdateOrderInput {
  orderType?: OrderType;
  table?: string | null;
  items?: CreateOrderItemInput[];
  tax?: number;
  discount?: number;
  serviceCharge?: number;
  notes?: string;
}
