import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import { useAuth } from './contexts/auth-context';
import { UserButton } from './components/UserButton';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='app-container'>
        <div className='loading-container'>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className='app-container'>
        <nav className='navbar'>
          <div className='navbar-brand'>
            <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
              💰 PocketFlow
            </Link>
          </div>
          <div className='navbar-content'>
            {user ? <UserButton /> : <Link to='/auth'>Sign In</Link>}
          </div>
        </nav>
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
      </div>
    </Router>
  );
}

export default App;
