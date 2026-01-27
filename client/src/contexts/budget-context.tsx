import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';

export interface Budget {
  _id?: string;
  userId: string;
  category: string;
  amount: number;
  period: string;
  spent?: number;
  remaining?: number;
  percent?: number;
}

interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  fetchBudgets: (period?: string, showLoading?: boolean) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchBudgets = useCallback(
    async (period?: string, showLoading = false) => {
      if (!user) return;
      if (showLoading) setLoading(true);
      try {
        const query = period ? `?period=${period}` : '';
        const response = await fetch(
          `${API_BASE_URL}/budgets/${user.uid}${query}`,
        );
        if (response.ok) {
          const data = await response.json();
          setBudgets(data);
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [user, API_BASE_URL],
  );

  useEffect(() => {
    fetchBudgets(undefined, true);
  }, [user, fetchBudgets]);

  const addBudget = async (budget: Budget) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...budget, userId: user.uid }),
      });
      if (!response.ok) {
        if (response.status === 409)
          throw new Error('Budget already exists for this category');
        throw new Error('Failed to add budget');
      }
      // Re-fetch budget after creation to get accurate 'spent' value
      // Since backend calculates 'spent', we re-fetch immediately or initially set spent to 0
      await fetchBudgets();
      addToast('Budget created successfully!', 'success');
    } catch (err: unknown) {
      console.error('Error adding budget:', err);
      const error = err as { message?: string };
      addToast(error.message || 'Failed to add budget.', 'error');
    }
  };

  const updateBudget = async (id: string, updated: Partial<Budget>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      await fetchBudgets(); // Re-fetch budgets to get updated 'spent' value
      addToast('Budget updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating budget:', error);
      addToast('Failed to update budget.', 'error');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget');
      setBudgets((prev) => prev.filter((b) => b._id !== id));
      addToast('Budget deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting budget:', error);
      addToast('Failed to delete budget.', 'error');
    }
  };

  return (
    <BudgetContext.Provider
      value={{ budgets, loading, fetchBudgets, addBudget, updateBudget, deleteBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context)
    throw new Error('useBudgets must be used within BudgetsProvider');
  return context;
};
