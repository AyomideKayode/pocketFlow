import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

interface ConfirmationDialogContextType {
  showConfirmation: (data: ConfirmationDialogData) => void;
  hideConfirmation: () => void;
}

const ConfirmationDialogContext =
  createContext<ConfirmationDialogContextType | null>(null);

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error(
      'useConfirmationDialog must be used within a ConfirmationDialogProvider',
    );
  }
  return context;
};

interface ConfirmationDialogState {
  isVisible: boolean;
  data: ConfirmationDialogData | null;
}

interface ConfirmationDialogProviderProps {
  children: ReactNode;
}

export const ConfirmationDialogProvider: React.FC<
  ConfirmationDialogProviderProps
> = ({ children }) => {
  const [state, setState] = useState<ConfirmationDialogState>({
    isVisible: false,
    data: null,
  });

  const showConfirmation = (data: ConfirmationDialogData) => {
    setState({
      isVisible: true,
      data,
    });
  };

  const hideConfirmation = () => {
    setState({
      isVisible: false,
      data: null,
    });
  };

  const handleConfirm = async () => {
    if (state.data?.onConfirm) {
      try {
        await state.data.onConfirm();
      } catch (error) {
        console.error('Error in confirmation handler:', error);
      }
    }
    hideConfirmation();
  };

  const contextValue: ConfirmationDialogContextType = {
    showConfirmation,
    hideConfirmation,
  };

  return (
    <ConfirmationDialogContext.Provider value={contextValue}>
      {children}
      {state.isVisible && state.data && (
        <div
          className='fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200'
          onClick={hideConfirmation}
        >
          <div
            className='w-full max-w-md overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='border-b border-slate-800 px-6 py-4'>
              <h3 className='text-lg font-semibold text-white'>
                {state.data.title}
              </h3>
            </div>

            <div className='px-6 py-6'>
              <p className='text-slate-300'>{state.data.message}</p>
            </div>

            <div className='flex justify-end gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4'>
              <button
                className='rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors'
                onClick={hideConfirmation}
                type='button'
              >
                {state.data.cancelText || 'Cancel'}
              </button>
              <button
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors shadow-lg',
                  state.data.variant === 'danger' &&
                  'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20',
                  state.data.variant === 'warning' &&
                  'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20',
                  (!state.data.variant || state.data.variant === 'info') &&
                  'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20',
                )}
                onClick={handleConfirm}
                type='button'
              >
                {state.data.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationDialogContext.Provider>
  );
};
