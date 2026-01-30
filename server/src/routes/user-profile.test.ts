import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// 1. Hoist mocks
const { mockFindOne, mockFindOneAndUpdate } = vi.hoisted(() => {
  return {
    mockFindOne: vi.fn(),
    mockFindOneAndUpdate: vi.fn(),
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
vi.mock('../schema/user-profile.js', () => {
  return {
    default: {
      findOne: mockFindOne,
      findOneAndUpdate: mockFindOneAndUpdate,
    },
  };
});

// 4. Import app (after mocks)
import app from '../app.js';

describe('UserProfile Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /user-profile/:userId', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/user-profile/user-123');
      expect(res.status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/user-profile/user-123')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });

    it('should return 403 if userId does not match token uid', async () => {
      const res = await request(app)
        .get('/user-profile/other-user')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(403);
    });

    it('should return 404 if profile not found', async () => {
      mockFindOne.mockResolvedValueOnce(null);
      const res = await request(app)
        .get('/user-profile/user-123')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(404);
      expect(mockFindOne).toHaveBeenCalledWith({ userId: 'user-123' });
    });

    it('should return profile if found', async () => {
      const mockProfile = { userId: 'user-123', currency: 'USD' };
      mockFindOne.mockResolvedValueOnce(mockProfile);
      const res = await request(app)
        .get('/user-profile/user-123')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProfile);
    });
  });

  describe('PUT /user-profile/:userId', () => {
    it('should create/update profile', async () => {
      const updateData = { currency: 'EUR', displayName: 'Test User' };
      mockFindOneAndUpdate.mockResolvedValueOnce({ userId: 'user-123', ...updateData });

      const res = await request(app)
        .put('/user-profile/user-123')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user-123' },
        expect.objectContaining({
            userId: 'user-123',
            currency: 'EUR',
            displayName: 'Test User'
        }),
        expect.objectContaining({ new: true, upsert: true })
      );
    });

    it('should return 403 if trying to update another user profile', async () => {
      const res = await request(app)
        .put('/user-profile/other-user')
        .set('Authorization', 'Bearer valid-token')
        .send({});
      expect(res.status).toBe(403);
    });
  });
});
