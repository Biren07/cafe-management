import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  ROLES,
  UserRole,
  Permission,
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from '@/constants/permissions';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/features/auth/services/authApi';
import { baseApi } from '@/services/baseApi';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated, isLoading, isInitialized, error } = useAppSelector(
    (state) => state.auth
  );
  const [logoutApiTrigger] = useLogoutMutation();

  const role = user?.role as UserRole | undefined;

  const isAdmin = role === ROLES.ADMIN || role === ('OWNER' as any) || role === ('MANAGER' as any);
  const isStaff = role === ROLES.STAFF || role === ('CASHIER' as any);

  // Backward compatibility aliases
  const isOwner = isAdmin;
  const isManager = isAdmin;
  const isCashier = isStaff;

  /**
   * Check if current user has a specific role or matches any of the given roles
   */
  const hasRole = (roles: UserRole | readonly UserRole[]): boolean => {
    if (!role) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (isAdmin && allowed.some((r) => r === ROLES.ADMIN || (r as string) === 'OWNER' || (r as string) === 'MANAGER')) {
      return true;
    }
    if (isStaff && allowed.some((r) => r === ROLES.STAFF || (r as string) === 'CASHIER')) {
      return true;
    }
    return allowed.includes(role);
  };

  /**
   * Alias for hasRole with multiple roles
   */
  const hasAnyRole = (roles: readonly UserRole[]): boolean => {
    return hasRole(roles);
  };

  /**
   * Check if current user has a specific granular permission
   */
  const hasPermission = (permission: Permission | readonly Permission[]): boolean => {
    if (!role) return false;
    if (isAdmin) return true;

    const userPermissions: readonly Permission[] = (ROLE_PERMISSIONS[role] || (ROLE_PERMISSIONS as any)['STAFF']) || [];

    if (Array.isArray(permission)) {
      return permission.some((p) => userPermissions.includes(p));
    }

    return userPermissions.includes(permission as Permission);
  };

  /**
   * Check if current user has ANY of the specified permissions
   */
  const hasAnyPermission = (permissions: readonly Permission[]): boolean => {
    if (!role) return false;
    if (isAdmin) return true;
    const userPermissions: readonly Permission[] = (ROLE_PERMISSIONS[role] || (ROLE_PERMISSIONS as any)['STAFF']) || [];
    return permissions.some((p) => userPermissions.includes(p));
  };

  /**
   * Check if current user has ALL of the specified permissions
   */
  const hasAllPermissions = (permissions: readonly Permission[]): boolean => {
    if (!role) return false;
    if (isAdmin) return true;
    const userPermissions: readonly Permission[] = (ROLE_PERMISSIONS[role] || (ROLE_PERMISSIONS as any)['STAFF']) || [];
    return permissions.every((p) => userPermissions.includes(p));
  };

  /**
   * Alias for backwards compatibility
   */
  const hasPermissionCheck = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  /**
   * Robust Full Logout handler
   */
  const logout = async () => {
    try {
      if (accessToken) {
        await logoutApiTrigger().unwrap();
      }
    } catch {
      // Proceed with client side cleanup even if server call fails
    } finally {
      dispatch(logoutAction());
      dispatch(baseApi.util.resetApiState());
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    role,
    isAdmin,
    isStaff,
    isOwner,
    isManager,
    isCashier,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionCheck,
    logout,
  };
}
