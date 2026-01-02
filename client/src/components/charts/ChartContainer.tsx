import React from 'react';
import './ChartContainer.css';

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
    <div className={`chart-container ${className}`}>
      <div className='chart-header'>
        <h3 className='chart-title'>{title}</h3>
      </div>
      <div className='chart-content'>{children}</div>
    </div>
  );
};
