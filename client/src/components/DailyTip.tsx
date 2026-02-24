import { useState } from 'react';
import { Lightbulb, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDailyTip } from '../data/financial-tips';

export const DailyTip = () => {
  const [dismissed, setDismissed] = useState(() => {
    // Check if user dismissed tip today
    const dismissedDate = localStorage.getItem('daily-tip-dismissed');
    const today = new Date().toDateString();
    return dismissedDate === today;
  });

  const navigate = useNavigate();
  const tip = getDailyTip();

  const handleDismiss = () => {
    const today = new Date().toDateString();
    localStorage.setItem('daily-tip-dismissed', today);
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className='rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 animate-in fade-in duration-500'>
      <div className='flex items-start gap-3'>
        <div className='shrink-0 rounded-lg bg-emerald-500/10 p-2'>
          <Lightbulb className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <h4 className='text-sm font-semibold text-emerald-700 dark:text-emerald-400'>
              💡 Daily Financial Tip
            </h4>
          </div>
          <h5 className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
            {tip.title}
          </h5>
          <p className='text-xs text-gray-600 dark:text-slate-400 leading-relaxed'>
            {tip.tip}
          </p>

          <button
            onClick={() => navigate('/learn')}
            className='mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors'
          >
            View More Tips
            <ExternalLink className='h-3 w-3' />
          </button>
        </div>

        <button
          onClick={handleDismiss}
          className='shrink-0 p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors'
          aria-label='Dismiss tip'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};
