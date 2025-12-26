import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <Router>
      <div className='app-container'>
        <nav className='navbar'>
          <div className='navbar-brand'>
            💰 PocketFlow
          </div>
          <div className='navbar-content'>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <a href="/auth">Sign In</a>
            </SignedOut>
          </div>
        </nav>
        <Routes>
          <Route
            path='/'
            element={
              <FinancialRecordsProvider>
                <Dashboard />
              </FinancialRecordsProvider>
            }
          />
          <Route path='/auth' element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
