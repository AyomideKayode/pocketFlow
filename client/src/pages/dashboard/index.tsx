import { useAuth } from '../../contexts/auth-context';
import { FinancialRecordForm } from './financialRecordForm';
import { FinancialRecordList } from './financialRecordList';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { EmptyState } from '../../components/EmptyState';
import './financial-record.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const { records } = useFinancialRecords();

  // calculate total balance
  const totalMonthlyBalance = records.reduce(
    (acc, record) => acc + record.amount,
    0
  );

  const scrollToForm = () => {
    const formElement = document.querySelector('.form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show welcome empty state for new users
  if (records.length === 0) {
    return (
      <div className='dashboard-container fade-in'>
        <EmptyState
          variant='welcome'
          icon='💰'
          title={`Welcome to PocketFlow, ${user?.displayName || user?.email?.split('@')[0]
            }!`}
          description='Start tracking your finances by adding your first financial record. You can log income, expenses, and monitor your spending patterns all in one place.'
          actionText='Add Your First Record'
          onAction={scrollToForm}
        />
        <div className='form-container'>
          <h2>Add New Record</h2>
          <FinancialRecordForm />
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-container fade-in'>
      <h1>
        Welcome to PocketFlow, {user?.displayName || user?.email?.split('@')[0]}
        ! 💰
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: '#b0b0b0',
          fontSize: '1.1rem',
          marginBottom: '2rem',
        }}
      >
        Manage your finances with ease
      </p>
      <div className='form-container'>
        <h2>Add New Record</h2>
        <FinancialRecordForm />
      </div>
      <div className='balance-container'>
        <span className='balance-title'>Total Monthly Balance:</span>
        <span className='balance-amount'>
          ${totalMonthlyBalance.toFixed(2)}
        </span>
      </div>
      <div className='list-container'>
        <h2>Your Financial Records</h2>
        <FinancialRecordList />
      </div>
    </div>
  );
};
