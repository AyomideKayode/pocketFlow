import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import type { FinancialRecord } from '../../contexts/financial-record-context';
import { groupRecordsByMonth } from '../../utils/chartDataTransforms';

interface TrendLineChartProps {
  records: FinancialRecord[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ records }) => {
  const monthly = groupRecordsByMonth(records);

  // Recharts expects array of objects with consistent keys
  const data = monthly.map((m) => ({
    month: m.month,
    income: Number(m.income.toFixed(2)),
    expense: Number(m.expense.toFixed(2)),
  }));

  return (
    <ChartContainer title='Income & Expenses Over Time'>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#2b2b2b' />
            <XAxis dataKey='month' stroke='#b0b0b0' />
            <YAxis stroke='#b0b0b0' />
            <Tooltip
              formatter={(value: any) =>
                value != null ? `$${Number(value).toFixed(2)}` : ''
              }
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='income'
              stroke='#22c55e'
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type='monotone'
              dataKey='expense'
              stroke='#ef4444'
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};
