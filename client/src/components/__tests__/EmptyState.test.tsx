import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState Component', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No Data" description="You have no records yet." />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('You have no records yet.')).toBeInTheDocument();
  });

  it('renders action button and handles click when provided', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Welcome"
        description="Start here"
        actionText="Get Started"
        onAction={handleAction}
      />
    );

    const button = screen.getByText('Get Started');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
