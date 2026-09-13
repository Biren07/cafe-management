import { Metadata } from 'next';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to access your cafe management portal.',
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl">
        <LoginForm />
      </div>
    </GuestGuard>
  );
}
