import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes'

function App() {
  return (
    <Router>
      <div className='app-container'>
        <nav className='navbar'>
          <div className='navbar-brand'>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              💰 PocketFlow
            </Link>
          </div>
          <div className='navbar-content'>
            <SignedIn>
              <UserButton
                // showName={true}
                appearance={{
                  baseTheme: dark,
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
