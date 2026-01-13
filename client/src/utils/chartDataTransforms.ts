import type { FinancialRecord } from '../contexts/financial-record-context';
import type { DateRange } from '../components/DateRangeFilter';

export const filterRecordsByDateRange = (
  records: FinancialRecord[],
  dateRange: DateRange
): FinancialRecord[] => {
  return records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
  });
};

export const getDefaultDateRange = (): DateRange => ({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
  endDate: new Date(),
  label: 'Last 30 Days',
});

export const groupRecordsByCategory = (records: FinancialRecord[]) => {
  return records.reduce(
    (acc: Record<string, { income: number; expense: number }>, record) => {
      if (!acc[record.category]) {
        acc[record.category] = { income: 0, expense: 0 };
      }

      if (record.type === 'income') {
        acc[record.category].income += record.amount;
      } else {
        acc[record.category].expense += record.amount;
      }

      return acc;
    },
    {}
  );
};

export const calculateTotals = (records: FinancialRecord[]) => {
  const totalIncome = records
    .filter((record) => record.type === 'income')
    .reduce((acc, record) => acc + Math.abs(record.amount), 0);

  const totalExpenses = records
    .filter((record) => record.type === 'expense')
    .reduce((acc, record) => acc + record.amount, 0);

  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
};

export const groupRecordsByMonth = (records: FinancialRecord[]) => {
  const monthlyData: Record<
    string,
    { income: number; expense: number; month: string }
  > = {};

  records.forEach((record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('default', {
      month: 'short',
      year: 'numeric',
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, month: monthLabel };
    }

    if (record.type === 'income') {
      monthlyData[monthKey].income += record.amount;
    } else {
      monthlyData[monthKey].expense += record.amount;
    }
  });

  return Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
};
