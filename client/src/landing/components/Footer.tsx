import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-slate-950 border-t border-slate-900 py-16 px-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12'>
          {/* Brand */}
          <div className='flex flex-col gap-4'>
            <Link to='/' className='flex items-center gap-2 group w-fit'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors'>
                <Wallet className='h-5 w-5 text-emerald-500' />
              </div>
              <span className='text-xl font-semibold tracking-tight text-white group-hover:text-emerald-50 transition-colors'>
                PocketFlow
              </span>
            </Link>
            <p className='text-slate-500 max-w-xs leading-relaxed'>
              Simple finance tracking for people who value their privacy.
            </p>
          </div>

          {/* Product */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-slate-500'>
              Product
            </h4>
            <div className='flex flex-col gap-2'>
              <Link
                to='/dashboard'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Dashboard
              </Link>
              <a
                href='/#features'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Features
              </a>
              <a
                href='/#how-it-works'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                How it Works
              </a>
              <Link
                to='/about'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                About
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-slate-500'>
              Support
            </h4>
            <div className='flex flex-col gap-2'>
              <a
                href='/#faq'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Help Center
              </a>
              <a
                href='mailto:ayomidekay7@gmail.com'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Contact Us
              </a>
              <a
                href='mailto:ayomidekay7@gmail.com'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Feature Requests
              </a>
              <a
                href='mailto:ayomidekay7@gmail.com'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Report a Bug
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-slate-500'>
              Legal
            </h4>
            <div className='flex flex-col gap-2'>
              <Link
                to='/privacy'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Privacy Policy
              </Link>
              <Link
                to='/terms'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className='pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-sm'>
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <p>© {currentYear} PocketFlow. Designed for clarity and privacy.</p>
            <span className='hidden md:block w-1 h-1 bg-slate-800 rounded-full' />
            <p>
              Built by{' '}
              <a
                href='https://github.com/AyomideKayode'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-500 hover:text-emerald-500 transition-colors underline decoration-slate-800 hover:decoration-emerald-500/50'
              >
                Ayomide Kayode
              </a>
            </p>
          </div>
          <div className='flex items-center gap-6'>
            <span className='px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500'>
              v0.9.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
