import type { Bill } from '../types/bill';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const billService = {
  getBills: async (token: string, period?: string): Promise<Bill[]> => {
    const url = new URL(`${API_BASE_URL}/bills`);
    if (period) {
      url.searchParams.append('period', period);
    }
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch bills');
    }
    return response.json();
  },

  createBill: async (token: string, bill: Partial<Bill>): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bill),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create bill');
    }
    return response.json();
  },

  updateBill: async (
    token: string,
    id: string,
    updates: Omit<Partial<Bill>, 'lastPaidPeriod'>,
  ): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update bill');
    }
    return response.json();
  },

  markBillPaid: async (token: string, id: string): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}/pay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to mark bill as paid');
    }
    return response.json();
  },

  markBillUnpaid: async (token: string, id: string): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}/unpay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      // Handle 409 Conflict: Cannot unpay past periods
      if (response.status === 409) {
        throw new Error(
          error.message ||
            'Cannot unpay bill from a past period. Unpaying is only allowed for the current period.'
        );
      }
      
      throw new Error(error.message || 'Failed to mark bill as unpaid');
    }
    return response.json();
  },

  deleteBill: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete bill');
    }
  },
};
