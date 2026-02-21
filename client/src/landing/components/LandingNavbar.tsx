import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '../../components/ThemeToggle';

export const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Security', href: '/#security' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
        style={{ height: '72px' }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2 group shrink-0'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20 transition-colors'>
              <Wallet className='h-5 w-5 text-emerald-600 dark:text-emerald-500' />
            </div>
            <span className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors'>
              PocketFlow
            </span>
          </Link>

          {/* Desktop Nav Links - Centered */}
          <div className='hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2'>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className='text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors'
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center gap-4 shrink-0'>
            <ThemeToggle />
            <Link
              to='/auth?mode=login'
              className='text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 transition-colors'
            >
              Sign In
            </Link>
            <Link
              to='/auth?mode=signup'
              className='bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm dark:shadow-lg dark:shadow-emerald-500/20 hover:shadow-md dark:hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]'
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
             <ThemeToggle />
             <button
                className='text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label='Open menu'
              >
                <Menu className='h-6 w-6' />
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='fixed inset-0 z-50 bg-white dark:bg-slate-950 p-4 md:hidden flex flex-col'
          >
            <div className='flex items-center justify-between mb-8'>
              <Link
                to='/'
                className='flex items-center gap-2'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10'>
                  <Wallet className='h-5 w-5 text-emerald-600 dark:text-emerald-500' />
                </div>
                <span className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                  PocketFlow
                </span>
              </Link>
              <button
                className='text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label='Close menu'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='flex flex-col gap-6'>
              {/* Mobile Nav Links */}
              <div className='flex flex-col gap-4'>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className='text-lg font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className='h-px bg-gray-200 dark:bg-slate-800 my-2' />

              {/* Mobile Actions */}
              <div className='flex flex-col gap-4'>
                <Link
                  to='/auth?mode=login'
                  className='w-full text-center border border-gray-200 dark:border-slate-700 rounded-xl py-3 text-lg font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:border-emerald-500/50 hover:bg-gray-50 dark:hover:bg-slate-900 transition-all'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to='/auth?mode=signup'
                  className='w-full text-center bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-emerald-900/20'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
