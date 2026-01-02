import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useFinancialRecords } from '../../contexts/financial-record-context';

export const FinancialRecordForm = () => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const { addRecord } = useFinancialRecords();

  const { user } = useAuth();

  // function call when user submits form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validate amount is positive
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    const newRecord = {
      userId: user?.uid ?? '',
      date: new Date(),
      description: description,
      amount: amountValue,
      type: type,
      category: category,
      paymentMethod: paymentMethod,
    };

    addRecord(newRecord);
    // set fields back to empty
    setDescription('');
    setAmount('');
    setCategory('');
    setPaymentMethod('');
    setType('expense');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='form-field'>
          <label>Transaction Type:</label>
          <div className='transaction-type-toggle'>
            <div
              className={`type-option income ${type === 'income' ? 'selected' : ''}`}
              onClick={() => setType('income')}
            >
              <div className="type-icon">💰</div>
              <div className="type-label">Income</div>
            </div>
            <div
              className={`type-option expense ${type === 'expense' ? 'selected' : ''}`}
              onClick={() => setType('expense')}
            >
              <div className="type-icon">💸</div>
              <div className="type-label">Expense</div>
            </div>
          </div>
        </div>

        <div className='form-field'>
          <label>Description:</label>
          <input
            type='text'
            required
            className='input'
            value={description}
            placeholder='Enter description'
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='form-field'>
          <label>Amount:</label>
          <input
            type='number'
            required
            className='input'
            value={amount}
            placeholder='Enter amount (positive number)'
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className='form-field'>
          <label>Category:</label>
          <select
            required
            className='input'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=''>Select a Category</option>
            <option value='Food'>Food</option>
            <option value='Rent'>Rent</option>
            <option value='Salary'>Salary</option>
            <option value='Utilities'>Utilities</option>
            <option value='Transportation'>Transportation</option>
            <option value='Entertainment'>Entertainment</option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <div className='form-field'>
          <label>Payment Method:</label>
          <select
            required
            className='input'
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value=''>Select a Payment Method</option>
            <option value='Credit Card'>Credit Card</option>
            <option value='Cash'>Cash</option>
            <option value='Bank Transfer'>Bank Transfer</option>
          </select>
        </div>
        <button type='submit' className='button'>
          Add Record
        </button>
      </form>
    </>
  );
};
