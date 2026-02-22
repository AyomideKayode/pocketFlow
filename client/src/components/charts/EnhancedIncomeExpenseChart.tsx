import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

interface EnhancedIncomeExpenseChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

export const EnhancedIncomeExpenseChart = ({ data }: EnhancedIncomeExpenseChartProps) => {
  const { format } = useCurrencyFormatter();

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey='value'
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke='none' />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => format(value)}
          contentStyle={{
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid #2d2d2d',
            borderRadius: '8px',
            color: '#fff',
          }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend
          verticalAlign='bottom'
          height={36}
          formatter={(value, entry: any) => (
            <span className='text-xs text-gray-700 dark:text-slate-300'>
              {value}: {format(entry.payload.value)}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
