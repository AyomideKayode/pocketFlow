import { useTheme } from '../contexts/theme-context';

export function useChartColors() {
  const { theme } = useTheme();

  return {
    grid: theme === 'dark' ? '#2d2d2d' : '#e5e7eb',
    text: theme === 'dark' ? '#a0a0a0' : '#6b7280',
    income: '#10b981',
    expense: '#ef4444',
    tooltipBg: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#2d2d2d' : '#e5e7eb',
    tooltipText: theme === 'dark' ? '#ffffff' : '#111827',
  };
}
