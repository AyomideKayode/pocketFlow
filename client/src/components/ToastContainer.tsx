import React from 'react';
import type { Toast as ToastType } from '../contexts/toast-context';
import { useToast } from '../contexts/toast-context';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const icons = {
    success: <Check className='h-5 w-5 text-emerald-500' />,
    error: <X className='h-5 w-5 text-rose-500' />,
    warning: <AlertTriangle className='h-5 w-5 text-amber-500' />,
    info: <Info className='h-5 w-5 text-blue-500' />,
  };

  const borderColors = {
    success: 'border-emerald-500/20 bg-emerald-500/10',
    error: 'border-rose-500/20 bg-rose-500/10',
    warning: 'border-amber-500/20 bg-amber-500/10',
    info: 'border-blue-500/20 bg-blue-500/10',
  };

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-4 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-right-full duration-300',
        borderColors[toast.type],
      )}
    >
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/50',
          )}
        >
          {icons[toast.type]}
        </div>
        <p className='text-sm font-medium text-slate-200'>{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className='rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className='fixed top-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 pointer-events-none'>
      <div className='pointer-events-auto flex flex-col gap-2'>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
