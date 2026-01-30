import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';
import { useBudgets } from './budget-context';

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

interface FinancialRecordContextType {
  records: FinancialRecord[];
  loading: boolean;
  addRecord: (record: FinancialRecord) => Promise<void>;
  addBulkRecords: (records: FinancialRecord[]) => Promise<void>;
  updateRecord: (
    id: string,
    updatedRecord: Partial<FinancialRecord>,
  ) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

const FinancialRecordContext = createContext<
  FinancialRecordContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = React.useState<FinancialRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const { fetchBudgets } = useBudgets();

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

  const fetchRecordsByUserId = useCallback(
    async (showLoading = false) => {
      if (!user) return;

      if (showLoading) setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/financial-records/getAllByUserId/${user.uid}`,
        );

        if (response.ok) {
          const rawRecords = await response.json();
          // Migrate legacy records and ensure type field exists
          const migratedRecords = rawRecords.map(migrateRecord);
          setRecords(migratedRecords);
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [user, API_BASE_URL],
  );

  useEffect(() => {
    fetchRecordsByUserId(true);
  }, [user, fetchRecordsByUserId]);

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
      const savedRecord = await response.json();
      setRecords((prevRecords) => [...prevRecords, savedRecord]);

      await fetchBudgets();
      addToast('Financial record added successfully!', 'success');
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

      const savedRecords = await response.json();
      setRecords((prevRecords) => [...prevRecords, ...savedRecords]);

      await fetchBudgets();
      addToast(`${savedRecords.length} records imported successfully!`, 'success');
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
      setRecords((prevRecords) =>
        prevRecords.map((record) => (record._id === id ? updated : record)),
      );

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
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== id),
      );

      await fetchBudgets();
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
        loading,
        addRecord,
        addBulkRecords,
        updateRecord,
        deleteRecord,
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
