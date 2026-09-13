import { MenuItem } from '@/types/menu';
import { PaginationQueryParams } from '@/types/api';

export interface MenuQueryParams extends PaginationQueryParams {
  category?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface MenuItemFormInput {
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  image?: File | string | null;
}
