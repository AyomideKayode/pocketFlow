import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Learn } from '../index';

// Mock Auth
const mockUser = {
  uid: 'test-user',
  getIdToken: vi.fn().mockResolvedValue('test-token'),
};

vi.mock('../../../contexts/auth-context', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

// Mock Fetch
global.fetch = vi.fn();

describe('Learn Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders education content by default', async () => {
    // Mock successful empty fetch to avoid error state
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<Learn />);

    // Wait for the effect to run to avoid act warnings
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByText('Financial Education')).toBeInTheDocument();
    expect(screen.getByText('Budgeting Basics')).toBeInTheDocument();
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    expect(screen.getByText('Managing Debt')).toBeInTheDocument();
  });

  it('renders insights when API returns data', async () => {
    const mockInsights = [
      {
        id: '1',
        title: 'Test Insight',
        message: 'This is a test message',
        level: 'info',
      },
      {
        id: '2',
        title: 'Attention Needed',
        message: 'Urgent message',
        level: 'attention',
      },
    ];

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockInsights,
    });

    render(<Learn />);

    // Wait for fetch to complete and update state
    await waitFor(() => {
      expect(screen.getByText('Test Insight')).toBeInTheDocument();
      expect(screen.getByText('This is a test message')).toBeInTheDocument();
      expect(screen.getByText('Attention Needed')).toBeInTheDocument();
    });
  });

  it('renders empty state when API returns no insights', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<Learn />);

    await waitFor(() => {
      expect(screen.getByText('All clear!')).toBeInTheDocument();
      expect(
        screen.getByText(
          'No specific insights right now. Keep tracking your finances to stay on top of things.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    render(<Learn />);

    await waitFor(() => {
      expect(
        screen.getByText('Could not load insights at this time.'),
      ).toBeInTheDocument();
    });
  });
});
