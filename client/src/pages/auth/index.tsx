import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { Navigate } from 'react-router-dom';
import { AuthForms } from '../../components/AuthForms';

export const Auth = () => {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className='sign-in-container'>
        <h1>Loading...</h1>
      </div>
    );
  }

  // Redirect if already authenticated
  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <div className='sign-in-container'>
      <h1>Welcome to Your Own Personal Finance Tracker!</h1>
      <AuthForms
        isSignUp={isSignUp}
        onToggleMode={() => setIsSignUp(!isSignUp)}
      />
    </div>
  );
};
