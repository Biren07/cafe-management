export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
