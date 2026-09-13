'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, Permission } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, isLoading, user, hasRole, hasPermissionCheck } =
    useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const redirectUrl = `${ROUTES.AUTH.LOGIN}?redirectTo=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" label="Verifying access permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check role restrictions if specified
  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Access Restricted</h2>
        <p className="text-slate-400 max-w-md mb-6 text-sm">
          Your account role (<span className="text-amber-400 font-semibold">{user?.role}</span>) does
          not have permission to access this module. Please contact your system owner for access.
        </p>
        <Button onClick={() => router.push(ROUTES.DASHBOARD.OVERVIEW)} variant="default">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // Check permission restrictions if specified
  if (requiredPermission && !hasPermissionCheck(requiredPermission)) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Insufficient Permission</h2>
        <p className="text-slate-400 max-w-md mb-6 text-sm">
          You lack the required system permission (<code className="text-amber-400">{requiredPermission}</code>) to view this resource.
        </p>
        <Button onClick={() => router.push(ROUTES.DASHBOARD.OVERVIEW)} variant="default">
          Back to Safety
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
