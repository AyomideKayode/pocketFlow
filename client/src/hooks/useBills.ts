import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/auth-context';
import { billService } from '../services/bill-service';
import type { Bill } from '../types/bill';
import { getBillVisualState } from '../utils/bill';
import { useToast } from '../contexts/toast-context';

export function useBills(period?: string) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const currentPeriod = useMemo(() => {
    if (period) return period;
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, [period]);

  const fetchBills = useCallback(async () => {
    if (!user) {
      setBills([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await user.getIdToken();
      const data = await billService.getBills(token, currentPeriod);

      if (Array.isArray(data)) {
        setBills(data);
      } else {
        console.error('Unexpected bill data format:', data);
        setBills([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch bills:', err);
      setError(err);
      addToast('Failed to load bills', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, currentPeriod, addToast]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const { overdue, upcoming, paid } = useMemo(() => {
    const overdueList: Bill[] = [];
    const upcomingList: Bill[] = [];
    const paidList: Bill[] = [];

    bills.forEach((bill) => {
      const state = getBillVisualState(bill, currentPeriod);
      if (state === 'overdue') overdueList.push(bill);
      else if (state === 'upcoming') upcomingList.push(bill);
      else if (state === 'paid') paidList.push(bill);
    });

    // Sort by dueDay (ascending)
    overdueList.sort((a, b) => a.dueDay - b.dueDay);
    upcomingList.sort((a, b) => a.dueDay - b.dueDay);
    paidList.sort((a, b) => a.dueDay - b.dueDay);

    return { overdue: overdueList, upcoming: upcomingList, paid: paidList };
  }, [bills, currentPeriod]);

  return {
    bills,
    overdue,
    upcoming,
    paid,
    loading,
    error,
    refreshBills: fetchBills,
    currentPeriod,
  };
}
