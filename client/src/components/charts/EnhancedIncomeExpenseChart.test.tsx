import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EnhancedIncomeExpenseChart } from './EnhancedIncomeExpenseChart';

// Mock Recharts
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div className="recharts-responsive-container">{children}</div>,
    PieChart: ({ children }: any) => <div className="recharts-wrapper">{children}</div>,
    Pie: ({ data, label }: any) => (
      <div className="recharts-pie">
        {data.map((entry: any, index: number) => (
          <div key={index} data-testid="pie-slice">
            {entry.name}: {entry.value}
            {/* Render label if function */}
            {typeof label === 'function' ? label({ name: entry.name, percent: 0.5 }) : null}
          </div>
        ))}
      </div>
    ),
    Cell: () => <div className="recharts-cell" />,
    Tooltip: () => <div className="recharts-tooltip" />,
    Legend: () => <div className="recharts-legend" />,
  };
});

vi.mock('../../hooks/useCurrencyFormatter', () => ({
  useCurrencyFormatter: () => ({
    format: (val: number) => `$${val}`,
  }),
}));

describe('EnhancedIncomeExpenseChart', () => {
  const mockData = [
    { name: 'Income', value: 5000, color: '#10b981' },
    { name: 'Food', value: 1000, color: '#ef4444' },
    { name: 'Rent', value: 2000, color: '#f97316' },
  ];

  it('renders correctly with data', () => {
    render(<EnhancedIncomeExpenseChart data={mockData} />);

    // Check if pie slices are rendered
    const slices = screen.getAllByTestId('pie-slice');
    expect(slices).toHaveLength(3);

    // Check content
    expect(screen.getByText(/Income: 5000/)).toBeInTheDocument();
    expect(screen.getByText(/Food: 1000/)).toBeInTheDocument();
    expect(screen.getByText(/Rent: 2000/)).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    render(<EnhancedIncomeExpenseChart data={[]} />);
    const slices = screen.queryAllByTestId('pie-slice');
    expect(slices).toHaveLength(0);
  });
});
