import BillModel, { type Bill } from '../schema/bill.js';
import { normalizeDueDay } from '../utils/date.js';

export interface Insight {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'attention';
}

/**
 * Generates insights for a user based on their bills.
 * Deterministic, rule-based, and read-only.
 */
export const getInsights = async (userId: string): Promise<Insight[]> => {
  const insights: Insight[] = [];
  const bills = await BillModel.find({ userId });

  // 1. Upcoming Bills Insight
  const upcomingUnpaidCount = countUpcomingUnpaidBills(bills);
  if (upcomingUnpaidCount >= 2) {
    insights.push({
      id: 'upcoming-bills',
      title: 'Upcoming Bills',
      message:
        'Several bills are approaching their due dates. Reviewing them early can help avoid surprises.',
      level: 'attention',
    });
  }

  // 2. Subscription Check Insight
  const recurringCount = bills.filter((b) => b.isRecurring).length;
  if (recurringCount >= 5) {
    insights.push({
      id: 'subscription-check',
      title: 'Subscription Check',
      message:
        'You maintain multiple recurring services. Periodic reviews can ensure each still provides value.',
      level: 'info',
    });
  }

  return insights;
};

/**
 * Counts bills that are due within the next 7 days and are not paid for that specific period.
 */
function countUpcomingUnpaidBills(bills: Bill[]): number {
  const today = new Date();
  // Reset time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  // Set end of window to end of day to be inclusive
  nextWeek.setHours(23, 59, 59, 999);

  let count = 0;

  for (const bill of bills) {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12

    // Check current month occurrence
    if (isBillDueInWindow(bill, currentYear, currentMonth, today, nextWeek)) {
      count++;
      continue;
    }

    // Check next month occurrence (for rollovers)
    let nextMonth = currentMonth + 1;
    let nextMonthYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextMonthYear++;
    }

    if (isBillDueInWindow(bill, nextMonthYear, nextMonth, today, nextWeek)) {
      count++;
    }
  }

  return count;
}

function isBillDueInWindow(
  bill: Bill,
  year: number,
  month: number,
  windowStart: Date,
  windowEnd: Date,
): boolean {
  // Normalize due day (handles overflow like Feb 30 -> Feb 28)
  const dueDate = normalizeDueDay(year, month, bill.dueDay);
  dueDate.setHours(0, 0, 0, 0);

  // Check if date is within [today, today + 7]
  if (dueDate >= windowStart && dueDate <= windowEnd) {
    // Check if paid for this specific period
    const period = `${year}-${String(month).padStart(2, '0')}`;
    if (bill.lastPaidPeriod !== period) {
      return true;
    }
  }
  return false;
}
