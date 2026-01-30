import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';
import { getIdToken } from '../lib/firebase';
import { useAnalytics } from '../hooks/useAnalytics';

export interface UserProfile {
  userId: string;
  currency: string;
  displayName?: string;
  photoURL?: string;
  theme?: string;
  lastTrackedMonth?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  currency: string;
  loading: boolean;
  updateProfile: (
    data: Partial<UserProfile>,
    silent?: boolean,
  ) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { trackEvent } = useAnalytics();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Request tracking to prevent race conditions
  const requestIdRef = useRef(0);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const currentRequestId = ++requestIdRef.current;

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${API_BASE_URL}/user-profile/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Only update state if this is still the latest request
      if (currentRequestId === requestIdRef.current) {
        if (response.ok) {
          const data = await response.json();
          setProfile(data);

          // Check for budget reset (new month)
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(
            now.getMonth() + 1,
          ).padStart(2, '0')}`;
          if (data.lastTrackedMonth && data.lastTrackedMonth !== currentMonth) {
            trackEvent('budget_reset', {
              previous_month: data.lastTrackedMonth,
              new_month: currentMonth,
            });
            // Update silently
            updateProfile({ lastTrackedMonth: currentMonth }, true).catch(
              (err) => console.error('Failed to update last tracked month', err),
            );
          } else if (!data.lastTrackedMonth) {
            // Initialize if missing
            updateProfile({ lastTrackedMonth: currentMonth }, true).catch(
              (err) => console.error('Failed to init last tracked month', err),
            );
          }
        } else if (response.status === 404) {
          // Profile doesn't exist yet, treat as default
          setProfile({
            userId: user.uid,
            currency: 'USD',
            displayName: user.displayName ?? undefined,
            photoURL: user.photoURL ?? undefined,
          });
        } else {
          console.error('Failed to fetch user profile');
        }
      }
    } catch (error) {
      if (currentRequestId === requestIdRef.current) {
        console.error('Error fetching user profile:', error);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (
    data: Partial<UserProfile>,
    silent: boolean = false,
  ) => {
    if (!user) return;

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${API_BASE_URL}/user-profile/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      if (!silent) {
        addToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (!silent) {
        addToast('Failed to update profile', 'error');
      }
      throw error;
    }
  };

  const value = {
    profile,
    currency: profile?.currency || 'USD',
    loading,
    updateProfile,
    refreshProfile: fetchProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
