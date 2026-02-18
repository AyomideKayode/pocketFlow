import { describe, it, expect, vi, beforeEach } from 'vitest';
import { markAsPaid, markAsUnpaid } from './bill.service.js';

// Hoist mocks
const { mockFindOneAndUpdate, mockFindOne } = vi.hoisted(() => {
  return {
    mockFindOneAndUpdate: vi.fn(),
    mockFindOne: vi.fn(),
  };
});

const { mockGetCurrentPeriod } = vi.hoisted(() => {
  return {
    mockGetCurrentPeriod: vi.fn(),
  };
});

// Mock Dependencies
vi.mock('../schema/bill.js', () => ({
  default: {
    findOneAndUpdate: mockFindOneAndUpdate,
    findOne: mockFindOne,
  },
}));

vi.mock('../utils/date.js', () => ({
  getCurrentPeriod: mockGetCurrentPeriod,
}));

describe('BillService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentPeriod.mockReturnValue('2023-01');
  });

  describe('markAsPaid', () => {
    it('should update lastPaidPeriod to current period', async () => {
      const mockBill = { _id: 'bill1', lastPaidPeriod: '2023-01' };
      mockFindOneAndUpdate.mockResolvedValue(mockBill);

      const result = await markAsPaid('bill1', 'user1');

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'bill1', userId: 'user1' },
        { lastPaidPeriod: '2023-01' },
        { new: true }
      );
      expect(result).toEqual(mockBill);
    });

    it('should throw error if bill not found', async () => {
      mockFindOneAndUpdate.mockResolvedValue(null);

      await expect(markAsPaid('bill1', 'user1')).rejects.toThrow('Bill not found');
    });
  });

  describe('markAsUnpaid', () => {
    it('should reset lastPaidPeriod to null if current period matches', async () => {
      // Mock existing bill state
      const mockBill = {
        _id: 'bill1',
        lastPaidPeriod: '2023-01',
        save: vi.fn().mockResolvedValue({ _id: 'bill1', lastPaidPeriod: null }),
      };
      mockFindOne.mockResolvedValue(mockBill);

      const result = await markAsUnpaid('bill1', 'user1');

      expect(mockFindOne).toHaveBeenCalledWith({ _id: 'bill1', userId: 'user1' });
      expect(result.lastPaidPeriod).toBeNull();
      expect(mockBill.save).toHaveBeenCalled();
    });

    it('should reject unpay for previous periods', async () => {
      // Bill paid in PREVIOUS period
      const mockBill = {
        _id: 'bill1',
        lastPaidPeriod: '2022-12', // Different from mocked current '2023-01'
      };
      mockFindOne.mockResolvedValue(mockBill);

      await expect(markAsUnpaid('bill1', 'user1')).rejects.toThrow(/Cannot unpay bill/);
    });

    it('should throw error if bill not found', async () => {
      mockFindOne.mockResolvedValue(null);
      await expect(markAsUnpaid('bill1', 'user1')).rejects.toThrow('Bill not found');
    });
  });
});
