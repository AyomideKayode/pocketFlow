import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock dependencies
const { mockRecordImportJob, mockGetBudgetCycleAnalysis, mockGetHistoricalOverBudgetUsers } = vi.hoisted(() => {
  return {
    mockRecordImportJob: vi.fn(),
    mockGetBudgetCycleAnalysis: vi.fn(),
    mockGetHistoricalOverBudgetUsers: vi.fn(),
  };
});

vi.mock('../services/analytics.service.js', () => {
  return {
    recordImportJob: mockRecordImportJob,
    getBudgetCycleAnalysis: mockGetBudgetCycleAnalysis,
    getHistoricalOverBudgetUsers: mockGetHistoricalOverBudgetUsers,
  };
});

// Mock Cloudinary
vi.mock('../routes/cloudinary.js', () => ({
  default: (req: any, res: any, next: any) => next(),
}));

// Mock Auth
vi.mock('../lib/firebaseAdmin.js', () => {
  return {
    verifyIdToken: vi.fn().mockImplementation(async (token) => {
      if (token === 'valid_token') {
        return { uid: 'user123' };
      }
      throw new Error('Invalid token');
    }),
  };
});

import app from '../app.js';

describe('Analytics Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /analytics/import-events', () => {
    it('should record import job', async () => {
      mockRecordImportJob.mockResolvedValue({ _id: 'job1' });

      const res = await request(app)
        .post('/analytics/import-events')
        .set('Authorization', 'Bearer valid_token')
        .send({
          userId: 'user123',
          status: 'success',
          totalRows: 10,
          validCount: 10,
          invalidCount: 0,
          importErrors: [],
        });

      expect(res.status).toBe(201);
      expect(mockRecordImportJob).toHaveBeenCalledWith(expect.objectContaining({
          userId: 'user123',
          status: 'success'
      }));
    });

    it('should reject unauthorized user mismatch', async () => {
      const res = await request(app)
        .post('/analytics/import-events')
        .set('Authorization', 'Bearer valid_token') // user123
        .send({
          userId: 'other_user',
          status: 'success',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /analytics/budget-analysis/:userId', () => {
    it('should return budget analysis', async () => {
      const mockAnalysis = [{ period: '2023-01', spent: 100 }];
      mockGetBudgetCycleAnalysis.mockResolvedValue(mockAnalysis);

      const res = await request(app)
        .get('/analytics/budget-analysis/user123')
        .set('Authorization', 'Bearer valid_token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAnalysis);
      expect(mockGetBudgetCycleAnalysis).toHaveBeenCalledWith('user123');
    });

     it('should reject user mismatch', async () => {
      const res = await request(app)
        .get('/analytics/budget-analysis/other_user')
        .set('Authorization', 'Bearer valid_token');

      expect(res.status).toBe(403);
    });
  });
});
