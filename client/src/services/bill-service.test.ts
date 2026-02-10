import { describe, it, expect, vi, beforeEach } from 'vitest';
import { billService } from './bill-service';

const API_BASE_URL = 'http://localhost:3001';

global.fetch = vi.fn();

describe('billService', () => {
  const token = 'fake-token';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('updateBill', () => {
    it('should call PUT /bills/:id', async () => {
      const mockBill = { _id: '123', name: 'Test Bill' };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBill,
      } as Response);

      const result = await billService.updateBill(token, '123', { name: 'Updated' });

      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/bills/123`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: 'Updated' }),
      });
      expect(result).toEqual(mockBill);
    });

    // Note: TypeScript prevents passing lastPaidPeriod to updateBill,
    // so we don't need a runtime test for that client-side unless we cast to any.
  });

  describe('markBillPaid', () => {
    it('should call POST /bills/:id/pay', async () => {
      const mockBill = { _id: '123', lastPaidPeriod: '2025-02' };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBill,
      } as Response);

      const result = await billService.markBillPaid(token, '123');

      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/bills/123/pay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(result).toEqual(mockBill);
    });
  });

  describe('markBillUnpaid', () => {
    it('should call POST /bills/:id/unpay', async () => {
      const mockBill = { _id: '123', lastPaidPeriod: null };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBill,
      } as Response);

      const result = await billService.markBillUnpaid(token, '123');

      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/bills/123/unpay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(result).toEqual(mockBill);
    });

    it('should throw error if response is not ok', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Cannot unpay' }),
        } as Response);

        await expect(billService.markBillUnpaid(token, '123')).rejects.toThrow('Cannot unpay');
    });
  });
});
