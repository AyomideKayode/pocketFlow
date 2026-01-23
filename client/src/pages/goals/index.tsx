import { Target } from 'lucide-react';

export const Goals = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-500'>
      <div className='p-4 rounded-full bg-slate-900 border border-slate-800'>
        <Target className='h-12 w-12 text-emerald-500' />
      </div>
      <h1 className='text-2xl font-bold text-white'>Financial Goals Coming Soon</h1>
      <p className='text-slate-400 max-w-md'>
        Track your progress toward savings targets and financial milestones in the upcoming update.
      </p>
    </div>
  );
};
