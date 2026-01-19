import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Hoist mocks to ensure they are available before imports
const { mockSave, mockFind, mockFindByIdAndUpdate, mockFindByIdAndDelete } = vi.hoisted(() => {
  return {
    mockSave: vi.fn(),
    mockFind: vi.fn(),
    mockFindByIdAndUpdate: vi.fn(),
    mockFindByIdAndDelete: vi.fn(),
  };
});

// Mock the Mongoose Model Class
vi.mock('./schema/financial-records.js', () => {
  return {
    default: class MockFinancialRecordModel {
      constructor(data: any) {
        Object.assign(this, data);
      }
      save = mockSave;
      static find = mockFind;
      static findByIdAndUpdate = mockFindByIdAndUpdate;
      static findByIdAndDelete = mockFindByIdAndDelete;
    },
  };
});

// Mock Mongoose connection
vi.mock('mongoose', async () => {
  const actual = await vi.importActual<typeof import('mongoose')>('mongoose');
  return {
    ...actual,
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
});

// Import app AFTER mocks are defined (though hoisting handles `vi.mock`, local vars need `vi.hoisted`)
import app from './app.js';

describe('Server App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('returns 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.text).toBe('OK');
    });
  });

  describe('POST /financial-records', () => {
    it('should validate missing required fields (type)', async () => {
      const res = await request(app).post('/financial-records').send({
        userId: 'u1',
        amount: 100,
        // missing type
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Valid type/);
    });

    it('should create a record with valid data', async () => {
      const validRecord = {
        userId: 'u1',
        date: new Date().toISOString(),
        description: 'Test',
        amount: 100,
        type: 'expense',
        category: 'Food',
        paymentMethod: 'Cash'
      };

      // Mock save implementation to return the record
      mockSave.mockResolvedValueOnce({
        _id: 'new-id',
        ...validRecord,
        amount: 100
      });

      const res = await request(app).post('/financial-records').send(validRecord);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id', 'new-id');
      expect(res.body.type).toBe('expense');
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('GET /financial-records/getAllByUserId/:userId', () => {
    it('should return records for user', async () => {
      const mockRecords = [
        { _id: '1', userId: 'u1', amount: 100, type: 'income' },
        { _id: '2', userId: 'u1', amount: 50, type: 'expense' }
      ];
      mockFind.mockResolvedValueOnce(mockRecords);

      const res = await request(app).get('/financial-records/getAllByUserId/u1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(mockFind).toHaveBeenCalledWith({ userId: 'u1' });
    });

    it('should return 404 if no records found', async () => {
      mockFind.mockResolvedValueOnce([]);
      const res = await request(app).get('/financial-records/getAllByUserId/u2');
      expect(res.status).toBe(404);
    });
  });
});
