'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this view.',
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <Card className="max-w-md w-full border-rose-500/20 bg-slate-900/90 shadow-2xl text-center">
        <CardHeader className="items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-2">
            <AlertTriangle size={24} />
          </div>
          <CardTitle className="text-xl text-rose-400">{title}</CardTitle>
          <CardDescription className="text-slate-400">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <div className="rounded-lg bg-slate-950 p-3 text-xs text-rose-300 font-mono overflow-auto max-h-32 text-left border border-slate-800">
              {error.message}
            </div>
          )}
        </CardContent>
        {reset && (
          <CardFooter className="justify-center">
            <Button onClick={reset} variant="outline" className="gap-2 border-slate-700">
              <RefreshCw size={16} />
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
