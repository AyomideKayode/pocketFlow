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
  income: '#10b981', // emerald-500
  expense: '#f43f5e', // rose-500
};

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ records }) => {
  const totalIncome = records
    .filter((record) => record.type === 'income')
    .reduce((acc, record) => acc + Math.abs(record.amount), 0);

  const totalExpenses = records
    .filter((record) => record.type === 'expense')
    .reduce((acc, record) => acc + record.amount, 0);

  const data = [
    { name: 'Income', value: totalIncome, color: COLORS.income },
    { name: 'Expenses', value: totalExpenses, color: COLORS.expense },
  ].filter((item) => item.value > 0);

  return (
    <ChartContainer title="Income vs Expenses">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
              formatter={(value: number | undefined) => value != null ? `$${value.toFixed(2)}` : ''}
            />
            <Legend
               verticalAlign="bottom"
               height={36}
               iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-slate-500">
          <p>No data available</p>
        </div>
      )}
    </ChartContainer>
  );
};
