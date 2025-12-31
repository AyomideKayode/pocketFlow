import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useToast } from '../contexts/toast-context';

interface AuthFormsProps {
  isSignUp: boolean;
  onToggleMode: () => void;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  suggestions: string[];
  color: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasLength) score += 1;
  if (hasUpper) score += 1;
  if (hasLower) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  // Add specific suggestions
  if (!hasLength) suggestions.push('Use at least 8 characters');
  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasNumber) suggestions.push('Add numbers');
  if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');

  switch (score) {
    case 0:
    case 1:
      return { score, feedback: 'Very Weak', suggestions, color: '#ef4444' };
    case 2:
      return { score, feedback: 'Weak', suggestions, color: '#f97316' };
    case 3:
      return { score, feedback: 'Fair', suggestions, color: '#eab308' };
    case 4:
      return { score, feedback: 'Good', suggestions, color: '#22c55e' };
    case 5:
      return { score, feedback: 'Strong', suggestions: [], color: '#16a34a' };
    default:
      return { score, feedback: '', suggestions: [], color: '#6b7280' };
  }
};

export const AuthForms: React.FC<AuthFormsProps> = ({ isSignUp, onToggleMode }) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: '', suggestions: [], color: '#6b7280' });

  // Real-time password strength calculation
  useEffect(() => {
    if (password && isSignUp) {
      setPasswordStrength(getPasswordStrength(password));
    }
  }, [password, isSignUp]);

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };

    switch (field) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (isSignUp && value && value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (isSignUp && value && value !== password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
      case 'firstName':
        if (isSignUp && value && value.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        } else {
          delete errors.firstName;
        }
        break;
      case 'lastName':
        if (isSignUp && value && value.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete errors.lastName;
        }
        break;
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Final validation
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError('Please fix the errors above');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with display name
        if (firstName || lastName) {
          await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`.trim()
          });
        }

        addToast('Account created successfully! Welcome to PocketFlow!', 'success');
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
        addToast(`Welcome back${firstName ? `, ${firstName}` : ''}!`, 'success');
      }
    } catch (error: any) {
      let errorMessage = error.message;

      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      }

      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <div className="form-row">
            <div className="form-field form-field-half">
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  validateField('firstName', e.target.value);
                }}
                required
                className={`input ${fieldErrors.firstName ? 'input-error' : ''}`}
                placeholder="Enter your first name"
              />
              {fieldErrors.firstName && <div className="field-error">{fieldErrors.firstName}</div>}
            </div>
            <div className="form-field form-field-half">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  validateField('lastName', e.target.value);
                }}
                required
                className={`input ${fieldErrors.lastName ? 'input-error' : ''}`}
                placeholder="Enter your last name"
              />
              {fieldErrors.lastName && <div className="field-error">{fieldErrors.lastName}</div>}
            </div>
          </div>
        )}

        <div className="form-field">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField('email', e.target.value);
            }}
            required
            className={`input ${fieldErrors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
          />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </div>

        <div className="form-row">
          <div className="form-field form-field-half">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField('password', e.target.value);
              }}
              required
              className={`input ${fieldErrors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              minLength={6}
            />
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}

            {isSignUp && password && (
              <div className="password-strength">
                <div className="strength-meter">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <div className="strength-feedback">
                  <span className="strength-text" style={{ color: passwordStrength.color }}>
                    {passwordStrength.feedback}
                  </span>
                  {passwordStrength.suggestions.length > 0 && (
                    <div className="strength-suggestions">
                      <span className="suggestions-label">To strengthen:</span>
                      <ul>
                        {passwordStrength.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isSignUp && (
            <div className="form-field form-field-half">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField('confirmPassword', e.target.value);
                }}
                required
                className={`input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
                minLength={6}
              />
              {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="button"
          disabled={loading || Object.keys(fieldErrors).length > 0}
        >
          {loading ? (
            <span className="loading-text">
              <span className="spinner"></span>
              {isSignUp ? 'Creating Account...' : 'Signing In...'}
            </span>
          ) : (
            isSignUp ? 'Sign Up' : 'Sign In'
          )}
        </button>
      </form>

      <div className="auth-toggle">
        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={onToggleMode} className="auth-link">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};
