import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { type FinancialRecord } from '../../contexts/financial-record-context';

interface CategoryBreakdownChartProps {
  records: FinancialRecord[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  records,
}) => {
  const { format } = useCurrencyFormatter();
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
    {},
  );

  const data = Object.entries(categoryData)
    .map(([category, amounts]) => ({
      category,
      income: amounts.income,
      expense: amounts.expense,
    }))
    .sort((a, b) => b.income + b.expense - (a.income + a.expense))
    .slice(0, 6); // Limit to top 6 categories for cleaner UI

  return (
    <ChartContainer title='Spending by Category'>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={data}
            layout='vertical'
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#1e293b'
              horizontal={false}
            />
            <XAxis
              type='number'
              stroke='#64748b'
              fontSize={12}
              tickFormatter={(val) =>
                format(val, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              }
            />
            <YAxis
              dataKey='category'
              type='category'
              stroke='#64748b'
              fontSize={12}
              width={80}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.5 }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                color: '#f1f5f9',
              }}
              formatter={(value: number) => [format(value), undefined]}
            />
            <Legend />
            <Bar
              dataKey='income'
              name='Income'
              fill='#10b981'
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar
              dataKey='expense'
              name='Expense'
              fill='#f43f5e'
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className='flex h-full flex-col items-center justify-center text-slate-500'>
          <p>No data available</p>
        </div>
      )}
    </ChartContainer>
  );
};
