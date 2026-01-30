import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';
import { useCallback } from 'react';

type AnalyticsEvent =
  // CSV import / export
  | 'csv_import_started'
  | 'csv_import_validated'
  | 'csv_import_failed'
  | 'csv_import_completed'
  | 'csv_export_completed'
  | 'transactions_bulk_created'

  // Budgets
  | 'budget_reset'
  | 'budget_threshold_crossed'
  | 'budget_back_under_limit'

  // Goals
  | 'goal_progress_updated'
  | 'goal_completed'

  // Adoption milestones (fire once per user)
  | 'first_transaction_created'
  | 'first_budget_created'
  | 'first_goal_created';

export const useAnalytics = () => {
  const trackEvent = useCallback(
    (eventName: AnalyticsEvent, params?: Record<string, any>) => {
      if (analytics) {
        logEvent(analytics, eventName, params);
        // Optional: Log to console in development
        if (import.meta.env.DEV) {
          console.log(`[Analytics] ${eventName}`, params);
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Firebase Analytics not initialized');
        }
      }
    },
    [],
  );

  return { trackEvent };
};
