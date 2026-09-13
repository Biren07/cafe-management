'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
}

export function AccessDenied({
  title = 'Access Restricted (403)',
  message = 'You do not have sufficient permissions to view or manage this module. Please contact the Cafe Owner if you believe this is an error.',
  requiredRole,
}: AccessDeniedProps) {
  const { user, isStaff } = useAuth();

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-md rounded-3xl border border-rose-500/20 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl space-y-6">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold text-slate-100">{title}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
        </div>

        {/* User Role Tag */}
        {user && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Current Role:</span>
            <span className="font-bold text-amber-300 uppercase tracking-wider">
              {user.role}
            </span>
            {requiredRole && (
              <span className="text-slate-500 text-[11px]">
                (Requires: {requiredRole})
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="text-xs border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            <span>Go Back</span>
          </Button>

          <Link href={isStaff ? '/orders' : '/dashboard'}>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Home className="h-3.5 w-3.5 mr-1.5" />
              <span>{isStaff ? 'Go to Orders' : 'Dashboard'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
