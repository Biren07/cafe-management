import { UserRole } from '@/constants/permissions';
import { User } from '@/types/user';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  isOwnerLogin?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RememberMeCredentials {
  email: string;
  rememberMe: boolean;
}

export interface AuthErrorResponse {
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
