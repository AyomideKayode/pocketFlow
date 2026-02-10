import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useUserProfile } from '../contexts/user-profile-context';
import { useToast } from '../contexts/toast-context';
import {
  LogOut,
  Link as LinkIcon,
  ChevronDown,
  Settings as SettingsIcon,
} from 'lucide-react';
import {} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const UserButton: React.FC = () => {
  const { user, logout, linkGoogleAccount } = useAuth();
  const { profile } = useUserProfile();
  const { addToast } = useToast();
  const navigate = useNavigate();
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
      navigate('/');
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
        addToast(
          'Popup was blocked. Please allow popups and try again.',
          'error',
        );
      } else if (error.code === 'auth/credential-already-in-use') {
        addToast(
          'This Google account is already linked to another user.',
          'error',
        );
      } else {
        addToast('Failed to link Google account.', 'error');
      }
    } finally {
      setIsLinking(false);
    }
  };

  const displayName =
    profile?.displayName ||
    user.displayName ||
    user.email?.split('@')[0] ||
    'User';
  const isGoogleLinked = user.providerData.some(
    (provider) => provider.providerId === 'google.com',
  );

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className='flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 py-1.5 pl-1.5 pr-3 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
      >
        <div className='relative h-7 w-7 rounded-full overflow-hidden shadow-sm'>
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt={displayName}
              className='h-full w-full object-cover'
              referrerPolicy='no-referrer'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 text-xs font-bold text-white'>
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className='max-w-25 truncate md:max-w-37.5'>{displayName}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform duration-200',
            isDropdownOpen && 'rotate-180',
          )}
        />
      </button>

      {isDropdownOpen && (
        <div className='absolute bottom-full mb-2 w-56 origin-bottom-right rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl ring-1 ring-black/5 z-50'>
          <div className='px-3 py-2 border-b border-slate-800 mb-1'>
            <p className='text-xs font-medium text-slate-400'>Signed in as</p>
            <p className='truncate text-sm font-semibold text-slate-200'>
              {user.email}
            </p>
          </div>

          {!isGoogleLinked && (
            <button
              onClick={handleLinkGoogle}
              disabled={isLinking}
              className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50'
            >
              <LinkIcon className='h-4 w-4' />
              {isLinking ? 'Linking...' : 'Link Google Account'}
            </button>
          )}

          <Link
            to='/settings'
            onClick={() => setIsDropdownOpen(false)}
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white'
          >
            <SettingsIcon className='h-4 w-4' />
            Settings
          </Link>

          <div className='my-1 border-t border-slate-800' />

          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/30 hover:text-rose-300'
          >
            <LogOut className='h-4 w-4' />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
