import { describe, it, expect } from 'vitest';
import { groupRecordsByDay, groupRecordsByWeek, groupRecordsByMonth } from './chartDataTransforms';
import type { FinancialRecord } from '../contexts/financial-record-context';

describe('Chart Data Transforms', () => {
  const mockRecords: FinancialRecord[] = [
    {
      _id: '1',
      userId: 'user1',
      date: new Date('2024-01-01T10:00:00Z'), // Monday
      description: 'Item 1',
      amount: 100,
      category: 'Food',
      paymentMethod: 'Cash',
      type: 'expense'
    },
    {
      _id: '2',
      userId: 'user1',
      date: new Date('2024-01-01T12:00:00Z'), // Same day (safer for timezones)
      description: 'Item 2',
      amount: 50,
      category: 'Salary',
      paymentMethod: 'Bank',
      type: 'income'
    },
    {
      _id: '3',
      userId: 'user1',
      date: new Date('2024-01-08T10:00:00Z'), // Next week (Mon Jan 8)
      description: 'Item 3',
      amount: 200,
      category: 'Food',
      paymentMethod: 'Cash',
      type: 'expense'
    }
  ];

  it('groupRecordsByDay should group correctly', () => {
    const result = groupRecordsByDay(mockRecords);
    // 2024-01-01: income 50, expense 100
    // 2024-01-08: income 0, expense 200
    // Note: Depends on local timezone if not handled carefully, but test uses ISO strings which Date parses to UTC?
    // Wait, new Date('...Z') is UTC.
    // My transform uses `d.toISOString().split('T')[0]`.
    // toISOString() is always UTC.
    // But `d.toLocaleDateString()` uses local time.
    // In `chartDataTransforms.ts`:
    // const dateKey = d.toISOString().split('T')[0]; // UTC Date Key
    // const label = d.toLocaleDateString(...); // Local Label

    // Test environment (CI) usually UTC?

    const day1 = result.find(r => r.date === '2024-01-01');
    expect(day1).toBeDefined();
    expect(day1?.income).toBe(50);
    expect(day1?.expense).toBe(100);

    const day2 = result.find(r => r.date === '2024-01-08');
    expect(day2).toBeDefined();
    expect(day2?.income).toBe(0);
    expect(day2?.expense).toBe(200);
  });

  it('groupRecordsByWeek should group correctly', () => {
    // Jan 1 2024 is Monday. Week of Jan 1.
    const result = groupRecordsByWeek(mockRecords);

    // We expect 2 groups
    // If timezone shift moves it to prev week, keys might differ.
    // But logic uses `d.toISOString()` for key in my implementation?
    // Let's check `groupRecordsByWeek` implementation again.
    // It used `monday.toISOString().split('T')[0]`.

    const week1 = result.find(r => r.date === '2024-01-01');
    expect(week1).toBeDefined();
    expect(week1?.income).toBe(50);
    expect(week1?.expense).toBe(100);

    const week2 = result.find(r => r.date === '2024-01-08');
    expect(week2).toBeDefined();
  });

  it('groupRecordsByMonth should group correctly', () => {
    const result = groupRecordsByMonth(mockRecords);
    // All in Jan 2024
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-01');
    expect(result[0].income).toBe(50);
    expect(result[0].expense).toBe(300); // 100 + 200
  });
});
