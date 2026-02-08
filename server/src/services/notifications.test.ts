import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoist mocks
const {
  mockBudgetFind,
  mockBudgetFindByIdAndUpdate,
  mockFinancialRecordAggregate,
  mockGoalFindById,
  mockGoalFindByIdAndUpdate,
  mockUserProfileFindOne,
  mockUserProfileFind,
  mockUserProfileFindByIdAndUpdate,
  mockSendTransactionEmail,
  mockGetUser,
} = vi.hoisted(() => ({
  mockBudgetFind: vi.fn(),
  mockBudgetFindByIdAndUpdate: vi.fn(),
  mockFinancialRecordAggregate: vi.fn(),
  mockGoalFindById: vi.fn(),
  mockGoalFindByIdAndUpdate: vi.fn(),
  mockUserProfileFindOne: vi.fn(),
  mockUserProfileFind: vi.fn(),
  mockUserProfileFindByIdAndUpdate: vi.fn(),
  mockSendTransactionEmail: vi.fn(),
  mockGetUser: vi.fn(),
}));

// Mock Modules
vi.mock('../schema/budget.js', () => ({
  default: {
    find: mockBudgetFind,
    findByIdAndUpdate: mockBudgetFindByIdAndUpdate,
  },
}));

vi.mock('../schema/financial-records.js', () => ({
  default: {
    aggregate: mockFinancialRecordAggregate,
  },
}));

vi.mock('../schema/goal.js', () => ({
  default: {
    findById: mockGoalFindById,
    findByIdAndUpdate: mockGoalFindByIdAndUpdate,
    find: vi.fn(),
  },
}));

vi.mock('../schema/user-profile.js', () => ({
  default: {
    findOne: mockUserProfileFindOne,
    find: mockUserProfileFind,
    findByIdAndUpdate: mockUserProfileFindByIdAndUpdate,
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
      getUser: mockGetUser,
    }),
  },
}));

// Import Services (after mocks)
import { checkAndNotifyBudgetExceeded } from './budget.service.js';
import { checkAndNotifyGoalAchieved } from './goal.service.js';
import { processWeeklySummaries } from './summary.service.js';

describe('Notification Services', () => {
  const userId = 'user123';
  const category = 'Food';
  // Use a fixed date that corresponds to "current period" in the test
  const date = new Date('2025-02-17T10:00:00Z');
  const period = '2025-02';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(date);

    // Default mocks
    mockGetUser.mockResolvedValue({ email: 'test@example.com', displayName: 'Tester' });
    mockUserProfileFindOne.mockResolvedValue({ currency: 'USD' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Budget Notifications', () => {
    it('should send email when budget exceeded (100%) and not notified yet', async () => {
      // Mock Budgets
      mockBudgetFind.mockResolvedValue([
        {
          _id: 'b1',
          userId,
          category,
          amount: 100,
          period,
          notified: false,
          toObject: () => ({ _id: 'b1', userId, category, amount: 100, period, notified: false }),
        },
      ]);

      // Mock Expenses (Total 110)
      mockFinancialRecordAggregate.mockResolvedValue([
        { _id: 'Food', totalSpent: 110 },
      ]);

      await checkAndNotifyBudgetExceeded(userId, category, date);

      expect(mockBudgetFindByIdAndUpdate).toHaveBeenCalledWith('b1', { notified: true });
      expect(mockSendTransactionEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
        'budget-alert',
        expect.anything(),
        'alerts'
      );
    });

    it('should NOT send email if already notified', async () => {
      mockBudgetFind.mockResolvedValue([
        {
          _id: 'b1',
          userId,
          category,
          amount: 100,
          period,
          notified: true,
          toObject: () => ({ _id: 'b1', userId, category, amount: 100, period, notified: true }),
        },
      ]);

      mockFinancialRecordAggregate.mockResolvedValue([
        { _id: 'Food', totalSpent: 110 },
      ]);

      await checkAndNotifyBudgetExceeded(userId, category, date);

      expect(mockBudgetFindByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockSendTransactionEmail).not.toHaveBeenCalled();
    });

    it('should reset notified flag if spending drops below limit', async () => {
      mockBudgetFind.mockResolvedValue([
        {
          _id: 'b1',
          userId,
          category,
          amount: 100,
          period,
          notified: true,
          toObject: () => ({ _id: 'b1', userId, category, amount: 100, period, notified: true }),
        },
      ]);

      mockFinancialRecordAggregate.mockResolvedValue([
        { _id: 'Food', totalSpent: 90 }, // Below limit
      ]);

      await checkAndNotifyBudgetExceeded(userId, category, date);

      expect(mockBudgetFindByIdAndUpdate).toHaveBeenCalledWith('b1', { notified: false });
      expect(mockSendTransactionEmail).not.toHaveBeenCalled();
    });
  });

  describe('Goal Notifications', () => {
    const goalId = 'g1';

    it('should notify when goal achieved', async () => {
      mockGoalFindById.mockResolvedValue({
        _id: goalId,
        userId,
        name: 'New Car',
        targetAmount: 1000,
        currentAmount: 0,
        linkedCategory: 'Savings',
        achievedNotified: false,
        toObject: () => ({ _id: goalId, userId, name: 'New Car', targetAmount: 1000, currentAmount: 0, linkedCategory: 'Savings', achievedNotified: false }),
      });

      // Linked Category Aggregate result
      mockFinancialRecordAggregate.mockResolvedValue([
        { _id: null, totalSaved: 1200 },
      ]);

      await checkAndNotifyGoalAchieved(userId, goalId);

      expect(mockGoalFindByIdAndUpdate).toHaveBeenCalledWith(goalId, { achievedNotified: true });
      expect(mockSendTransactionEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
        'goal-achieved',
        expect.anything(),
        'achievements'
      );
    });

    it('should reset when goal no longer achieved', async () => {
      mockGoalFindById.mockResolvedValue({
        _id: goalId,
        userId,
        name: 'New Car',
        targetAmount: 1000,
        currentAmount: 0,
        linkedCategory: 'Savings',
        achievedNotified: true,
        toObject: () => ({ _id: goalId, userId, name: 'New Car', targetAmount: 1000, currentAmount: 0, linkedCategory: 'Savings', achievedNotified: true }),
      });

      // Linked Category Aggregate result
      mockFinancialRecordAggregate.mockResolvedValue([
        { _id: null, totalSaved: 800 },
      ]);

      await checkAndNotifyGoalAchieved(userId, goalId);

      expect(mockGoalFindByIdAndUpdate).toHaveBeenCalledWith(goalId, { achievedNotified: false });
      expect(mockSendTransactionEmail).not.toHaveBeenCalled();
    });
  });

  describe('Weekly Summary', () => {
    it('should process summaries for eligible users', async () => {
      // Mock Users
      mockUserProfileFind.mockResolvedValue([
        { _id: 'p1', userId: 'user1', currency: 'USD' },
      ]);

      // Mock Financial Records for Summary
      // 1. Total Stats
      // 2. Top Category
      mockFinancialRecordAggregate
        .mockResolvedValueOnce([{ totalIncome: 500, totalExpense: 200 }]) // Stats
        .mockResolvedValueOnce([{ _id: 'Food', total: 100 }]); // Top Category

      mockSendTransactionEmail.mockResolvedValue(true);

      await processWeeklySummaries();

      expect(mockSendTransactionEmail).toHaveBeenCalledTimes(1);
      expect(mockSendTransactionEmail).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user1' }),
        'weekly-summary',
        expect.objectContaining({
            net: '$300.00',
            topCategory: expect.objectContaining({ name: 'Food' })
        }),
        'summaries'
      );
      expect(mockUserProfileFindByIdAndUpdate).toHaveBeenCalled();
    });
  });
});
