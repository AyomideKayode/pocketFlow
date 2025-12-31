import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
      'useConfirmationDialog must be used within a ConfirmationDialogProvider'
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

  const handleCancel = () => {
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
        <div className='confirmation-dialog-overlay' onClick={handleCancel}>
          <div
            className='confirmation-dialog'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='confirmation-dialog-header'>
              <h3 className='confirmation-dialog-title'>{state.data.title}</h3>
            </div>

            <div className='confirmation-dialog-body'>
              <p className='confirmation-dialog-message'>
                {state.data.message}
              </p>
            </div>

            <div className='confirmation-dialog-actions'>
              <button
                className='confirmation-button confirmation-cancel'
                onClick={handleCancel}
                type='button'
              >
                {state.data.cancelText || 'Cancel'}
              </button>
              <button
                className={`confirmation-button confirmation-confirm confirmation-${state.data.variant || 'danger'
                  }`}
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
