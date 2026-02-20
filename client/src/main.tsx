import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/auth-context';
import { ToastProvider } from './contexts/toast-context';
import { UserProfileProvider } from './contexts/user-profile-context';
import { ConfirmationDialogProvider } from './contexts/confirmation-dialog-context';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <ConfirmationDialogProvider>
            <UserProfileProvider>
              <App />
              <Analytics />
            </UserProfileProvider>
          </ConfirmationDialogProvider>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
