'use client';

import { ReactNode } from 'react';
import { ReduxProvider } from './ReduxProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { InstallPWA } from '@/components/pwa/InstallPWA';
import { OfflineQueueBanner } from '@/components/pwa/OfflineQueueBanner';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider />
          <ServiceWorkerRegister />
          <InstallPWA />
          <OfflineQueueBanner />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
