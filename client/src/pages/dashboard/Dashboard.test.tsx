import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from './index';
import { BrowserRouter } from 'react-router-dom';

// Mocks
vi.mock('../../contexts/auth-context', () => ({
  useAuth: () => ({
    user: {
      uid: 'user-123',
      displayName: 'Test User',
      getIdToken: vi.fn().mockResolvedValue('mock-token')
    },
  }),
}));

const mockRecords = [
  { _id: '1', amount: 100, type: 'income', date: new Date().toISOString(), category: 'Salary' },
  { _id: '2', amount: 50, type: 'expense', date: new Date().toISOString(), category: 'Food' },
  { _id: '3', amount: 20, type: 'expense', date: new Date().toISOString(), category: 'Transport' },
];

vi.mock('../../contexts/financial-record-context', () => ({
  useFinancialRecords: () => ({
    records: mockRecords,
    recentRecords: mockRecords,
    loading: false,
    fetchRecords: vi.fn(),
  }),
}));

vi.mock('../../hooks/useCurrencyFormatter', () => ({
  useCurrencyFormatter: () => ({
    format: (amount: number) => `$${amount}`,
  }),
}));

vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
  }),
}));

vi.mock('../../contexts/toast-context', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

vi.mock('../../hooks/useBills', () => ({
  useBills: () => ({
    overdue: [],
    loading: false,
  }),
}));

// Mock chart components since they are lazy loaded and complex
vi.mock('../../components/charts/TrendLineChart', () => ({
  TrendLineChart: () => <div>TrendLineChart</div>,
}));
vi.mock('../../components/charts/EnhancedIncomeExpenseChart', () => ({
  EnhancedIncomeExpenseChart: () => <div>EnhancedIncomeExpenseChart</div>,
}));
vi.mock('../../components/charts/CategoryBreakdownChart', () => ({
  CategoryBreakdownChart: () => <div>CategoryBreakdownChart</div>,
}));
vi.mock('./financialRecordList', () => ({
  FinancialRecordList: () => <div>FinancialRecordList</div>,
}));
vi.mock('../../components/DailyTip', () => ({
  DailyTip: () => <div>DailyTip</div>,
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as unknown as typeof fetch;

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockClear();
    // Default mock implementation
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      );
  });

  it('should calculate total income correctly', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should calculate total expenses correctly', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('$70')).toBeInTheDocument();
  });

  it('should calculate net balance (income - expenses)', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Net Balance')).toBeInTheDocument();
    expect(screen.getByText('$30')).toBeInTheDocument();
  });
});
