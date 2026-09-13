import { UserRole } from '@/constants/permissions';

export type { UserRole };

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
