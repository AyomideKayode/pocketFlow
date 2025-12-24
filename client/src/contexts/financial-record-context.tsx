import React, { createContext, useContext } from 'react';

interface FinancialRecord {
  id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => Promise<void>;
  // updateRecord: (id: string, updatedRecord: Partial<FinancialRecord>) => Promise<void>;
  // deleteRecord: (id: string) => Promise<void>;
  // fetchRecordsByUserId: (userId: string) => Promise<void>;
}

const FinancialRecordContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordsProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = React.useState<FinancialRecord[]>([]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch('http://localhost:3001/financial-records', {
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
    } catch (error) {
      console.error('Error adding record:', error);
    }
  }

  return (
    <FinancialRecordContext.Provider value={{ records, addRecord }}>
      {children}
    </FinancialRecordContext.Provider>
  )
}

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordContextType | undefined>(FinancialRecordContext);
  if (!context) {
    throw new Error('useFinancialRecords must be used within a FinancialRecordsProvider');
  }
  return context;
}
