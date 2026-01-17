import React from 'react';
import {
  AreaChart,
  Area,
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
  const data = monthly.map((m) => ({
    month: m.month,
    income: Number(m.income.toFixed(2)),
    expense: Number(m.expense.toFixed(2)),
  }));

  return (
    <ChartContainer title='Financial Trends'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorIncome' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorExpense' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#f43f5e' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#f43f5e' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#1e293b'
            vertical={false}
          />
          <XAxis
            dataKey='month'
            stroke='#64748b'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='#64748b'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              color: '#f1f5f9',
            }}
            itemStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area
            type='monotone'
            dataKey='income'
            stroke='#10b981'
            fillOpacity={1}
            fill='url(#colorIncome)'
            name='Income'
            strokeWidth={2}
          />
          <Area
            type='monotone'
            dataKey='expense'
            stroke='#f43f5e'
            fillOpacity={1}
            fill='url(#colorExpense)'
            name='Expenses'
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
