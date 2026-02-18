import type { Bill } from '../types/bill';

export type BillVisualState = 'paid' | 'upcoming' | 'overdue';

/**
 * Returns the current period (YYYY-MM) in local time.
 */
function getCurrentLocalPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Determines the due date for a bill in the context of the given period.
 */
export function getBillDueDate(
  bill: Bill,
  currentPeriod: string = getCurrentLocalPeriod(),
): Date {
  const [yearStr, monthStr] = currentPeriod.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  // Handle month overflow (e.g. Feb 30 -> Feb 28/29)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const effectiveDueDay = Math.min(bill.dueDay, daysInMonth);

  const dueDate = new Date(year, month, effectiveDueDay);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate;
}

/**
 * Calculates how many days overdue a bill is relative to today.
 * Returns 0 if due date is today or in the future.
 */
export function getDaysOverdue(
  bill: Bill,
  currentPeriod: string = getCurrentLocalPeriod(),
): number {
  const dueDate = getBillDueDate(bill, currentPeriod);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dueDate >= today) return 0;

  // Calculate difference in days
  const diffTime = Math.abs(today.getTime() - dueDate.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Determines the visual state of a bill based on its status and due date relative to today.
 *
 * Rules:
 * - If lastPaidPeriod matches currentPeriod, it is 'paid'.
 * - If dueDate (derived from currentPeriod and dueDay) is in the past (before today), it is 'overdue'.
 * - Otherwise, it is 'upcoming'.
 */
export function getBillVisualState(
  bill: Bill,
  currentPeriod: string = getCurrentLocalPeriod(),
): BillVisualState {
  // 1. Check if paid
  if (bill.lastPaidPeriod === currentPeriod) {
    return 'paid';
  }

  // 2. Determine due date for the target period
  const dueDate = getBillDueDate(bill, currentPeriod);

  // 3. Compare with Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return 'overdue';
  }

  return 'upcoming';
}
