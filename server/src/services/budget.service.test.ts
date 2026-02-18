import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkAndNotifyBudgetExceeded } from './budget.service.js';

// Hoist mocks
const { mockBudgetFind, mockBudgetFindByIdAndUpdate } = vi.hoisted(() => {
  return {
    mockBudgetFind: vi.fn(),
    mockBudgetFindByIdAndUpdate: vi.fn(),
  };
});

const { mockRecordAggregate } = vi.hoisted(() => {
  return {
    mockRecordAggregate: vi.fn(),
  };
});

const { mockUserProfileFindOne } = vi.hoisted(() => {
  return {
    mockUserProfileFindOne: vi.fn(),
  };
});

const { mockSendTransactionEmail } = vi.hoisted(() => {
  return {
    mockSendTransactionEmail: vi.fn(),
  };
});

const { mockAdminAuthGetUser } = vi.hoisted(() => {
  return {
    mockAdminAuthGetUser: vi.fn(),
  };
});

// Mock Dependencies
vi.mock('../schema/budget.js', () => ({
  default: {
    find: mockBudgetFind,
    findByIdAndUpdate: mockBudgetFindByIdAndUpdate,
  },
}));

vi.mock('../schema/financial-records.js', () => ({
  default: {
    aggregate: mockRecordAggregate,
  },
}));

vi.mock('../schema/user-profile.js', () => ({
  default: {
    findOne: mockUserProfileFindOne,
  },
}));

vi.mock('./email.service.js', () => ({
  emailService: {
    sendTransactionEmail: mockSendTransactionEmail,
  },
}));

vi.mock('../lib/firebaseAdmin.js', () => ({
  default: {
    auth: () => ({
      getUser: mockAdminAuthGetUser,
    }),
  },
}));

describe('BudgetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkAndNotifyBudgetExceeded', () => {
    const userId = 'user123';
    const category = 'Food';
    const date = new Date();
    const period = date.toISOString().slice(0, 7);

    it('should set notified flag when spending exceeds 100%', async () => {
      // 1. Mock Budgets
      mockBudgetFind.mockResolvedValue([
        {
          _id: 'budget1',
          category,
          amount: 100,
          notified: false,
          toObject: () => ({ _id: 'budget1', category, amount: 100, notified: false }),
        },
      ]);

      // 2. Mock Spending (Aggregate)
      mockRecordAggregate.mockResolvedValue([
        { _id: category, totalSpent: 110 },
      ]);

      // 3. Mock User Profile & Firebase
      mockAdminAuthGetUser.mockResolvedValue({ email: 'test@example.com', displayName: 'Test' });
      mockUserProfileFindOne.mockResolvedValue({ currency: 'USD' });

      await checkAndNotifyBudgetExceeded(userId, category, date);

      // Verify notified set to true
      expect(mockBudgetFindByIdAndUpdate).toHaveBeenCalledWith('budget1', { notified: true });

      // Verify email sent
      expect(mockSendTransactionEmail).toHaveBeenCalled();
    });

    it('should not trigger duplicate notifications', async () => {
      // Budget already notified
      mockBudgetFind.mockResolvedValue([
        {
          _id: 'budget1',
          category,
          amount: 100,
          notified: true,
          toObject: () => ({ _id: 'budget1', category, amount: 100, notified: true }),
        },
      ]);

      mockRecordAggregate.mockResolvedValue([
        { _id: category, totalSpent: 110 },
      ]);

      await checkAndNotifyBudgetExceeded(userId, category, date);

      // Should NOT update
      expect(mockBudgetFindByIdAndUpdate).not.toHaveBeenCalled();
      // Should NOT send email
      expect(mockSendTransactionEmail).not.toHaveBeenCalled();
    });

    it('should reset notification when spending drops below limit', async () => {
      // Budget notified, but spending dropped (e.g. transaction deleted/edited)
      mockBudgetFind.mockResolvedValue([
        {
          _id: 'budget1',
          category,
          amount: 100,
          notified: true,
          toObject: () => ({ _id: 'budget1', category, amount: 100, notified: true }),
        },
      ]);

      mockRecordAggregate.mockResolvedValue([
        { _id: category, totalSpent: 90 },
      ]);

      await checkAndNotifyBudgetExceeded(userId, category, date);

      // Should reset to false
      expect(mockBudgetFindByIdAndUpdate).toHaveBeenCalledWith('budget1', { notified: false });
    });
  });
});
