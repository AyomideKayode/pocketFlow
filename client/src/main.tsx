import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/auth-context';
import { ToastProvider } from './contexts/toast-context';
import { ConfirmationDialogProvider } from './contexts/confirmation-dialog-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ConfirmationDialogProvider>
          <App />
        </ConfirmationDialogProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
