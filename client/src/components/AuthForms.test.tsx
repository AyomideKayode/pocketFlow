import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForms } from './AuthForms';
import { vi, describe, it, expect } from 'vitest';

// Mock contexts
vi.mock('../contexts/toast-context', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

// Mock firebase config
vi.mock('../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('AuthForms', () => {
  it('toggles password visibility', () => {
    // Render in SignUp mode to see both password fields
    render(<AuthForms isSignUp={true} onToggleMode={() => {}} />);

    // Get password input
    // The component has two inputs with type='password' initially
    // We can select by placeholder
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = passwordInputs[0]; // Password
    const confirmInput = passwordInputs[1]; // Confirm Password

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    // Toggle Password
    const toggleBtn = screen.getByLabelText('Show password');
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    // Confirm password should still be hidden
    expect(confirmInput).toHaveAttribute('type', 'password');

    // Toggle back
    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles confirm password visibility', () => {
    render(<AuthForms isSignUp={true} onToggleMode={() => {}} />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const confirmInput = passwordInputs[1];

    expect(confirmInput).toHaveAttribute('type', 'password');

    // Toggle Confirm Password
    const toggleBtn = screen.getByLabelText('Show confirm password');
    fireEvent.click(toggleBtn);

    expect(confirmInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide confirm password')).toBeInTheDocument();
  });
});
