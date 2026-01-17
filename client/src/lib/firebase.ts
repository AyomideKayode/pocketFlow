import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Optional for future features

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Helper function to get ID token for API requests
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// Link current signed-in user with Google provider
export const linkGoogleAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user to link');
  return linkWithPopup(user, googleProvider);
};
