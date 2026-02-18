import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './auth-context';
import * as firebaseAuth from 'firebase/auth';

// Component to consume context
const TestComponent = () => {
  const { user, loading, logout } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No User</div>;
  return (
    <div>
      <div>User: {user.uid}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    // Mock onAuthStateChanged to NOT immediately resolve (simulate loading)
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(() => vi.fn());

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should set user on Firebase auth state change', async () => {
    const mockUser = { uid: 'user-123', email: 'test@example.com' };

    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser as any);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User: user-123')).toBeInTheDocument();
    });
  });

  it('should handle logout correctly', async () => {
    const mockUser = { uid: 'user-123' };
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser as any);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User: user-123')).toBeInTheDocument();
    });

    const logoutBtn = screen.getByText('Logout');
    await act(async () => {
        logoutBtn.click();
    });

    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });

  it('should clear user on sign out', async () => {
    // Simulate initial user, then null
    let authCallback: any;
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation((auth, callback) => {
      authCallback = callback;
      callback({ uid: 'user-123' } as any);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User: user-123')).toBeInTheDocument();
    });

    // Simulate auth state change to null (signed out)
    await act(async () => {
      authCallback(null);
    });

    expect(screen.getByText('No User')).toBeInTheDocument();
  });
});
