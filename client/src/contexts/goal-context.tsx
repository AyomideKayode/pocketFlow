import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';
import { useAnalytics } from '../hooks/useAnalytics';
import { useUserProfile } from './user-profile-context';

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
  loading: boolean;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const { trackEvent } = useAnalytics();
  const { profile, updateProfile } = useUserProfile();

  // Track previous state to detect changes/completions
  const goalStateRef = useRef<
    Map<string, { percent: number; currentAmount: number }>
  >(new Map());

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchGoals = useCallback(
    async (showLoading = false) => {
      if (!user) return;
      if (showLoading) setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/goals/${user.uid}`);
        if (response.ok) {
          const data: Goal[] = await response.json();
          setGoals(data);

          // Check for progress updates and completions
          data.forEach((goal) => {
            if (!goal._id) return;

            // Calculate percent if not provided by backend (though it usually is or we can derive it)
            // Backend schema/service usually provides it. If not, calc locally.
            // Looking at types, percent is optional.
            const percent =
              goal.percent ??
              (goal.targetAmount > 0
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0);

            const previousState = goalStateRef.current.get(goal._id);

            if (previousState) {
              // Check for completion transition
              if (previousState.percent < 100 && percent >= 100) {
                trackEvent('goal_completed', {
                  goal_id: goal._id,
                  name: goal.name,
                  target_amount: goal.targetAmount,
                });
              }

              // Check for progress update
              // "meaningful progress delta" - let's say any change in amount
              if (previousState.currentAmount !== goal.currentAmount) {
                const delta = goal.currentAmount - previousState.currentAmount;
                // Only fire if significant? or just any change?
                // Let's fire on any amount change.
                trackEvent('goal_progress_updated', {
                  goal_id: goal._id,
                  name: goal.name,
                  delta,
                  new_amount: goal.currentAmount,
                  new_percent: percent,
                });
              }
            }

            // Update ref
            goalStateRef.current.set(goal._id, {
              percent,
              currentAmount: goal.currentAmount,
            });
          });
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [user, API_BASE_URL, trackEvent],
  );

  useEffect(() => {
    fetchGoals(true);
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
      setGoals((prev) => [...prev, saved]);
      addToast('Goal created successfully!', 'success');

      // Analytics: First goal
      if (profile && !profile.hasCreatedFirstGoal) {
        trackEvent('first_goal_created');
        // add .catch() to avoid unhandled promise if updateProfile fails
        void updateProfile({ hasCreatedFirstGoal: true }, true).catch((err) => {
          console.error('Failed to persist first-goal flag', err);
        });
      }

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
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals((prev) => prev.filter((g) => g._id !== id));
      goalStateRef.current.delete(id); // Cleanup ref
      addToast('Goal deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting goal:', error);
      addToast('Failed to delete goal.', 'error');
    }
  };

  return (
    <GoalContext.Provider
      value={{ goals, loading, addGoal, updateGoal, deleteGoal }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoals must be used within GoalsProvider');
  return context;
};
