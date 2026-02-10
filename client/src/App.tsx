import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { Transactions } from './pages/transactions';
import { Budgets } from './pages/budgets';
import { Bills } from './pages/bills';
import { Goals } from './pages/goals';
import { Learn } from './pages/learn';
import { Settings } from './pages/settings';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import { BudgetsProvider } from './contexts/budget-context';
import { GoalsProvider } from './contexts/goal-context';
import { useAuth } from './contexts/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center bg-slate-950 text-slate-50'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-10 w-10 animate-spin text-emerald-500' />
          <h1 className='text-xl font-medium'>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className='flex min-h-screen w-full flex-col bg-slate-950 text-slate-50 font-sans antialiased'>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <BudgetsProvider>
                  <FinancialRecordsProvider>
                    <GoalsProvider>
                      <DashboardLayout />
                    </GoalsProvider>
                  </FinancialRecordsProvider>
                </BudgetsProvider>
              </ProtectedRoute>
            }
          >
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/transactions' element={<Transactions />} />
            <Route path='/budgets' element={<Budgets />} />
            <Route path='/bills' element={<Bills />} />
            <Route path='/goals' element={<Goals />} />
            <Route path='/learn' element={<Learn />} />
            <Route path='/settings' element={<Settings />} />
          </Route>

          <Route
            path='/auth'
            element={
              <>
                <Navbar />
                <main className='flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                  <Auth />
                </main>
              </>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
