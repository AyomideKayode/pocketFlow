import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financialRecordForm";
import { FinancialRecordList } from "./financialRecordList";

export const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="dashboard-container">
      <h2>Welcome to PocketFlow, {user?.firstName}!</h2>
      <p>Here are your Finances:</p>
      <FinancialRecordForm />
      <FinancialRecordList />
    </div>
  );
};
