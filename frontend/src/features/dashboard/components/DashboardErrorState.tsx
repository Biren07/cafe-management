import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardErrorStateProps {
  error?: any;
  onRetry?: () => void;
}

export function DashboardErrorState({ error, onRetry }: DashboardErrorStateProps) {
  const errorMessage =
    error?.data?.message || error?.message || 'Failed to fetch dashboard metrics from backend server.';

  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center backdrop-blur-md">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 mb-4 border border-rose-500/30">
        <AlertCircle className="h-7 w-7" />
      </div>

      <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
        Dashboard Data Failed to Load
      </h3>

      <p className="max-w-md text-xs text-rose-300 mb-6">
        {errorMessage}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-rose-500/40 bg-slate-900 text-rose-300 hover:bg-rose-500/20 text-xs rounded-xl cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry Fetching Analytics
        </Button>
      )}
    </div>
  );
}
