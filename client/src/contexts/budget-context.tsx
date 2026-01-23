import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
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
  fetchBudgets: (period?: string) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetsProvider = ({ children }: { children: React.ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { user } = useAuth();
  const { addToast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchBudgets = useCallback(async (period?: string) => {
    if (!user) return;
    try {
        const query = period ? `?period=${period}` : '';
        const response = await fetch(`${API_BASE_URL}/budgets/${user.uid}${query}`);
        if (response.ok) {
            const data = await response.json();
            setBudgets(data);
        }
    } catch (error) {
        console.error('Error fetching budgets:', error);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    fetchBudgets();
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
          if (response.status === 409) throw new Error('Budget already exists for this category');
          throw new Error('Failed to add budget');
      }
      const saved = await response.json();
      // Re-fetch to get calculations if needed, or just add local.
      // Since backend calculates 'spent', we might want to fetch again or initialize spent=0
      setBudgets(prev => [...prev, { ...saved, spent: 0, remaining: saved.amount, percent: 0 }]);
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
      const saved = await response.json();
      setBudgets(prev => prev.map(b => b._id === id ? { ...b, ...saved, spent: b.spent } : b)); // Preserve client-side calc? Or rely on server response? Server response might lack 'spent' if PUT doesn't recalculate.
      // Actually, PUT /:id returns the updated document. It might NOT run the aggregation.
      // So 'spent' field might be missing in response.
      // We should preserve 'spent' from previous state or re-fetch.
      // Ideally re-fetch or merge.
      // Let's merge:
      setBudgets(prev => prev.map(b => {
          if (b._id === id) {
              return { ...b, ...saved }; // saved overrides b properties. If saved doesn't have spent, b.spent remains? No, spread overrides.
          }
          return b;
      }));
      // Wait, if 'saved' does NOT have 'spent', and I spread `{...b, ...saved}`, 'spent' from 'b' is preserved ONLY if 'saved' doesn't have it as undefined.
      // But 'saved' is the mongoose doc, it won't have 'spent' field at all.
      // So `{...b, ...saved}` works (b.spent is preserved).

      addToast('Budget updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating budget:', error);
      addToast('Failed to update budget.', 'error');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete budget');
      setBudgets(prev => prev.filter(b => b._id !== id));
      addToast('Budget deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting budget:', error);
      addToast('Failed to delete budget.', 'error');
    }
  };

  return (
    <BudgetContext.Provider value={{ budgets, fetchBudgets, addBudget, updateBudget, deleteBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudgets must be used within BudgetsProvider');
  return context;
};
