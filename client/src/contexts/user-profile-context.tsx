import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';

export interface UserProfile {
  userId: string;
  currency: string;
  displayName?: string;
  photoURL?: string;
  theme?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  currency: string;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        // Profile doesn't exist yet, we can treat it as default
        setProfile({
            userId: user.uid,
            currency: 'USD',
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
        });
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      addToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast('Failed to update profile', 'error');
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
