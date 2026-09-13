import { Category } from './category';

export interface MenuItem {
  _id: string;
  name: string;
  category: Category | string;
  price: number;
  isAvailable: boolean;
  image?: string;
  imagePublicId?: string;
  createdAt: string;
  updatedAt: string;
}
