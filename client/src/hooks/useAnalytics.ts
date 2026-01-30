import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';
import { useCallback } from 'react';

type AnalyticsEvent =
  | 'csv_import_started'
  | 'csv_import_validated'
  | 'csv_import_failed'
  | 'csv_import_completed'
  | 'budget_reset'
  | 'budget_threshold_crossed'
  | 'goal_progress_updated'
  | 'goal_completed';

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
