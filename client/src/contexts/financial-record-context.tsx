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
import { useBudgets } from './budget-context';
import { useUserProfile } from './user-profile-context';
import { useAnalytics } from '../hooks/useAnalytics';

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
}

export interface FilterState {
  category?: string;
  type?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface FinancialRecordContextType {
  records: FinancialRecord[]; // Filtered/Paginated list
  recentRecords: FinancialRecord[]; // Recent 5 for dashboard
  loading: boolean;
  pagination: PaginationState;
  addRecord: (record: FinancialRecord) => Promise<void>;
  addBulkRecords: (records: FinancialRecord[]) => Promise<void>;
  updateRecord: (
    id: string,
    updatedRecord: Partial<FinancialRecord>,
  ) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  fetchRecords: (filters?: FilterState) => Promise<void>;
  refreshRecent: () => Promise<void>;
}

const FinancialRecordContext = createContext<
  FinancialRecordContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [recentRecords, setRecentRecords] = useState<FinancialRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const { fetchBudgets } = useBudgets();
  const { profile, updateProfile } = useUserProfile();
  const { trackEvent } = useAnalytics();

  // Track last used filters to enable re-fetching after mutations
  const lastFiltersRef = useRef<FilterState | null>(null);
  // AbortController to handle race conditions in fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Migration helper for legacy records without type field
  const migrateRecord = (record: any): FinancialRecord => {
    if (
      record.type &&
      (record.type === 'income' || record.type === 'expense')
    ) {
      return record; // Already has valid type field
    }

    // Legacy record: determine type based on amount and set positive amount
    const isIncome = record.amount > 0;
    return {
      ...record,
      userId: record.userId || '',
      date: record.date || new Date(),
      description: record.description || '',
      category: record.category || '',
      paymentMethod: record.paymentMethod || '',
      type: isIncome ? 'income' : 'expense',
      amount: Math.abs(record.amount), // Convert to positive
    };
  };

  // Fetch with support for filters/pagination
  const fetchRecords = useCallback(
    async (filters: FilterState = {}) => {
      if (!user) return;

      // Update last used filters
      lastFiltersRef.current = filters;

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.paymentMethod)
        params.append('paymentMethod', filters.paymentMethod);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      try {
        const response = await fetch(
          `${API_BASE_URL}/financial-records/getAllByUserId/${user.uid}?${params.toString()}`,
          { signal: controller.signal },
        );

        if (response.ok) {
          const result = await response.json();
          // Check if result is array (legacy) or object (paginated)
          let fetchedRecords = [];

          if (Array.isArray(result)) {
            fetchedRecords = result;
            setPagination({
              total: result.length,
              page: 1,
              limit: 0,
              pages: 1,
            });
          } else {
            fetchedRecords = result.data;
            setPagination(result.pagination);
          }

          const migrated = fetchedRecords.map(migrateRecord);
          setRecords(migrated);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Ignore abort errors
          return;
        }
        console.error('Error fetching records:', error);
      } finally {
        // Only turn off loading if this is the active request
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [user, API_BASE_URL],
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch specifically for Dashboard (recent 5)
  const refreshRecent = useCallback(async () => {
    if (!user) return;
    // Don't set main loading state to avoid flickering whole app
    try {
      const params = new URLSearchParams({
        limit: '5',
        sortBy: 'date',
        sortOrder: 'desc',
      });
      const response = await fetch(
        `${API_BASE_URL}/financial-records/getAllByUserId/${user.uid}?${params.toString()}`,
      );

      if (response.ok) {
        const result = await response.json();
        // Should be object format since limit is passed
        const data = Array.isArray(result) ? result : result.data;
        const migrated = data.map(migrateRecord);
        setRecentRecords(migrated);
      }
    } catch (error) {
      console.error('Error fetching recent records:', error);
    }
  }, [user, API_BASE_URL]);

  // Initial load: Fetch recent for dashboard
  useEffect(() => {
    if (user) {
      refreshRecent();
    }
  }, [user, refreshRecent]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      if (!response.ok) {
        throw new Error('Failed to add record');
      }
      // Refresh lists to ensure consistency
      await Promise.all([
        // Refresh main list if we have active filters (Transactions page)
        lastFiltersRef.current
          ? fetchRecords(lastFiltersRef.current)
          : Promise.resolve(),
        refreshRecent(),
        fetchBudgets(),
      ]);

      addToast('Financial record added successfully!', 'success');

      if (profile && !profile.hasCreatedFirstTransaction) {
        trackEvent('first_transaction_created');
        void updateProfile({ hasCreatedFirstTransaction: true }, true).catch(
          (err) => {
            console.error('Failed to persist first-transaction flag', err);
          },
        );
      }
    } catch (error) {
      console.error('Error adding record:', error);
      addToast('Failed to add financial record. Please try again.', 'error');
    }
  };

  const addBulkRecords = async (newRecords: FinancialRecord[]) => {
    if (!user) {
      addToast('No authenticated user', 'error');
      throw new Error('No authenticated user');
    }
    try {
      const response = await fetch(`${API_BASE_URL}/financial-records/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          records: newRecords,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to import records');
      }

      await Promise.all([
        lastFiltersRef.current
          ? fetchRecords(lastFiltersRef.current)
          : Promise.resolve(),
        refreshRecent(),
        fetchBudgets(),
      ]);

      const savedRecords = await response.json();
      addToast(
        `${savedRecords.length} records imported successfully!`,
        'success',
      );

      if (profile && !profile.hasCreatedFirstTransaction) {
        trackEvent('first_transaction_created');
        void updateProfile({ hasCreatedFirstTransaction: true }, true).catch(
          (err) => {
            console.error('Failed to persist first-transaction flag', err);
          },
        );
      }
    } catch (error) {
      console.error('Error importing records:', error);
      addToast('Failed to import records. Please try again.', 'error');
      throw error;
    }
  };

  const updateRecord = async (
    id: string,
    updatedRecord: Partial<FinancialRecord>,
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-records/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });
      if (!response.ok) {
        throw new Error('Failed to update record');
      }
      const updated = await response.json();

      // Optimistic/Local update is safe for updates (ID match)
      setRecords((prevRecords) =>
        prevRecords.map((record) => (record._id === id ? updated : record)),
      );
      setRecentRecords((prevRecords) =>
        prevRecords.map((record) => (record._id === id ? updated : record)),
      );

      // Also refresh budget as categories/amounts might change
      await fetchBudgets();
      addToast('Financial record updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating record:', error);
      addToast('Failed to update financial record. Please try again.', 'error');
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-records/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      // Refetch logic similar to addRecord to ensure pagination is correct
      // (Optimistic delete might leave a short page)
      await Promise.all([
        lastFiltersRef.current
          ? fetchRecords(lastFiltersRef.current)
          : Promise.resolve(),
        refreshRecent(),
        fetchBudgets(),
      ]);

      addToast('Financial record deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting record:', error);
      addToast('Failed to delete financial record. Please try again.', 'error');
    }
  };

  return (
    <FinancialRecordContext.Provider
      value={{
        records,
        recentRecords,
        loading,
        pagination,
        addRecord,
        addBulkRecords,
        updateRecord,
        deleteRecord,
        fetchRecords,
        refreshRecent,
      }}
    >
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordContextType | undefined>(
    FinancialRecordContext,
  );

  if (!context) {
    throw new Error(
      'useFinancialRecords must be used within a FinancialRecordsProvider',
    );
  }
  return context;
};
