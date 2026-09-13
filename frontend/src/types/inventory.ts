import { User } from './user';

export interface InventoryHistory {
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  performedBy?: User | string | null;
  createdAt: string;
}

export interface InventoryItem {
  _id: string;
  itemName: string;
  category?: string | null;
  unit: string;
  minimumStock: number;
  currentStock: number;
  isLowStock: boolean;
  history?: InventoryHistory[];
  createdAt: string;
  updatedAt: string;
}
