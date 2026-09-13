'use client';

import { ErrorFallback } from '@/components/common/ErrorFallback';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <ErrorFallback error={error} reset={reset} />
    </div>
  );
}
