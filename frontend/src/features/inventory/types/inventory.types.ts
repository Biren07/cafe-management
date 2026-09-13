import { InventoryItem, InventoryHistory } from '@/types/inventory';

export type { InventoryItem, InventoryHistory };

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isLowStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateInventoryInput {
  itemName: string;
  unit: string;
  minimumStock?: number;
  currentStock?: number;
  category?: string | null;
}

export interface UpdateInventoryInput {
  itemName?: string;
  unit?: string;
  minimumStock?: number;
  currentStock?: number;
  category?: string | null;
}

export interface StockMovementInput {
  id: string;
  quantity: number;
  reason?: string;
}
