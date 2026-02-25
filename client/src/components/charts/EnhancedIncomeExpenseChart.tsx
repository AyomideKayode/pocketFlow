import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useTheme } from '../../contexts/theme-context';

interface EnhancedIncomeExpenseChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  onSegmentClick?: (data: any) => void;
}

export const EnhancedIncomeExpenseChart = ({
  data,
  onSegmentClick,
}: EnhancedIncomeExpenseChartProps) => {
  const { format } = useCurrencyFormatter();
  const { theme } = useTheme();

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
          onClick={(data) => onSegmentClick?.(data)}
          cursor='pointer'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke='none' />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number | undefined) => format(value || 0)}
          contentStyle={{
            backgroundColor:
              theme === 'dark'
                ? 'rgba(26, 26, 26, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            border: theme === 'dark' ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
            borderRadius: '8px',
            color: theme === 'dark' ? '#fff' : '#111827',
          }}
          itemStyle={{ color: theme === 'dark' ? '#fff' : '#111827' }}
        />
        <Legend
          verticalAlign='bottom'
          height={60}
          content={(props) => {
            const { payload } = props;
            return (
              <div className='overflow-x-auto px-2 pb-2'>
                <div className='flex gap-3 min-w-max justify-start md:justify-center'>
                  {payload?.map((entry: any, index: number) => (
                    <div
                      key={`legend-${index}`}
                      className='flex items-center gap-1.5 whitespace-nowrap'
                    >
                      <div
                        className='w-3 h-3 rounded-sm flex-shrink-0'
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className='text-[10px] sm:text-xs text-gray-700 dark:text-slate-300'>
                        {entry.value}: {format(entry.payload.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
