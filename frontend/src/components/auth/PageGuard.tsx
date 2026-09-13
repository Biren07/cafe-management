'use client';

import { ReactNode } from 'react';
import { Permission, UserRole } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';
import { AccessDenied } from './AccessDenied';

interface PageGuardProps {
  requiredPermission?: Permission | readonly Permission[];
  requiredRoles?: UserRole | readonly UserRole[];
  title?: string;
  message?: string;
  children: ReactNode;
}

/**
 * Protects an entire page route by checking authentication, roles, and granular permissions.
 */
export function PageGuard({
  requiredPermission,
  requiredRoles,
  title,
  message,
  children,
}: PageGuardProps) {
  const { user, isOwner, isLoading, isInitialized, hasRole, hasPermission, hasAnyPermission } = useAuth();

  // Show clean skeleton while Redux auth hydrates
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent shadow-lg shadow-amber-500/20" />
        <p className="text-xs text-slate-400 font-medium animate-pulse">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // Owner always bypasses all checks
  if (isOwner) {
    return <>{children}</>;
  }

  // Check Role restrictions
  if (requiredRoles) {
    const isAllowedRole = hasRole(requiredRoles);
    if (!isAllowedRole) {
      const roleStr = Array.isArray(requiredRoles) ? requiredRoles.join(' / ') : String(requiredRoles);
      return <AccessDenied title={title} message={message} requiredRole={roleStr} />;
    }
  }

  // Check Granular Permission restrictions
  if (requiredPermission) {
    const hasPerm = Array.isArray(requiredPermission)
      ? hasAnyPermission(requiredPermission)
      : hasPermission(requiredPermission);

    if (!hasPerm) {
      return <AccessDenied title={title} message={message} />;
    }
  }

  return <>{children}</>;
}
