import { DiningTable, TableStatus } from '@/types/table';

export type { DiningTable, TableStatus };

export interface TableQueryParams {
  page?: number;
  limit?: number;
  status?: TableStatus;
  minCapacity?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTableInput {
  tableNumber: string;
  tableName: string;
  capacity: number;
  status?: TableStatus;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTableInput {
  tableNumber?: string;
  tableName?: string;
  capacity?: number;
  status?: TableStatus;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTableStatusInput {
  id: string;
  status: TableStatus;
}
