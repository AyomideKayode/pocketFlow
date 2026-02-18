import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase client SDK
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  signInWithPopup: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

// Mock the local firebase.ts export to prevent initialization code running
// Relative path from client/src/test/setup.ts to client/src/lib/firebase.ts is ../lib/firebase
vi.mock('../lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  db: {},
  googleProvider: {},
  analytics: null,
}));
