'use client';

import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setCredentials, logout, setInitialized } from '@/store/slices/authSlice';
import { useLazyGetProfileQuery } from '@/features/auth/services/authApi';
import { authStorage } from '@/utils/auth-storage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { isInitialized, accessToken } = useAppSelector((state) => state.auth);
  const [triggerGetProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authStorage.getAccessToken();
      const storedRefreshToken = authStorage.getRefreshToken();
      const storedUser = authStorage.getUser();

      if (storedToken) {
        try {
          const profileResponse = await triggerGetProfile().unwrap();
          if (profileResponse?.success && profileResponse?.data) {
            dispatch(
              setCredentials({
                user: profileResponse.data,
                accessToken: storedToken,
                refreshToken: storedRefreshToken || undefined,
              })
            );
          } else if (storedUser) {
            dispatch(
              setCredentials({
                user: storedUser as any,
                accessToken: storedToken,
                refreshToken: storedRefreshToken || undefined,
              })
            );
          } else {
            dispatch(logout());
          }
        } catch {
          // If fetching profile fails (e.g. invalid token), clear state
          if (storedUser) {
            dispatch(
              setCredentials({
                user: storedUser as any,
                accessToken: storedToken,
                refreshToken: storedRefreshToken || undefined,
              })
            );
          } else {
            dispatch(logout());
          }
        }
      } else {
        dispatch(logout());
      }

      dispatch(setInitialized(true));
    };

    initAuth();
  }, [dispatch, triggerGetProfile]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <LoadingSpinner size="lg" label="Initializing application authentication..." />
      </div>
    );
  }

  return <>{children}</>;
}
