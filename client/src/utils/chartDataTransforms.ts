import type { FinancialRecord } from '../contexts/financial-record-context';
import type { DateRange } from '../components/DateRangeFilter';

export const filterRecordsByDateRange = (
  records: FinancialRecord[],
  dateRange: DateRange,
): FinancialRecord[] => {
  return records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
  });
};

export const getDefaultDateRange = (): DateRange => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  startDate.setHours(0, 0, 0, 0);

  return {
    startDate,
    endDate,
    label: 'Last 30 Days',
  };
};

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
    {},
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

export const groupRecordsByDay = (records: FinancialRecord[]) => {
  const dailyData: Record<
    string,
    { income: number; expense: number; label: string; date: string }
  > = {};

  records.forEach((record) => {
    const d = new Date(record.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(d.getDate()).padStart(2, '0')}`; // Local YYYY-MM-DD
    const label = d.toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
    });

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { income: 0, expense: 0, label, date: dateKey };
    }

    if (record.type === 'income') {
      dailyData[dateKey].income += record.amount;
    } else {
      dailyData[dateKey].expense += record.amount;
    }
  });

  return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
};

export const groupRecordsByWeek = (records: FinancialRecord[]) => {
  const weeklyData: Record<
    string,
    { income: number; expense: number; label: string; date: string }
  > = {};

  records.forEach((record) => {
    const d = new Date(record.date);
    // Adjust to Monday
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const dateKey = `${monday.getFullYear()}-${String(
      monday.getMonth() + 1,
    ).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
    const label = `Week of ${monday.toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
    })}`;

    if (!weeklyData[dateKey]) {
      weeklyData[dateKey] = { income: 0, expense: 0, label, date: dateKey };
    }

    if (record.type === 'income') {
      weeklyData[dateKey].income += record.amount;
    } else {
      weeklyData[dateKey].expense += record.amount;
    }
  });

  return Object.values(weeklyData).sort((a, b) => a.date.localeCompare(b.date));
};

export const groupRecordsByMonth = (records: FinancialRecord[]) => {
  const monthlyData: Record<
    string,
    { income: number; expense: number; label: string; date: string }
  > = {};

  records.forEach((record) => {
    const date = new Date(record.date);
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    const label = date.toLocaleDateString('default', {
      month: 'short',
      year: 'numeric',
    });

    if (!monthlyData[dateKey]) {
      monthlyData[dateKey] = { income: 0, expense: 0, label, date: dateKey };
    }

    if (record.type === 'income') {
      monthlyData[dateKey].income += record.amount;
    } else {
      monthlyData[dateKey].expense += record.amount;
    }
  });

  return Object.values(monthlyData).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
};
