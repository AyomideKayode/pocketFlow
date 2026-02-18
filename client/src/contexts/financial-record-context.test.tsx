import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinancialRecordsProvider, useFinancialRecords } from './financial-record-context';

// Mock dependencies
const mockUser = { uid: 'user-123', email: 'test@example.com' };
vi.mock('../contexts/auth-context', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

const mockTrackEvent = vi.fn();
vi.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: mockTrackEvent,
  }),
}));

vi.mock('./toast-context', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

vi.mock('./budget-context', () => ({
  useBudgets: () => ({
    fetchBudgets: vi.fn(),
  }),
}));

vi.mock('./user-profile-context', () => ({
  useUserProfile: () => ({
    profile: { hasCreatedFirstTransaction: false },
    updateProfile: vi.fn().mockResolvedValue(undefined),
  }),
}));

global.fetch = vi.fn();

import { useEffect } from 'react';

const TestComponent = () => {
  const { records, addRecord, deleteRecord, fetchRecords, loading } = useFinancialRecords();

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      <ul>
        {records.map(r => <li key={r._id}>{r.description}</li>)}
      </ul>
      <button onClick={() => addRecord({ description: 'New Record', amount: 100 } as any)}>Add</button>
      <button onClick={() => deleteRecord('rec-1')}>Delete</button>
    </div>
  );
};

describe('FinancialRecordContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch records on mount', async () => {
    const mockRecords = [{ _id: 'rec-1', description: 'Test Record', amount: 100 }];
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecords, // For fetchRecords (all)
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecords, // For refreshRecent
    });

    render(
      <FinancialRecordsProvider>
        <TestComponent />
      </FinancialRecordsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Record')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/financial-records/getAllByUserId/user-123'), expect.anything());
  });

  it('should add new record via API', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // mount 1
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // mount 2
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: 'new-rec', description: 'New Record' }) }) // POST response
      .mockResolvedValueOnce({ ok: true, json: async () => [{ _id: 'new-rec', description: 'New Record' }] }) // refresh fetchRecords
      .mockResolvedValueOnce({ ok: true, json: async () => [{ _id: 'new-rec', description: 'New Record' }] }); // refreshRecent

    render(
      <FinancialRecordsProvider>
        <TestComponent />
      </FinancialRecordsProvider>
    );

    const addBtn = screen.getByText('Add');
    await act(async () => {
      addBtn.click();
    });

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/financial-records'),
            expect.objectContaining({ method: 'POST' })
        );
    });
  });

  it('should delete record via API', async () => {
    const initialRecords = [{ _id: 'rec-1', description: 'Test Record' }];
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => initialRecords }) // mount 1
      .mockResolvedValueOnce({ ok: true, json: async () => initialRecords }) // mount 2
      .mockResolvedValueOnce({ ok: true }) // DELETE response
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // refresh fetchRecords (empty)
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // refreshRecent (empty)

    render(
      <FinancialRecordsProvider>
        <TestComponent />
      </FinancialRecordsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Record')).toBeInTheDocument();
    });

    const delBtn = screen.getByText('Delete');
    await act(async () => {
      delBtn.click();
    });

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/financial-records/rec-1'),
            expect.objectContaining({ method: 'DELETE' })
        );
    });
  });
});
