import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { billService } from '../../services/bill-service';
import { useConfirmationDialog } from '../../contexts/confirmation-dialog-context';
import type { Bill } from '../../types/bill';
import { BillForm } from './BillForm';
import {
  Loader2,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '../../contexts/toast-context';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useBills } from '../../hooks/useBills';
import { BillCard } from '../../components/bills/BillCard';

export const Bills: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { showConfirmation } = useConfirmationDialog();
  const { format } = useCurrencyFormatter();

  const { overdue, upcoming, paid, loading, refreshBills, currentPeriod } =
    useBills();

  const [isAdding, setIsAdding] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [loadingBillId, setLoadingBillId] = useState<string | null>(null);

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
      refreshBills();
    } catch (error) {
      console.error('Error saving bill:', error);
      addToast('Failed to save bill', 'error');
    }
  };

  const handleDelete = (bill: Bill) => {
    if (!user) return;

    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate();
    const dueDateStr = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      Math.min(bill.dueDay, daysInMonth),
    ).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    showConfirmation({
      title: 'Delete Bill',
      message: `Are you sure you want to delete "${bill.name}"?\n\nAmount: ${format(bill.amount)} • Due: ${dueDateStr}${bill.isRecurring ? ' • Recurring' : ''}`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        try {
          setLoadingBillId(bill._id!);
          const token = await user.getIdToken();
          await billService.deleteBill(token, bill._id!);
          addToast('Bill deleted successfully', 'success');
          refreshBills();
        } catch (error) {
          console.error('Error deleting bill:', error);
          addToast('Failed to delete bill', 'error');
        } finally {
          setLoadingBillId(null);
        }
      },
    });
  };

  const handleMarkPaid = async (bill: Bill) => {
    if (!user) return;
    try {
      setLoadingBillId(bill._id!);
      const token = await user.getIdToken();
      await billService.markBillPaid(token, bill._id!);
      addToast('Marked as paid', 'success');
      refreshBills();
    } catch (error) {
      console.error('Error marking bill paid:', error);
      addToast('Failed to mark as paid', 'error');
    } finally {
      setLoadingBillId(null);
    }
  };

  const handleMarkUnpaid = async (bill: Bill) => {
    if (!user) return;
    try {
      setLoadingBillId(bill._id!);
      const token = await user.getIdToken();
      await billService.markBillUnpaid(token, bill._id!);
      addToast('Marked as unpaid', 'success');
      refreshBills();
    } catch (error) {
      console.error('Error marking bill unpaid:', error);
      if (error instanceof Error && error.message.includes('Cannot unpay')) {
        addToast('Cannot unpay bills from previous months', 'error');
      } else {
        addToast('Failed to mark as unpaid', 'error');
      }
    } finally {
      setLoadingBillId(null);
    }
  };

  if (
    loading &&
    overdue.length === 0 &&
    upcoming.length === 0 &&
    paid.length === 0
  ) {
    return (
      <div className='flex items-center justify-center h-full min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
      </div>
    );
  }

  const allEmpty =
    overdue.length === 0 && upcoming.length === 0 && paid.length === 0;

  return (
    <div className='space-y-6 max-w-4xl mx-auto pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
            <Calendar className='h-6 w-6 text-emerald-600 dark:text-emerald-500' />
            Bills
          </h1>
          <p className='text-gray-500 dark:text-slate-400 text-sm mt-1'>
            Manage your recurring and one-time financial obligations.
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingBill(null);
          }}
          className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors text-sm font-medium shadow-sm dark:shadow-none'
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

      {allEmpty && !isAdding && !editingBill ? (
        <div className='text-center py-16 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-800 border-dashed'>
          <p className='text-gray-500 dark:text-slate-500'>
            No bills found. Add one to get started!
          </p>
        </div>
      ) : (
        <div className='space-y-8'>
          {/* Overdue Section - Render FIRST */}
          {overdue.length > 0 && (
            <section className='animate-in fade-in slide-in-from-top-4 duration-500'>
              <h2 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5' />
                Overdue
                <span className='bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-200 dark:border-red-500/20'>
                  {overdue.length}
                </span>
              </h2>
              <div className='grid gap-3'>
                {overdue.map((bill) => (
                  <BillCard
                    key={bill._id}
                    bill={bill}
                    visualState='overdue'
                    currentPeriod={currentPeriod}
                    onMarkPaid={() => handleMarkPaid(bill)}
                    onEdit={() => {
                      setEditingBill(bill);
                      setIsAdding(false);
                    }}
                    onDelete={() => handleDelete(bill)}
                    isLoading={loadingBillId === bill._id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Section */}
          <section>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-amber-500' />
                Upcoming
                <span className='text-sm font-normal text-gray-500 dark:text-slate-500 ml-2'>
                  ({upcoming.length})
                </span>
              </h2>

              {/* Positive reinforcement if no overdue bills */}
              {overdue.length === 0 &&
                (upcoming.length > 0 || paid.length > 0) && (
                  <div className='flex items-center gap-2 text-emerald-700 dark:text-emerald-500/80 text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/10'>
                    <CheckCircle2 className='h-3 w-3 sm:h-4 sm:w-4' />
                    <span>Nothing overdue 🎉</span>
                  </div>
                )}
            </div>

            {upcoming.length === 0 ? (
              <div className='text-center py-8 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-800 border-dashed'>
                <p className='text-gray-500 dark:text-slate-500'>
                  No upcoming bills for this month.
                </p>
              </div>
            ) : (
              <div className='grid gap-3'>
                {upcoming.map((bill) => (
                  <BillCard
                    key={bill._id}
                    bill={bill}
                    visualState='upcoming'
                    currentPeriod={currentPeriod}
                    onMarkPaid={() => handleMarkPaid(bill)}
                    onEdit={() => {
                      setEditingBill(bill);
                      setIsAdding(false);
                    }}
                    onDelete={() => handleDelete(bill)}
                    isLoading={loadingBillId === bill._id}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Paid Bills */}
          <section>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-slate-200 mb-4 flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-emerald-600 dark:text-emerald-500' />
              Paid
              <span className='text-sm font-normal text-gray-500 dark:text-slate-500 ml-2'>
                ({paid.length})
              </span>
            </h2>
            {paid.length === 0 ? (
              <div className='text-center py-8 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-800 border-dashed'>
                <p className='text-gray-500 dark:text-slate-500'>No bills paid yet this month.</p>
              </div>
            ) : (
              <div className='grid gap-3 opacity-75 hover:opacity-100 transition-opacity'>
                {paid.map((bill) => (
                  <BillCard
                    key={bill._id}
                    bill={bill}
                    visualState='paid'
                    currentPeriod={currentPeriod}
                    onMarkPaid={() => handleMarkUnpaid(bill)}
                    onEdit={() => {
                      setEditingBill(bill);
                      setIsAdding(false);
                    }}
                    onDelete={() => handleDelete(bill)}
                    isLoading={loadingBillId === bill._id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
