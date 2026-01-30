import React, { useState, useMemo } from 'react';
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
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import type { FinancialRecord } from '../../contexts/financial-record-context';
import {
  groupRecordsByMonth,
  groupRecordsByWeek,
  groupRecordsByDay,
} from '../../utils/chartDataTransforms';
import { clsx } from 'clsx';

interface TrendLineChartProps {
  records: FinancialRecord[];
}

type Granularity = 'day' | 'week' | 'month';

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ records }) => {
  const { format } = useCurrencyFormatter();
  const [granularity, setGranularity] = useState<Granularity>('month');

  const data = useMemo(() => {
    let grouped;
    switch (granularity) {
      case 'day':
        grouped = groupRecordsByDay(records);
        break;
      case 'week':
        grouped = groupRecordsByWeek(records);
        break;
      case 'month':
      default:
        grouped = groupRecordsByMonth(records);
        break;
    }
    return grouped.map((m) => ({
      label: m.label,
      date: m.date,
      income: Number(m.income.toFixed(2)),
      expense: Number(m.expense.toFixed(2)),
    }));
  }, [records, granularity]);

  return (
    <ChartContainer
      title='Financial Trends'
      action={
        <div className='flex bg-slate-800 rounded-lg p-1 text-xs font-medium border border-slate-700'>
          {(['day', 'week', 'month'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={clsx(
                'px-3 py-1 rounded-md transition-all capitalize',
                granularity === g
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
              )}
            >
              {g}
            </button>
          ))}
        </div>
      }
    >
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
            dataKey='label'
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
            tickFormatter={(value) =>
              format(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '8px',
            }}
            itemStyle={{ color: '#f1f5f9' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
            formatter={(value: number | undefined) => [
              value != null ? format(value) : '',
              undefined,
            ]}
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
