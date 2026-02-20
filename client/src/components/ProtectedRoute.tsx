import React from 'react';
import { useAuth } from '../contexts/auth-context';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-50'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-10 w-10 animate-spin text-emerald-500' />
          <h1 className='text-xl font-medium'>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/' />;
  }

  return <>{children}</>;
};
