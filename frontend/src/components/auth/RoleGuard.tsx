'use client';

import { ReactNode } from 'react';
import { UserRole } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  roles: UserRole | readonly UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the authenticated user has one of the required role(s).
 */
export function RoleGuard({
  roles,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
