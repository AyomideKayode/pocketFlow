import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  className = '',
  action,
}) => {
  return (
    <div
      className={`rounded-xl border border-border bg-background-secondary/50 p-6 shadow-sm backdrop-blur-sm h-full flex flex-col transition-colors duration-300 ${className}`}
    >
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-text-primary'>{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className='flex-1 w-full min-h-[300px]'>{children}</div>
    </div>
  );
};
