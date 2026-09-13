import { Category } from '@/types/category';
import { PaginationQueryParams } from '@/types/api';

export interface CategoryQueryParams extends PaginationQueryParams {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CategoryFormInput {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: File | string | null;
}
