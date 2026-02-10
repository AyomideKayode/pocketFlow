import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoist mocks
const { mockBillFind } = vi.hoisted(() => ({
  mockBillFind: vi.fn(),
}));

// Mock BillModel
vi.mock('../schema/bill.js', () => ({
  default: {
    find: mockBillFind,
  },
}));

import { getInsights } from './insight.service.js';

describe('Insight Service', () => {
  const userId = 'user123';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Upcoming Bills Insight', () => {
    it('should generate attention insight if 2+ unpaid bills are due within 7 days', async () => {
      // Today: 2024-01-28 (Sunday)
      vi.setSystemTime(new Date('2024-01-28T12:00:00Z'));

      mockBillFind.mockResolvedValue([
        {
          _id: 'b1',
          name: 'Bill 1',
          amount: 50,
          dueDay: 30, // Jan 30 (In 2 days)
          isRecurring: false,
          lastPaidPeriod: null, // Unpaid
        },
        {
          _id: 'b2',
          name: 'Bill 2',
          amount: 50,
          dueDay: 2, // Feb 2 (In 5 days - next month)
          isRecurring: true,
          lastPaidPeriod: '2024-01', // Paid for Jan, but unpaid for Feb
        },
      ]);

      const insights = await getInsights(userId);

      expect(insights).toHaveLength(1);
      expect(insights[0].id).toBe('upcoming-bills');
      expect(insights[0].level).toBe('attention');
    });

    it('should NOT generate insight if bills are paid for the relevant period', async () => {
      // Today: 2024-01-28
      vi.setSystemTime(new Date('2024-01-28T12:00:00Z'));

      mockBillFind.mockResolvedValue([
        {
          _id: 'b1',
          name: 'Bill 1',
          dueDay: 30,
          lastPaidPeriod: '2024-01', // Paid
        },
        {
          _id: 'b2',
          name: 'Bill 2',
          dueDay: 2,
          lastPaidPeriod: '2024-02', // Paid for Feb (advance)
        },
      ]);

      const insights = await getInsights(userId);
      expect(insights).toHaveLength(0);
    });

    it('should NOT generate insight if fewer than 2 bills are upcoming', async () => {
      vi.setSystemTime(new Date('2024-01-28T12:00:00Z'));

      mockBillFind.mockResolvedValue([
        {
          _id: 'b1',
          name: 'Bill 1',
          dueDay: 30,
          lastPaidPeriod: null, // 1 upcoming
        },
        {
          _id: 'b3',
          name: 'Bill 3',
          dueDay: 10, // Not upcoming (Feb 10 is > 7 days away)
          lastPaidPeriod: null,
        },
      ]);

      const insights = await getInsights(userId);
      expect(insights).toHaveLength(0);
    });
  });

  describe('Subscription Check Insight', () => {
    it('should generate info insight if 5+ recurring bills exist', async () => {
      const bills = Array(5).fill(null).map((_, i) => ({
        _id: `b${i}`,
        isRecurring: true,
      }));

      mockBillFind.mockResolvedValue(bills);

      const insights = await getInsights(userId);

      expect(insights).toHaveLength(1);
      expect(insights[0].id).toBe('subscription-check');
      expect(insights[0].level).toBe('info');
    });

    it('should NOT generate insight if fewer than 5 recurring bills', async () => {
      const bills = Array(4).fill(null).map((_, i) => ({
        _id: `b${i}`,
        isRecurring: true,
      }));
      // Add a non-recurring bill
      bills.push({ _id: 'b5', isRecurring: false });

      mockBillFind.mockResolvedValue(bills);

      const insights = await getInsights(userId);
      expect(insights).toHaveLength(0);
    });
  });

  describe('Combined Insights', () => {
    it('should return multiple insights if criteria met', async () => {
      vi.setSystemTime(new Date('2024-01-28T12:00:00Z'));

      // 5 recurring bills, 2 of them upcoming unpaid
      const bills = [
        { _id: 'b1', dueDay: 29, isRecurring: true, lastPaidPeriod: null }, // Upcoming
        { _id: 'b2', dueDay: 30, isRecurring: true, lastPaidPeriod: null }, // Upcoming
        { _id: 'b3', dueDay: 15, isRecurring: true, lastPaidPeriod: null },
        { _id: 'b4', dueDay: 15, isRecurring: true, lastPaidPeriod: null },
        { _id: 'b5', dueDay: 15, isRecurring: true, lastPaidPeriod: null },
      ];

      mockBillFind.mockResolvedValue(bills);

      const insights = await getInsights(userId);

      expect(insights).toHaveLength(2);
      expect(insights.map((i) => i.id)).toContain('upcoming-bills');
      expect(insights.map((i) => i.id)).toContain('subscription-check');
    });
  });
});
