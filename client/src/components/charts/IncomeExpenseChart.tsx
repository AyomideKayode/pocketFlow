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
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { type FinancialRecord } from '../../contexts/financial-record-context';
import { useChartColors } from '../../utils/chart-colors';

interface IncomeExpenseChartProps {
  records: FinancialRecord[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  records,
}) => {
  const { format } = useCurrencyFormatter();
  const colors = useChartColors();

  const totalIncome = records
    .filter((record) => record.type === 'income')
    .reduce((acc, record) => acc + Math.abs(record.amount), 0);

  const totalExpenses = records
    .filter((record) => record.type === 'expense')
    .reduce((acc, record) => acc + record.amount, 0);

  const data = [
    { name: 'Income', value: totalIncome, color: colors.income },
    { name: 'Expenses', value: totalExpenses, color: colors.expense },
  ].filter((item) => item.value > 0);

  return (
    <ChartContainer title='Income vs Expenses'>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke='none' />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                borderColor: colors.tooltipBorder,
                color: colors.tooltipText,
              }}
              itemStyle={{ color: colors.tooltipText }}
              formatter={(value: number | undefined) =>
                value != null ? format(value) : ''
              }
            />
            <Legend verticalAlign='bottom' height={36} iconType='circle' />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className='flex h-full flex-col items-center justify-center text-text-secondary'>
          <p>No data available</p>
        </div>
      )}
    </ChartContainer>
  );
};
