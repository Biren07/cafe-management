'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitialized } = useAuth();
  const redirectTo = searchParams.get('redirectTo') || ROUTES.DASHBOARD.OVERVIEW;

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isInitialized, isAuthenticated, redirectTo, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" label="Checking session status..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="md" label="Redirecting to your dashboard..." />
      </div>
    );
  }

  return <>{children}</>;
}
