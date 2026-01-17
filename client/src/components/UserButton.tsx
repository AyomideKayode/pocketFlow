import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useToast } from '../contexts/toast-context';

export const UserButton: React.FC = () => {
  const { user, logout, linkGoogleAccount } = useAuth();
  const { addToast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Successfully signed out. See you soon!', 'success');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
      addToast('Failed to sign out. Please try again.', 'error');
    }
  };

  const handleLinkGoogle = async () => {
    setIsLinking(true);
    try {
      await linkGoogleAccount();
      addToast('Google account linked successfully!', 'success');
      setIsDropdownOpen(false);
    } catch (err: unknown) {
      console.error('Error linking Google account:', err);
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/popup-closed-by-user') {
        addToast('Linking was cancelled.', 'error');
      } else if (error.code === 'auth/popup-blocked') {
        addToast('Popup was blocked. Please allow popups and try again.', 'error');
      } else if (error.code === 'auth/credential-already-in-use') {
        addToast('This Google account is already linked to another user.', 'error');
      } else {
        addToast('Failed to link Google account.', 'error');
      }
    } finally {
      setIsLinking(false);
    }
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const isGoogleLinked = user.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  return (
    <div className='user-button-container' ref={dropdownRef}>
      <button
        className='user-button'
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className='user-avatar'>{displayName.charAt(0).toUpperCase()}</div>
        <span className='user-name'>{displayName}</span>
      </button>

      {isDropdownOpen && (
        <div className='user-dropdown'>
          <div className='user-info'>
            <p className='user-email'>{user.email}</p>
          </div>

          {!isGoogleLinked && (
            <button
              onClick={handleLinkGoogle}
              className='link-button'
              disabled={isLinking}
            >
              {isLinking ? 'Linking...' : 'Link Google Account'}
            </button>
          )}

          <button onClick={handleLogout} className='logout-button'>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
