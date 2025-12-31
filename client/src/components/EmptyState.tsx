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
  return (
    <div className={`empty-state empty-state-${variant}`}>
      <div className='empty-state-content'>
        <div className='empty-state-icon'>{icon}</div>

        <h3 className='empty-state-title'>{title}</h3>

        <p className='empty-state-description'>{description}</p>

        {actionText && onAction && (
          <button
            className='empty-state-action button'
            onClick={onAction}
            type='button'
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
