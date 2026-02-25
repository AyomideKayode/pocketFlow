import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EnhancedIncomeExpenseChart } from './EnhancedIncomeExpenseChart';

// Mock Recharts
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div className='recharts-responsive-container'>{children}</div>
    ),
    PieChart: ({ children }: any) => {
      const childrenArray = React.Children.toArray(children);
      const pieChild: any = childrenArray.find(
        (child: any) => child.props && child.props.data,
      );
      const payload =
        pieChild?.props.data.map((item: any) => ({
          value: item.name,
          color: item.color,
          payload: item,
        })) || [];

      return (
        <div className='recharts-wrapper'>
          {React.Children.map(children, (child: any) => {
            if (
              child.props &&
              (child.type?.name === 'Legend' || child.props.verticalAlign)
            ) {
              return React.cloneElement(child, { payload });
            }
            return child;
          })}
        </div>
      );
    },
    Pie: ({ data, label, onClick }: any) => (
      <div className='recharts-pie'>
        {data.map((entry: any, index: number) => (
          <div
            key={index}
            data-testid='pie-slice'
            onClick={() => onClick?.(entry)}
          >
            {/* Render label if function */}
            {typeof label === 'function'
              ? label({ name: entry.name, percent: 0.5 })
              : null}
          </div>
        ))}
      </div>
    ),
    Cell: () => <div className='recharts-cell' />,
    Tooltip: () => <div className='recharts-tooltip' />,
    Legend: ({ content, payload }: any) => (
      <div className='recharts-legend'>
        {typeof content === 'function' ? content({ payload }) : null}
      </div>
    ),
  };
});

vi.mock('../../hooks/useCurrencyFormatter', () => ({
  useCurrencyFormatter: () => ({
    format: (val: number) => `$${val}`,
  }),
}));

vi.mock('../../contexts/theme-context', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
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

    // Check if legend content is rendered (since labels are removed from segments)
    expect(screen.getByText(/Income: \$5000/)).toBeInTheDocument();
    expect(screen.getByText(/Food: \$1000/)).toBeInTheDocument();
    expect(screen.getByText(/Rent: \$2000/)).toBeInTheDocument();

    // Ensure no percentage labels are present (from old implementation)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('calls onSegmentClick when a slice is clicked', () => {
    const onSegmentClick = vi.fn();
    render(
      <EnhancedIncomeExpenseChart
        data={mockData}
        onSegmentClick={onSegmentClick}
      />,
    );

    const slices = screen.getAllByTestId('pie-slice');
    slices[0].click();

    expect(onSegmentClick).toHaveBeenCalled();
  });

  it('renders correctly with empty data', () => {
    render(<EnhancedIncomeExpenseChart data={[]} />);
    const slices = screen.queryAllByTestId('pie-slice');
    expect(slices).toHaveLength(0);
  });
});
