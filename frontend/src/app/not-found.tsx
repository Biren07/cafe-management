import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-6">
        <FileQuestion size={40} />
      </div>
      <h1 className="text-4xl font-bold text-slate-100 font-heading tracking-tight sm:text-5xl">404 - Page Not Found</h1>
      <p className="mt-3 max-w-md text-base text-slate-400">
        The requested resource or page does not exist or has been moved. Please verify the URL or return home.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home size={18} />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
