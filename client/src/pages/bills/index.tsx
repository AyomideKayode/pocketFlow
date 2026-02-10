import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { billService } from '../../services/bill-service';
import type { Bill } from '../../types/bill';
import { BillForm } from './BillForm';
import {
  Loader2,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { useToast } from '../../contexts/toast-context';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

export const Bills: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Use local time for current period
  const currentPeriod = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const fetchBills = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      // Pass currentPeriod to service if needed, but service defaults to backend current time.
      // Frontend filtering relies on local currentPeriod, so we just fetch all relevant bills.
      // The backend filters out old one-time bills.
      const data = await billService.getBills(token, currentPeriod);
      setBills(data);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
      addToast('Failed to load bills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [user, currentPeriod]);

  const handleSave = async (billData: Partial<Bill>) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      if (editingBill) {
        await billService.updateBill(token, editingBill._id!, billData);
        addToast('Bill updated successfully', 'success');
      } else {
        await billService.createBill(token, billData);
        addToast('Bill created successfully', 'success');
      }
      setIsAdding(false);
      setEditingBill(null);
      fetchBills();
    } catch (error) {
      console.error('Error saving bill:', error);
      addToast('Failed to save bill', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this bill?')) return;
    try {
      const token = await user.getIdToken();
      await billService.deleteBill(token, id);
      addToast('Bill deleted successfully', 'success');
      fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
      addToast('Failed to delete bill', 'error');
    }
  };

  const handleMarkPaid = async (bill: Bill) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await billService.updateBill(token, bill._id!, {
        lastPaidPeriod: currentPeriod,
      });
      addToast('Marked as paid', 'success');
      fetchBills();
    } catch (error) {
      console.error('Error marking bill paid:', error);
      addToast('Failed to mark as paid', 'error');
    }
  };

  const handleMarkUnpaid = async (bill: Bill) => {
    // Optional: Undo paid status
    if (!user) return;
    try {
      const token = await user.getIdToken();
      // Clear lastPaidPeriod to mark bill as unpaid for current period
      // This works for both recurring and one-time bills
      await billService.updateBill(token, bill._id!, {
        lastPaidPeriod: null,
      });
      addToast('Marked as unpaid', 'success');
      fetchBills();
    } catch (error) {
      console.error('Error marking bill unpaid:', error);
      addToast('Failed to mark as unpaid', 'error');
    }
  };

  const { upcoming, paid } = useMemo(() => {
    const upcoming: Bill[] = [];
    const paid: Bill[] = [];

    bills.forEach((bill) => {
      const isPaid = bill.lastPaidPeriod === currentPeriod;
      if (isPaid) {
        paid.push(bill);
      } else {
        upcoming.push(bill);
      }
    });

    // Sort by due day
    upcoming.sort((a, b) => a.dueDay - b.dueDay);
    paid.sort((a, b) => a.dueDay - b.dueDay);

    return { upcoming, paid };
  }, [bills, currentPeriod]);

  const getDueDateDisplay = (dueDay: number) => {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const day = Math.min(dueDay, daysInMonth);
    // Format: "Feb 15"
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && bills.length === 0) {
    return (
      <div className='flex items-center justify-center h-full min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl mx-auto pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
            <Calendar className='h-6 w-6 text-emerald-500' />
            Bills
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Manage your recurring and one-time financial obligations.
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingBill(null);
          }}
          className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors text-sm font-medium'
        >
          <Plus className='h-4 w-4' />
          Add Bill
        </button>
      </div>

      {(isAdding || editingBill) && (
        <div className='mb-6'>
          <BillForm
            initialData={editingBill || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setEditingBill(null);
            }}
          />
        </div>
      )}

      <div className='space-y-8'>
        {/* Upcoming Bills */}
        <section>
          <h2 className='text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-amber-500' />
            Upcoming
            <span className='text-sm font-normal text-slate-500 ml-2'>
              ({upcoming.length})
            </span>
          </h2>
          {upcoming.length === 0 ? (
            <div className='text-center py-8 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed'>
              <p className='text-slate-500'>
                No upcoming bills for this month.
              </p>
            </div>
          ) : (
            <div className='grid gap-3'>
              {upcoming.map((bill) => (
                <BillCard
                  key={bill._id}
                  bill={bill}
                  isPaid={false}
                  dueDateDisplay={getDueDateDisplay(bill.dueDay)}
                  onMarkPaid={() => handleMarkPaid(bill)}
                  onEdit={() => {
                    setEditingBill(bill);
                    setIsAdding(false);
                  }}
                  onDelete={() => handleDelete(bill._id!)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Paid Bills */}
        <section>
          <h2 className='text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-emerald-500' />
            Paid
            <span className='text-sm font-normal text-slate-500 ml-2'>
              ({paid.length})
            </span>
          </h2>
          {paid.length === 0 ? (
            <div className='text-center py-8 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed'>
              <p className='text-slate-500'>No bills paid yet this month.</p>
            </div>
          ) : (
            <div className='grid gap-3 opacity-75 hover:opacity-100 transition-opacity'>
              {paid.map((bill) => (
                <BillCard
                  key={bill._id}
                  bill={bill}
                  isPaid={true}
                  dueDateDisplay={getDueDateDisplay(bill.dueDay)}
                  onMarkPaid={() => handleMarkUnpaid(bill)} // Toggle back
                  onEdit={() => {
                    setEditingBill(bill);
                    setIsAdding(false);
                  }}
                  onDelete={() => handleDelete(bill._id!)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

interface BillCardProps {
  bill: Bill;
  isPaid: boolean;
  dueDateDisplay: string;
  onMarkPaid: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BillCard: React.FC<BillCardProps> = ({
  bill,
  isPaid,
  dueDateDisplay,
  onMarkPaid,
  onEdit,
  onDelete,
}) => {
  const { format } = useCurrencyFormatter();

  return (
    <div className='flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group'>
      <div className='flex items-center gap-4'>
        <button
          onClick={onMarkPaid}
          className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${isPaid
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-600 hover:border-emerald-500 text-transparent hover:text-emerald-500/50'
            }`}
          title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
        >
          <CheckCircle2 className='h-4 w-4' />
        </button>
        <div>
          <h3
            className={`font-medium ${isPaid ? 'text-slate-400 line-through' : 'text-slate-200'}`}
          >
            {bill.name}
          </h3>
          <div className='flex items-center gap-3 text-sm text-slate-500'>
            <span className='flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              {dueDateDisplay}
            </span>
            {bill.isRecurring && (
              <span className='bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full'>
                Recurring
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <span
          className={`font-semibold ${isPaid ? 'text-slate-500' : 'text-emerald-400'}`}
        >
          {format(bill.amount)}
        </span>
        <div className='flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity'>
          <button
            onClick={onEdit}
            className='p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded'
            title='Edit'
          >
            <Pencil className='h-4 w-4' />
          </button>
          <button
            onClick={onDelete}
            className='p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded'
            title='Delete'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};
