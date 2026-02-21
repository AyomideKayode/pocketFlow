import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: string;
  variant?: 'default' | 'welcome' | 'search' | 'error';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = '💰',
  variant = 'default',
}) => {
  const variantColors = {
    default: 'text-emerald-500',
    welcome: 'text-indigo-500',
    search: 'text-slate-500',
    error: 'text-rose-500',
  };

  return (
    <div className='flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500'>
      <div
        className={`mb-6 text-6xl animate-bounce-slow ${variantColors[variant]}`}
      >
        {icon}
      </div>

      <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white md:text-2xl'>{title}</h3>

      <p className='mb-8 max-w-md text-gray-500 dark:text-slate-400 text-sm md:text-base'>
        {description}
      </p>

      {actionText && onAction && (
        <button
          className='rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-95'
          onClick={onAction}
          type='button'
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
