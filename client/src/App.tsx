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
import { LandingPage } from './landing/LandingPage';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { About } from './pages/About';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const { user, loading } = useAuth();

  // We intentionally removed the top-level loading check to allow
  // the Landing Page to render immediately for SEO purposes.
  // Protected routes handle their own loading state.

  return (
    <Router>
      <ScrollToTop />
      <div className='flex min-h-screen w-full flex-col bg-background-primary text-text-primary font-sans antialiased transition-colors duration-300'>
        <Routes>
          <Route
            path='/'
            element={
              // If loading, show LandingPage (bots see this).
              // If loaded and user exists, redirect.
              // If loaded and no user, show LandingPage.
              !loading && user ? <Navigate to='/dashboard' replace /> : <LandingPage />
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
