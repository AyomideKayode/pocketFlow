import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { GitHubIcon } from '../../components/icons/brands/GitHub';
import { LinkedInIcon } from '../../components/icons/brands/LinkedIn';
import { XIcon } from '../../components/icons/brands/X';
import { MediumIcon } from '../../components/icons/brands/Medium';
import { useAuth } from '../../contexts/auth-context';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className='bg-slate-950 border-t border-slate-900 py-16 px-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12'>
          {/* Brand */}
          <div className='col-span-2 md:col-span-1 flex flex-col gap-4'>
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
            <div className='flex gap-4 mt-2'>
              <a
                href='https://github.com/AyomideKayode'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-400 hover:text-emerald-500 transition-colors'
              >
                <GitHubIcon className='h-5 w-5' />
              </a>
              <a
                href='https://www.linkedin.com/in/ayomide-kayode-alawode/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-400 hover:text-emerald-500 transition-colors'
              >
                <LinkedInIcon className='h-5 w-5' />
              </a>
              <a
                href='https://x.com/Ayomide_KayoDev'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-400 hover:text-emerald-500 transition-colors'
              >
                <XIcon className='h-5 w-5' />
              </a>
              <a
                href='https://medium.com/@kazzywiz7'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-400 hover:text-emerald-500 transition-colors'
              >
                <MediumIcon className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-slate-500'>
              Product
            </h4>
            <div className='flex flex-col gap-2'>
              <Link
                to={user ? '/dashboard' : '/auth?mode=signup'}
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Dashboard
              </Link>
              <Link
                to='/#features'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Features
              </Link>
              <Link
                to='/#how-it-works'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                How it Works
              </Link>
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
              <Link
                to='/#faq'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Help Center
              </Link>
              <a
                href='mailto:ayomidekay7@gmail.com?subject=General%20Inquiry'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Contact Us
              </a>
              <a
                href='mailto:ayomidekay7@gmail.com?subject=Feature%20Request'
                className='text-slate-400 hover:text-emerald-500 transition-colors w-fit'
              >
                Feature Requests
              </a>
              <a
                href='mailto:ayomidekay7@gmail.com?subject=Bug%20Report'
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
              Built with 💚 by{' '}
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
            {/* TODO: Fetch version from package.json or environment variable */}
            <span className='px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500'>
              v0.9.2
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
