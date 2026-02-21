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
import { useChartColors } from '../../utils/chart-colors';

interface TrendLineChartProps {
  records: FinancialRecord[];
}

type Granularity = 'day' | 'week' | 'month';

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ records }) => {
  const { format } = useCurrencyFormatter();
  const [granularity, setGranularity] = useState<Granularity>('month');
  const colors = useChartColors();

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
        <div className='flex bg-background-tertiary rounded-lg p-1 text-xs font-medium border border-border'>
          {(['day', 'week', 'month'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={clsx(
                'px-3 py-1 rounded-md transition-all capitalize',
                granularity === g
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary',
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
              <stop offset='5%' stopColor={colors.income} stopOpacity={0.3} />
              <stop offset='95%' stopColor={colors.income} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorExpense' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={colors.expense} stopOpacity={0.3} />
              <stop offset='95%' stopColor={colors.expense} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey='label'
            stroke={colors.text}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={colors.text}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              format(value, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.tooltipBorder,
              color: colors.tooltipText,
              borderRadius: '8px',
            }}
            itemStyle={{ color: colors.tooltipText }}
            labelStyle={{ color: colors.text, marginBottom: '0.5rem' }}
            formatter={(value: number | undefined) => [
              value != null ? format(value) : '',
              undefined,
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area
            type='monotone'
            dataKey='income'
            stroke={colors.income}
            fillOpacity={1}
            fill='url(#colorIncome)'
            name='Income'
            strokeWidth={2}
          />
          <Area
            type='monotone'
            dataKey='expense'
            stroke={colors.expense}
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
