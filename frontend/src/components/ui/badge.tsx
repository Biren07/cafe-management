import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-amber-200/80 bg-amber-50 text-amber-800',
        success: 'border-emerald-200/80 bg-emerald-50 text-emerald-800',
        warning: 'border-amber-200/80 bg-amber-50 text-amber-800',
        danger: 'border-rose-200/80 bg-rose-50 text-rose-800',
        info: 'border-sky-200/80 bg-sky-50 text-sky-800',
        outline: 'border-slate-300 text-slate-700 bg-white shadow-2xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
