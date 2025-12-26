import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financialRecordForm";
import { FinancialRecordList } from "./financialRecordList";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import "./financial-record.css";

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  // calculate total balance
  const totalMonthlyBalance = records.reduce((acc, record) => acc + record.amount, 0);

  return (
    <div className="dashboard-container fade-in">
      <h1>Welcome to PocketFlow, {user?.firstName}! 💰</h1>
      <p style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Manage your finances with ease
      </p>
      <div className="form-container">
        <h2>Add New Record</h2>
        <FinancialRecordForm />
      </div>
      <div className="balance-container">
        <span className="balance-title">Total Monthly Balance:</span>
        <span className="balance-amount">
          ${totalMonthlyBalance.toFixed(2)}
        </span>
      </div>
      <div className="list-container">
        <h2>Your Financial Records</h2>
        <FinancialRecordList />
      </div>
    </div>
  );
};
