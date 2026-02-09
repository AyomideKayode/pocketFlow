import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// 1. Hoist mocks
const {
  mockFind,
  mockFindOneAndUpdate,
  mockFindOneAndDelete,
  mockSave,
} = vi.hoisted(() => {
  return {
    mockFind: vi.fn(),
    mockFindOneAndUpdate: vi.fn(),
    mockFindOneAndDelete: vi.fn(),
    mockSave: vi.fn(),
  };
});

// 2. Mock Firebase Admin
vi.mock('../lib/firebaseAdmin.js', () => {
  return {
    verifyIdToken: vi.fn().mockImplementation(async (token) => {
      if (token === 'valid-token') {
        return { uid: 'user-123' };
      }
      throw new Error('Invalid token');
    }),
    default: {
      auth: () => ({
        verifyIdToken: vi.fn(),
      }),
    },
  };
});

// 3. Mock Mongoose Model
vi.mock('../schema/bill.js', () => {
  return {
    default: class MockBillModel {
      constructor(data: any) {
        Object.assign(this, data);
      }
      save = mockSave;
      static find = mockFind;
      static findOneAndUpdate = mockFindOneAndUpdate;
      static findOneAndDelete = mockFindOneAndDelete;
    },
  };
});

// Mock Cloudinary/other routes to avoid interference
vi.mock('../routes/cloudinary.js', () => ({
  default: (req: any, res: any, next: any) => next(),
}));

import app from '../app.js';
// Need to mount the router manually if app.js doesn't have it yet?
// The plan says "Register Backend Routes" is next step.
// So app.js does NOT have '/bills' yet.
// I must mount it in the test or modify app.js first.
// I can modify app.js in the next step.
// But for this test to run, I need app to have the route.
// Or I can create a temporary express app in the test.
// But `app.js` is imported.
// If I modify `app.js` first, then run test, it works.
// "Register Backend Routes" is step 4.
// "Create Backend Routes and Tests" is step 3.
// I should probably register the route in `app.ts` now so the test can pass?
// Or I can manually use the router in the test: `const testApp = express(); testApp.use('/bills', billRouter);`
// I'll do that to be independent of app.ts state.

import express from 'express';
import billRouter from './bill.js';

const testApp = express();
testApp.use(express.json());
testApp.use('/bills', billRouter);

describe('Bill Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /bills', () => {
    it('should return 401 if no token', async () => {
      const res = await request(testApp).get('/bills');
      expect(res.status).toBe(401);
    });

    it('should return bills for user', async () => {
      const mockBills = [
        { name: 'Rent', amount: 1000, dueDay: 1, isRecurring: true },
      ];
      // mockFind needs to return an object with sort() method because service calls .sort()
      const mockQuery = {
        sort: vi.fn().mockResolvedValue(mockBills),
      };
      mockFind.mockReturnValue(mockQuery);

      const res = await request(testApp)
        .get('/bills')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBills);
      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-123' }),
      );
    });
  });

  describe('POST /bills', () => {
    it('should create a bill', async () => {
      const newBill = {
        name: 'Internet',
        amount: 50,
        dueDay: 15,
        isRecurring: true,
      };
      mockSave.mockResolvedValue({ ...newBill, _id: 'bill-1', userId: 'user-123' });

      const res = await request(testApp)
        .post('/bills')
        .set('Authorization', 'Bearer valid-token')
        .send(newBill);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(newBill);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should validate input', async () => {
      const res = await request(testApp)
        .post('/bills')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Incomplete' }); // Missing amount/dueDay
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /bills/:id', () => {
    it('should update a bill', async () => {
      const updateData = { amount: 60 };
      mockFindOneAndUpdate.mockResolvedValue({
        _id: 'bill-1',
        name: 'Internet',
        amount: 60,
      });

      const res = await request(testApp)
        .put('/bills/bill-1')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'bill-1', userId: 'user-123' },
        updateData,
        { new: true },
      );
    });
  });

  describe('DELETE /bills/:id', () => {
    it('should delete a bill', async () => {
      mockFindOneAndDelete.mockResolvedValue({ _id: 'bill-1' });

      const res = await request(testApp)
        .delete('/bills/bill-1')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(mockFindOneAndDelete).toHaveBeenCalledWith({
        _id: 'bill-1',
        userId: 'user-123',
      });
    });
  });
});
