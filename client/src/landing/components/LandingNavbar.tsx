import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-slate-950/80 backdrop-blur-md border-slate-800 shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <Wallet className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white group-hover:text-emerald-50 transition-colors">
              PocketFlow
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth?mode=login"
              className="text-slate-400 hover:text-white font-medium px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth?mode=signup"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-slate-950 p-4 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Wallet className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-white">
                  PocketFlow
                </span>
              </Link>
              <button
                className="text-slate-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                to="/auth?mode=login"
                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-emerald-900/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
