import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { type FinancialRecord } from '../../contexts/financial-record-context';

interface IncomeExpenseChartProps {
  records: FinancialRecord[];
}

const COLORS = {
  income: '#22c55e',
  expense: '#ef4444',
};

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  records,
}) => {
  // Calculate totals
  const totalIncome = records
    .filter((record) => record.type === 'income')
    .reduce((acc, record) => acc + Math.abs(record.amount), 0);

  const totalExpenses = records
    .filter((record) => record.type === 'expense')
    .reduce((acc, record) => acc + record.amount, 0);

  // Prepare data for pie chart
  const data = [
    {
      name: 'Income',
      value: totalIncome,
      color: COLORS.income,
    },
    {
      name: 'Expenses',
      value: totalExpenses,
      color: COLORS.expense,
    },
  ].filter((item) => item.value > 0); // Only show categories with values

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
              margin: '0 0 4px 0',
              fontWeight: '600',
            }}
          >
            {data.name}
          </p>
          <p
            style={{
              color: '#22c55e',
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
            }}
          >
            ${data.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title='Income vs Expenses'>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }: any) =>
                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#ffffff' }}>{value}</span>
              )}
            />
          </PieChart>
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
          <p>No financial data to display</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Add some income or expense records to see your financial breakdown
          </p>
        </div>
      )}
    </ChartContainer>
  );
};
