import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DailyTip } from './DailyTip';
import { BrowserRouter } from 'react-router-dom';

// Mock getDailyTip
vi.mock('../data/financial-tips', () => ({
  getDailyTip: () => ({
    id: 1,
    title: 'Test Tip Title',
    tip: 'Test Tip Content',
    category: 'saving',
  }),
}));

describe('DailyTip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <DailyTip />
      </BrowserRouter>,
    );
    expect(screen.getByText('Test Tip Title')).toBeInTheDocument();
    expect(screen.getByText('Test Tip Content')).toBeInTheDocument();
  });

  it('dismisses tip when close button is clicked', () => {
    render(
      <BrowserRouter>
        <DailyTip />
      </BrowserRouter>,
    );

    const closeButton = screen.getByLabelText('Dismiss tip');
    fireEvent.click(closeButton);

    // Should be removed from document (or return null)
    expect(screen.queryByText('Test Tip Title')).not.toBeInTheDocument();

    // Should be saved in localStorage
    expect(localStorage.getItem('daily-tip-dismissed')).toBe(
      new Date().toDateString(),
    );
  });

  it('does not render if already dismissed today', () => {
    localStorage.setItem('daily-tip-dismissed', new Date().toDateString());

    render(
      <BrowserRouter>
        <DailyTip />
      </BrowserRouter>,
    );

    expect(screen.queryByText('Test Tip Title')).not.toBeInTheDocument();
  });
});
