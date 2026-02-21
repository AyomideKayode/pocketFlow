import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/auth-context';
import { ToastProvider } from './contexts/toast-context';
import { UserProfileProvider } from './contexts/user-profile-context';
import { ConfirmationDialogProvider } from './contexts/confirmation-dialog-context';
import { ThemeProvider } from './contexts/theme-context';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
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
    </ThemeProvider>
  </StrictMode>,
);
