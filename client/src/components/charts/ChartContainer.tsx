import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="flex-1 w-full min-h-75">{children}</div>
    </div>
  );
};
