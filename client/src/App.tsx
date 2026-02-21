import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
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
import { LandingPage } from './landing/LandingPage';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { About } from './pages/About';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      localStorage.setItem('wasAuthenticated', 'true');
    }
  }, [user]);

  // If returning user is loading, show minimal loader to prevent Landing Page flash.
  // Otherwise (new user or loaded), follow standard routing.
  const showLoader = loading && localStorage.getItem('wasAuthenticated');

  return (
    <Router>
      <ScrollToTop />
      <div className='flex min-h-screen w-full flex-col bg-background-primary text-text-primary font-sans antialiased transition-colors duration-300'>
        <Routes>
          <Route
            path='/'
            element={
              showLoader ? (
                <div className='flex min-h-screen items-center justify-center bg-background-primary'>
                  <div className='h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent' />
                </div>
              ) : !loading && user ? (
                <Navigate to='/dashboard' replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/about' element={<About />} />
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
