import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';

export interface Goal {
  _id?: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // Date string
  linkedCategory?: string;
  percent?: number;
}

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();
  const { addToast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    fetchGoals();
  }, [user, fetchGoals]);

  const addGoal = async (goal: Goal) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goal, userId: user.uid }),
      });
      if (!response.ok) throw new Error('Failed to add goal');
      const saved = await response.json();
      setGoals(prev => [...prev, saved]);
      addToast('Goal created successfully!', 'success');
      fetchGoals(); // Re-fetch to get calculations if needed
    } catch (error) {
      console.error('Error adding goal:', error);
      addToast('Failed to add goal.', 'error');
    }
  };

  const updateGoal = async (id: string, updated: Partial<Goal>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error('Failed to update goal');
      await response.json();
      // Re-fetch to ensure we have up-to-date calculated values if linkedCategory changed
      fetchGoals();
      addToast('Goal updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating goal:', error);
      addToast('Failed to update goal.', 'error');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(prev => prev.filter(g => g._id !== id));
      addToast('Goal deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting goal:', error);
      addToast('Failed to delete goal.', 'error');
    }
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoals must be used within GoalsProvider');
  return context;
};
