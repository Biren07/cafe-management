export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'RESERVED';

export interface DiningTable {
  _id: string;
  tableNumber: string;
  tableName: string;
  capacity: number;
  status: TableStatus;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
