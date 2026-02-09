import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  X,
  Calendar
} from 'lucide-react';
import { UserButton } from '../UserButton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();

  const previousPathname = useRef(location.pathname);

  // Close sidebar on route change if mobile
  useEffect(() => {
    if (
      isMobile &&
      isOpen &&
      previousPathname.current !== location.pathname
    ) {
      onClose();
    }

    previousPathname.current = location.pathname;
  }, [location.pathname, isMobile, isOpen, onClose]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Bills', path: '/bills', icon: Calendar },
    { name: 'Goals', path: '/goals', icon: Target },
  ];

  const sidebarClasses = cn(
    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-in-out',
    // Desktop: transform based on isOpen
    !isMobile && (isOpen ? 'translate-x-0' : '-translate-x-full'),
    // Mobile: transform based on isOpen (overlay)
    isMobile && (isOpen ? 'translate-x-0' : '-translate-x-full'),
    // Position adjustments
    !isMobile && 'pt-16' // Space for navbar on desktop if sidebar is below it.
  );

  // If mobile, we need an overlay
  const overlay = isMobile && isOpen && (
    <div
      className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    />
  );

  return (
    <>
      {overlay}
      <aside className={sidebarClasses}>
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <span className="text-lg font-bold text-white">Menu</span>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          {/* User Profile Section pinned to bottom */}
          <div className="flex items-center justify-between">
            <UserButton />
          </div>
        </div>
      </aside>
    </>
  );
};
