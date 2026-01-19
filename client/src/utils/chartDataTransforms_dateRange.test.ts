import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getDefaultDateRange, filterRecordsByDateRange } from './chartDataTransforms';
import type { FinancialRecord } from '../contexts/financial-record-context';

describe('Date Range Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getDefaultDateRange should return endDate at the end of the current day', () => {
    // Mock date to 2023-10-10 12:00:00
    const mockNow = new Date(2023, 9, 10, 12, 0, 0); // Month is 0-indexed. Oct = 9.
    vi.setSystemTime(mockNow);

    const { endDate, startDate } = getDefaultDateRange();

    // Check End Date
    expect(endDate.getFullYear()).toBe(2023);
    expect(endDate.getMonth()).toBe(9);
    expect(endDate.getDate()).toBe(10);
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
    expect(endDate.getSeconds()).toBe(59);
    expect(endDate.getMilliseconds()).toBe(999);

    // Check Start Date (30 days ago)
    // 30 days before Oct 10 is Sept 10.
    expect(startDate.getFullYear()).toBe(2023);
    expect(startDate.getMonth()).toBe(8); // Sept
    expect(startDate.getDate()).toBe(10);
    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);
  });

  it('filterRecordsByDateRange should include records created later on the same day', () => {
     // Scenario: Dashboard loaded at 10:00 AM.
     // User adds record at 2:00 PM.
     // Dashboard should include it without refresh (if state update triggered re-filter).

     const mockNow = new Date(2023, 9, 10, 10, 0, 0);
     vi.setSystemTime(mockNow);

     const range = getDefaultDateRange(); // endDate is 23:59:59

     const recordLaterThatDay: FinancialRecord = {
       _id: '1',
       userId: 'u1',
       date: new Date(2023, 9, 10, 14, 0, 0), // 2:00 PM
       description: 'Lunch',
       amount: 20,
       type: 'expense',
       category: 'Food',
       paymentMethod: 'Cash'
     };

     const filtered = filterRecordsByDateRange([recordLaterThatDay], range);
     expect(filtered).toHaveLength(1);
  });
});
