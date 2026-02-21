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
import { useChartColors } from '../../utils/chart-colors';

interface CategoryBreakdownChartProps {
  records: FinancialRecord[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  records,
}) => {
  const { format } = useCurrencyFormatter();
  const colors = useChartColors();
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
              stroke={colors.grid}
              horizontal={false}
            />
            <XAxis
              type='number'
              stroke={colors.text}
              fontSize={12}
              tickFormatter={(val) =>
                format(val, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
            />
            <YAxis
              dataKey='category'
              type='category'
              stroke={colors.text}
              fontSize={12}
              width={80}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: colors.grid, opacity: 0.1 }}
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                borderColor: colors.tooltipBorder,
                color: colors.tooltipText,
              }}
              itemStyle={{ color: colors.tooltipText }}
              formatter={(value: number | undefined) => [
                value != null ? format(value) : '',
                undefined,
              ]}
            />
            <Legend />
            <Bar
              dataKey='income'
              name='Income'
              fill={colors.income}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar
              dataKey='expense'
              name='Expense'
              fill={colors.expense}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className='flex h-full flex-col items-center justify-center text-text-secondary'>
          <p>No data available</p>
        </div>
      )}
    </ChartContainer>
  );
};
