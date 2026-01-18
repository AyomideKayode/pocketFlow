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
      <div className='flex min-h-[50vh] w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
          <p className='text-slate-400'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/auth' />;
  }

  return <>{children}</>;
};
