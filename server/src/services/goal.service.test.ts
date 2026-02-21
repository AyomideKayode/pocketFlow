import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGoalsWithProgress } from './goal.service.js';

// Hoist mocks
const { mockGoalFind, mockAggregate } = vi.hoisted(() => {
  return {
    mockGoalFind: vi.fn(),
    mockAggregate: vi.fn(),
  };
});

// Mock Dependencies
vi.mock('../schema/goal.js', () => ({
  default: {
    find: mockGoalFind,
  },
}));

vi.mock('../schema/financial-records.js', () => ({
  default: {
    aggregate: mockAggregate,
  },
}));

// Mock other dependencies to avoid errors
vi.mock('./email.service.js', () => ({
  emailService: {
    sendTransactionEmail: vi.fn(),
  },
}));
vi.mock('../lib/firebaseAdmin.js', () => ({
  default: {
    auth: () => ({
      getUser: vi.fn().mockResolvedValue({ email: 'test@example.com' }),
    }),
  },
}));
vi.mock('../schema/user-profile.js', () => ({
  default: {
    findOne: vi.fn().mockResolvedValue({ currency: 'USD' }),
  },
}));


describe('GoalService', () => {
  const userId = 'user123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGoalsWithProgress', () => {
    it('should calculate progress as Income - Expense', async () => {
      // 1. Mock Goal
      const mockGoal = {
        _id: 'goal1',
        userId,
        name: 'Emergency Fund',
        targetAmount: 1000,
        currentAmount: 0,
        linkedCategory: 'Savings',
        toObject: () => ({
            _id: 'goal1',
            userId,
            name: 'Emergency Fund',
            targetAmount: 1000,
            currentAmount: 0,
            linkedCategory: 'Savings',
        }),
      };
      mockGoalFind.mockResolvedValue([mockGoal]);

      // 2. Mock Aggregation Result
      mockAggregate.mockResolvedValue([
        {
          totalIncome: 500,
          totalExpense: 200,
        },
      ]);

      // Execute
      const results = await getGoalsWithProgress(userId);

      // Assert
      // Expected: 500 (Income) - 200 (Expense) = 300
      expect(results[0].currentAmount).toBe(300);
      expect(results[0].percent).toBe(30);
    });

    it('should handle negative balance correctly', async () => {
         const mockGoal = {
            _id: 'goal2',
            userId,
            name: 'Bad Goal',
            targetAmount: 1000,
            currentAmount: 0,
            linkedCategory: 'Groceries',
            toObject: () => ({
                 _id: 'goal2',
                userId,
                name: 'Bad Goal',
                targetAmount: 1000,
                currentAmount: 0,
                linkedCategory: 'Groceries',
            }),
          };
          mockGoalFind.mockResolvedValue([mockGoal]);

          mockAggregate.mockResolvedValue([
            {
              totalIncome: 0,
              totalExpense: 500,
            },
          ]);

          const results = await getGoalsWithProgress(userId);

          expect(results[0].currentAmount).toBe(-500);
    });
  });
});
