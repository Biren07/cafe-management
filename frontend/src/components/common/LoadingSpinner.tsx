import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface LoadingSpinnerProps {
  label?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg' | number;
}

export function LoadingSpinner({
  label = 'Loading application data...',
  fullPage = false,
  size = 'md',
}: LoadingSpinnerProps) {
  const spinnerSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 20
      : size === 'lg'
      ? 40
      : 32;

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
        <Spinner size={spinnerSize} />
        <p className="mt-4 text-sm font-medium text-slate-300 animate-pulse">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Spinner size={spinnerSize} />
      <p className="mt-3 text-xs text-slate-400 font-medium">{label}</p>
    </div>
  );
}
