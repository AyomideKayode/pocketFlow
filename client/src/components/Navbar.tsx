import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Wallet, Bug, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <nav className='w-full border-b border-border bg-background-primary/80 backdrop-blur supports-backdrop-filter:bg-background-primary/60 transition-colors duration-300'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-4'>
          {user && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className='text-text-secondary hover:text-text-primary transition-colors'
            >
              <Menu className='h-6 w-6' />
            </button>
          )}
          <Link to='/' className='flex items-center gap-2 group'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors'>
              <Wallet className='h-5 w-5 text-emerald-500' />
            </div>
            <span className='text-lg font-bold tracking-tight text-text-primary group-hover:text-emerald-500 transition-colors'>
              PocketFlow
            </span>
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <a
            href='mailto:ayomidekay7@gmail.com?subject=PocketFlow Feedback'
            className='text-text-secondary hover:text-emerald-500 transition-colors'
            title='Report Bug / Feedback'
          >
            <Bug className='h-5 w-5' />
          </a>
          {!user && !isAuthPage && (
            <Link
              to='/auth'
              className='rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-900/20'
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
