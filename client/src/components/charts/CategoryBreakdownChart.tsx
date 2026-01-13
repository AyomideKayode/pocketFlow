import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { type FinancialRecord } from '../../contexts/financial-record-context';

interface CategoryBreakdownChartProps {
  records: FinancialRecord[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  records,
}) => {
  // Group records by category and calculate totals
  const categoryData = records.reduce(
    (acc: Record<string, { income: number; expense: number }>, record) => {
      if (!acc[record.category]) {
        acc[record.category] = { income: 0, expense: 0 };
      }

      if (record.type === 'income') {
        acc[record.category].income += Math.abs(record.amount);
      } else {
        acc[record.category].expense += record.amount;
      }

      return acc;
    },
    {}
  );

  // Convert to chart data format
  const data = Object.entries(categoryData)
    .map(([category, amounts]) => ({
      category,
      income: amounts.income,
      expense: amounts.expense,
    }))
    .sort((a, b) => b.income + b.expense - (a.income + a.expense)); // Sort by total amount

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string; }>; label?: string; }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #404040',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <p
            style={{
              color: '#ffffff',
              margin: '0 0 8px 0',
              fontWeight: '600',
            }}
          >
            {label}
          </p>
          {payload.map((entry, index: number) => (
            <p
              key={index}
              style={{
                color: entry.color,
                margin: '2px 0',
                fontSize: '14px',
              }}
            >
              {entry.dataKey}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title='Spending by Category'>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#404040' />
            <XAxis
              dataKey='category'
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: '#666666' }}
            />
            <YAxis
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: '#666666' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='income' fill='#22c55e' name='Income' />
            <Bar dataKey='expense' fill='#ef4444' name='Expense' />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888888',
            height: '100%',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p>No category data to display</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Add some records to see spending breakdown by category
          </p>
        </div>
      )}
    </ChartContainer>
  );
};
