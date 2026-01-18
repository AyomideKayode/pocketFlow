import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import { useAuth } from './contexts/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
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
        <Navbar />
        <main className='flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <FinancialRecordsProvider>
                    <Dashboard />
                  </FinancialRecordsProvider>
                </ProtectedRoute>
              }
            />
            <Route path='/auth' element={<Auth />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
