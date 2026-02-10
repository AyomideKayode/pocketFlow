import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import billRouter from './bill.js';
import * as BillService from '../services/bill.service.js';

// Mock dependencies
vi.mock('../services/bill.service.js');
vi.mock('../middleware/auth.js', () => ({
  verifyAuth: (req: any, res: any, next: any) => {
    req.user = { uid: 'user123' };
    next();
  },
}));

// Setup a minimal express app for testing the router in isolation
const app = express();
app.use(express.json());
app.use('/bills', billRouter);

describe('Bill Routes - Hardening', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('PUT /bills/:id', () => {
    it('should reject updates to lastPaidPeriod with 400', async () => {
      const response = await request(app)
        .put('/bills/bill123')
        .send({
          lastPaidPeriod: '2025-02',
          amount: 500,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot update lastPaidPeriod via PUT');
    });

    it('should allow updates to other fields', async () => {
      vi.mocked(BillService.updateBill).mockResolvedValue({
        _id: 'bill123',
        name: 'New Name',
        amount: 600,
      } as any);

      const response = await request(app)
        .put('/bills/bill123')
        .send({
          name: 'New Name',
          amount: 600,
        });

      expect(response.status).toBe(200);
      expect(BillService.updateBill).toHaveBeenCalled();
    });
  });

  describe('POST /bills/:id/pay', () => {
    it('should call markAsPaid service', async () => {
      vi.mocked(BillService.markAsPaid).mockResolvedValue({
        _id: 'bill123',
        lastPaidPeriod: '2025-02',
      } as any);

      const response = await request(app).post('/bills/bill123/pay');

      expect(response.status).toBe(200);
      expect(BillService.markAsPaid).toHaveBeenCalledWith('bill123', 'user123');
    });

    it('should return 404 if bill not found', async () => {
      vi.mocked(BillService.markAsPaid).mockResolvedValue(null);

      const response = await request(app).post('/bills/bill123/pay');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /bills/:id/unpay', () => {
    it('should call markAsUnpaid service', async () => {
      vi.mocked(BillService.markAsUnpaid).mockResolvedValue({
        _id: 'bill123',
        lastPaidPeriod: null,
      } as any);

      const response = await request(app).post('/bills/bill123/unpay');

      expect(response.status).toBe(200);
      expect(BillService.markAsUnpaid).toHaveBeenCalledWith('bill123', 'user123');
    });

    it('should return 409 if service throws "Cannot unpay" error', async () => {
      vi.mocked(BillService.markAsUnpaid).mockRejectedValue(new Error('Cannot unpay bill: Last paid period...'));

      const response = await request(app).post('/bills/bill123/unpay');

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('Cannot unpay');
    });

    it('should return 404 if service throws "Bill not found" error', async () => {
        vi.mocked(BillService.markAsUnpaid).mockRejectedValue(new Error('Bill not found'));

        const response = await request(app).post('/bills/bill123/unpay');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Bill not found');
      });
  });
});
