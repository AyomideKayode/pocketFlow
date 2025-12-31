import React from 'react';
import type { Toast as ToastType } from '../contexts/toast-context.js';
import { useToast } from '../contexts/toast-context.js';

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
      default:
        return 'ⓘ';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className='toast-content'>
        <span className='toast-icon'>{getToastIcon()}</span>
        <span className='toast-message'>{toast.message}</span>
      </div>
      <button
        className='toast-close'
        onClick={() => removeToast(toast.id)}
        aria-label='Close notification'
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps { }

export const ToastContainer: React.FC<ToastContainerProps> = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className='toast-container'>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
