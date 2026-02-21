import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { Navigate, useSearchParams } from 'react-router-dom';
import { AuthForms } from '../../components/AuthForms';
import { Wallet, Loader2 } from 'lucide-react';

export const Auth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');

  if (loading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center bg-slate-950'>
        <Loader2 className='h-10 w-10 animate-spin text-emerald-500' />
      </div>
    );
  }

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <div className='flex flex-col items-center justify-center text-center'>
          <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500/20 to-cyan-500/20 shadow-lg shadow-emerald-900/20 ring-1 ring-white/10'>
            <Wallet className='h-8 w-8 text-emerald-500' />
          </div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className='mt-2 text-sm text-gray-500 dark:text-slate-400 max-w-sm'>
            {isSignUp
              ? 'Enter your details below to create your account and start tracking your finances.'
              : 'Enter your credentials to access your personal finance dashboard.'}
          </p>
        </div>

        <div className='rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm dark:shadow-xl backdrop-blur-sm ring-1 ring-gray-900/5 dark:ring-white/5'>
          <AuthForms
            isSignUp={isSignUp}
            onToggleMode={() => setIsSignUp(!isSignUp)}
          />
        </div>
      </div>
    </div>
  );
};
