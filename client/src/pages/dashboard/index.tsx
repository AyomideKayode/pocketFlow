import { useAuth } from '../../contexts/auth-context';
import { FinancialRecordForm } from './financialRecordForm';
import { FinancialRecordList } from './financialRecordList';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { EmptyState } from '../../components/EmptyState';
import './financial-record.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const { records } = useFinancialRecords();

  // Calculate totals using transaction types
  const totalIncome = records
    .filter(record => record.type === 'income')
    .reduce((acc, record) => acc + Math.abs(record.amount), 0);

  const totalExpenses = records
    .filter(record => record.type === 'expense')
    .reduce((acc, record) => acc + record.amount, 0);

  const totalMonthlyBalance = totalIncome - totalExpenses;

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
        <div className='balance-summary'>
          <div className='balance-item income'>
            <span className='balance-label'>💰 Total Income:</span>
            <span className='balance-value income'>${totalIncome.toFixed(2)}</span>
          </div>
          <div className='balance-item expense'>
            <span className='balance-label'>💸 Total Expenses:</span>
            <span className='balance-value expense'>${totalExpenses.toFixed(2)}</span>
          </div>
          <div className='balance-item total'>
            <span className='balance-title'>Net Balance:</span>
            <span className={`balance-amount ${totalMonthlyBalance >= 0 ? 'positive' : 'negative'}`}>
              ${totalMonthlyBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className='list-container'>
        <h2>Your Financial Records</h2>
        <FinancialRecordList />
      </div>
    </div>
  );
};
