import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBillVisualState, getDaysOverdue } from './bill';
import { Bill } from '../types/bill';

describe('Bill Utils', () => {
  const mockBill: Bill = {
    _id: '1',
    userId: 'u1',
    name: 'Test Bill',
    amount: 100,
    dueDay: 15,
    isRecurring: true,
    lastPaidPeriod: null,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('identifies paid bills correctly', () => {
    const paidBill = { ...mockBill, lastPaidPeriod: '2024-02' };
    const state = getBillVisualState(paidBill, '2024-02');
    expect(state).toBe('paid');
  });

  it('identifies overdue bills (due date < today)', () => {
    // Current period: Feb 2024. Today: Feb 20. Due: Feb 15.
    vi.setSystemTime(new Date('2024-02-20T10:00:00Z'));

    const state = getBillVisualState(mockBill, '2024-02'); // dueDay 15
    expect(state).toBe('overdue');
  });

  it('identifies upcoming bills (due date > today)', () => {
    // Current period: Feb 2024. Today: Feb 10. Due: Feb 15.
    vi.setSystemTime(new Date('2024-02-10T10:00:00Z'));

    const state = getBillVisualState(mockBill, '2024-02');
    expect(state).toBe('upcoming');
  });

  it('identifies upcoming bills (due date == today)', () => {
    // Current period: Feb 2024. Today: Feb 15. Due: Feb 15.
    vi.setSystemTime(new Date('2024-02-15T10:00:00Z'));

    const state = getBillVisualState(mockBill, '2024-02');
    expect(state).toBe('upcoming');
  });

  it('handles previous months correctly (unpaid)', () => {
    // Current period: Jan 2024. Today: Feb 20. Due: Jan 15.
    vi.setSystemTime(new Date('2024-02-20T10:00:00Z'));

    const state = getBillVisualState(mockBill, '2024-01');
    expect(state).toBe('overdue');
  });

  it('calculates days overdue correctly', () => {
    // Today: Feb 20. Due: Feb 15.
    vi.setSystemTime(new Date('2024-02-20T10:00:00Z'));

    const days = getDaysOverdue(mockBill, '2024-02'); // due 15
    expect(days).toBe(5);
  });

  it('returns 0 days overdue if upcoming', () => {
    // Today: Feb 10. Due: Feb 15.
    vi.setSystemTime(new Date('2024-02-10T10:00:00Z'));

    const days = getDaysOverdue(mockBill, '2024-02');
    expect(days).toBe(0);
  });
});
