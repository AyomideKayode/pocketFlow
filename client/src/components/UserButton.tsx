import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useToast } from '../contexts/toast-context';

export const UserButton: React.FC = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

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
          <button onClick={handleLogout} className='logout-button'>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
