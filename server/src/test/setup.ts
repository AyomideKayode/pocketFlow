import { vi } from 'vitest';

// Mock Firebase Admin SDK
vi.mock('firebase-admin', () => {
  return {
    default: {
      credential: {
        cert: vi.fn(),
      },
      initializeApp: vi.fn(),
      apps: [],
      auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({ uid: 'mock-user-id' }),
      }),
    },
  };
});

// Mock the internal firebaseAdmin module to prevent initialization logic
vi.mock('../lib/firebaseAdmin', () => {
  return {
    default: {
      auth: () => ({
        verifyIdToken: vi.fn().mockResolvedValue({ uid: 'mock-user-id' }),
      }),
    },
    verifyIdToken: vi.fn().mockResolvedValue({ uid: 'mock-user-id' }),
  };
});

// Mock Email Service to avoid console logs during tests unless needed
vi.mock('../services/email.service', () => ({
  emailService: {
    sendEmail: vi.fn(),
    sendTransactionEmail: vi.fn(),
  },
}));
