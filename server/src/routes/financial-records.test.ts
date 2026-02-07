import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const { mockSave, mockFind, mockFindByIdAndUpdate, mockFindByIdAndDelete, mockInsertMany } = vi.hoisted(() => {
  return {
    mockSave: vi.fn(),
    mockFind: vi.fn(),
    mockFindByIdAndUpdate: vi.fn(),
    mockFindByIdAndDelete: vi.fn(),
    mockInsertMany: vi.fn(),
  };
});

const { mockCheckAndNotifyBudgetExceeded } = vi.hoisted(() => {
  return {
    mockCheckAndNotifyBudgetExceeded: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('../services/budget.service.js', () => {
  return {
    checkAndNotifyBudgetExceeded: mockCheckAndNotifyBudgetExceeded,
  };
});

vi.mock('../schema/financial-records.js', () => {
  return {
    default: class MockFinancialRecordModel {
      constructor(data: any) {
        Object.assign(this, data);
      }
      save = mockSave;
      static find = mockFind;
      static findByIdAndUpdate = mockFindByIdAndUpdate;
      static findByIdAndDelete = mockFindByIdAndDelete;
      static findById = vi.fn();
      static insertMany = mockInsertMany;
    },
  };
});

// Mock Cloudinary route to avoid env check failures
vi.mock('../routes/cloudinary.js', () => ({
  default: (req: any, res: any, next: any) => next(),
}));

vi.mock('mongoose', async () => {
  const actual = await vi.importActual<typeof import('mongoose')>('mongoose');
  return {
    ...actual,
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
});

import app from '../app.js';

describe('Financial Records Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /financial-records/bulk', () => {
    it('should insert multiple records', async () => {
       const records = [
           { date: '2023-01-01', amount: 100, type: 'income', category: 'Salary', paymentMethod: 'Transfer' },
           { date: '2023-01-02', amount: 50, type: 'expense', category: 'Food', paymentMethod: 'Card' }
       ];
       const userId = 'user123';

       mockInsertMany.mockResolvedValueOnce(records.map(r => ({ ...r, userId, _id: 'generated_id', date: new Date(r.date) })));

       const res = await request(app).post('/financial-records/bulk').send({ userId, records });

       expect(res.status).toBe(201);
       expect(mockInsertMany).toHaveBeenCalledWith(expect.arrayContaining([
           expect.objectContaining({ userId, category: 'Salary' }),
           expect.objectContaining({ userId, category: 'Food' })
       ]));

       // Verify budget check called with suppression
       // Note: the implementation groups by category/period, so it might be called once for 'Food'
       expect(mockCheckAndNotifyBudgetExceeded).toHaveBeenCalledWith(
           userId,
           'Food',
           expect.any(Date),
           { suppressEmail: true }
       );
    });

     it('should reject invalid input', async () => {
        const res = await request(app).post('/financial-records/bulk').send({ userId: 'u1' }); // missing records
        expect(res.status).toBe(400);
     });
  });
});
