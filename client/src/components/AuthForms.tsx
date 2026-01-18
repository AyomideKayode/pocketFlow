import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useToast } from '../contexts/toast-context';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

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

  if (!hasLength) suggestions.push('Use at least 8 characters');
  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasNumber) suggestions.push('Add numbers');
  if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');

  switch (score) {
    case 0:
    case 1:
      return {
        score,
        feedback: 'Very Weak',
        suggestions,
        color: 'bg-rose-500',
      };
    case 2:
      return { score, feedback: 'Weak', suggestions, color: 'bg-orange-500' };
    case 3:
      return { score, feedback: 'Fair', suggestions, color: 'bg-amber-500' };
    case 4:
      return { score, feedback: 'Good', suggestions, color: 'bg-emerald-500' };
    case 5:
      return {
        score,
        feedback: 'Strong',
        suggestions: [],
        color: 'bg-emerald-600',
      };
    default:
      return { score, feedback: '', suggestions: [], color: 'bg-slate-600' };
  }
};

const GoogleIcon = () => (
  <svg className='mr-2 h-5 w-5' viewBox='0 0 24 24'>
    <path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill='#4285F4'
    />
    <path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill='#34A853'
    />
    <path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill='#EA4335'
    />
  </svg>
);

export const AuthForms: React.FC<AuthFormsProps> = ({
  isSignUp,
  onToggleMode,
}) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    suggestions: [],
    color: 'bg-slate-600',
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        if (firstName || lastName) {
          await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`.trim(),
          });
        }

        addToast(
          'Account created successfully! Welcome to PocketFlow!',
          'success',
        );
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        addToast(
          `Welcome back${firstName ? `, ${firstName}` : ''}!`,
          'success',
        );
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let errorMessage = error.message || 'An error occurred';

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      addToast('Welcome back!', 'success');
    } catch (err: unknown) {
      console.error('Google sign in error:', err);
      let errorMessage = 'Failed to sign in with Google';
      const error = err as { code?: string; message?: string };

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled';
      } else if (
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        errorMessage =
          'An account already exists with the same email address but different sign-in credentials';
      }

      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      addToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      addToast(
        'Password reset email sent! Check your inbox and follow the instructions.',
        'success',
        { duration: 6000 },
      );
      setIsForgotPassword(false);
      setEmail('');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let errorMessage = error.message || 'An error occurred';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }

      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setIsForgotPassword(false);
    setError('');
    setEmail('');
  };

  const inputClasses =
    'flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 pl-9 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all';
  const errorInputClasses = 'border-rose-500 focus:ring-rose-500';

  if (isForgotPassword) {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-lg font-medium text-white'>Reset Password</h3>
          <p className='mt-1 text-sm text-slate-400'>
            Enter your email to receive reset instructions
          </p>
        </div>
        {error && (
          <div className='rounded-md bg-rose-500/10 p-4 text-sm text-rose-500 border border-rose-500/20 flex items-center gap-2'>
            <AlertCircle className='h-4 w-4' />
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-300'>Email</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-slate-500' />
              <input
                type='email'
                className={inputClasses}
                placeholder='name@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                disabled={loading}
              />
            </div>
          </div>
          <button
            type='submit'
            className='w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        <button
          onClick={handleBackToSignIn}
          className='flex w-full items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className='flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50 disabled:opacity-50'
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-slate-800' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-slate-900 px-2 text-slate-500'>
            Or continue with
          </span>
        </div>
      </div>

      {error && (
        <div className='rounded-md bg-rose-500/10 p-4 text-sm text-rose-500 border border-rose-500/20 flex items-center gap-2 animate-in slide-in-from-top-2'>
          <AlertCircle className='h-4 w-4 shrink-0' />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {isSignUp && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-300'>
                First Name
              </label>
              <input
                type='text'
                className={cn(
                  'flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all',
                  fieldErrors.firstName && errorInputClasses,
                )}
                placeholder='John'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  validateField('firstName', e.target.value);
                }}
                required
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-300'>
                Last Name
              </label>
              <input
                type='text'
                className={cn(
                  'flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all',
                  fieldErrors.lastName && errorInputClasses,
                )}
                placeholder='Doe'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  validateField('lastName', e.target.value);
                }}
                required
              />
            </div>
          </div>
        )}

        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-300'>Email</label>
          <div className='relative'>
            <Mail className='absolute left-3 top-3 h-4 w-4 text-slate-500' />
            <input
              type='email'
              className={cn(
                inputClasses,
                fieldErrors.email && errorInputClasses,
              )}
              placeholder='name@example.com'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField('email', e.target.value);
              }}
              required
            />
          </div>
          {fieldErrors.email && (
            <p className='text-xs text-rose-500'>{fieldErrors.email}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-300'>Password</label>
          <div className='relative'>
            <Lock className='absolute left-3 top-3 h-4 w-4 text-slate-500' />
            <input
              type='password'
              className={cn(
                inputClasses,
                fieldErrors.password && errorInputClasses,
              )}
              placeholder='••••••••'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField('password', e.target.value);
              }}
              required
              minLength={6}
            />
          </div>
          {isSignUp && password && (
            <div className='space-y-1'>
              <div className='h-1 w-full overflow-hidden rounded-full bg-slate-800'>
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    passwordStrength.color,
                  )}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <p
                className={cn(
                  'text-xs font-medium',
                  passwordStrength.color.replace('bg-', 'text-'),
                )}
              >
                {passwordStrength.feedback}
              </p>
            </div>
          )}
        </div>

        {isSignUp && (
          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-300'>
              Confirm Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-slate-500' />
              <input
                type='password'
                className={cn(
                  inputClasses,
                  fieldErrors.confirmPassword && errorInputClasses,
                )}
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField('confirmPassword', e.target.value);
                }}
                required
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className='text-xs text-rose-500'>
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <button
          type='submit'
          className='w-full rounded-md bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all shadow-lg shadow-emerald-900/20'
          disabled={loading || Object.keys(fieldErrors).length > 0}
        >
          {loading ? (
            <div className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              {isSignUp ? 'Creating Account...' : 'Signing In...'}
            </div>
          ) : isSignUp ? (
            'Sign Up'
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className='text-center text-sm'>
        <p className='text-slate-400'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={onToggleMode}
            className='font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-colors'
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
        {!isSignUp && (
          <button
            onClick={() => setIsForgotPassword(true)}
            className='mt-2 text-xs text-slate-500 hover:text-slate-400 transition-colors'
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
};
