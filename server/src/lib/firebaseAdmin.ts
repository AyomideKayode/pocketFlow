import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin SDK using service account JSON file, JSON string in env, or path
const initFirebaseAdmin = () => {
  if (admin.apps.length) return admin;

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(
      process.cwd(),
      'pocketflow-d735c-firebase-adminsdk-fbsvc-e232b39403.json',
    );

  let credential;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      credential = admin.credential.cert(parsed as admin.ServiceAccount);
    } else if (fs.existsSync(serviceAccountPath)) {
      const raw = fs.readFileSync(serviceAccountPath, 'utf8');
      const parsed = JSON.parse(raw);
      credential = admin.credential.cert(parsed as admin.ServiceAccount);
    } else {
      console.warn(
        'Firebase service account not found; Firebase Admin will not be initialized.',
      );
    }
  } catch (err) {
    console.warn('Failed to initialize Firebase Admin SDK:', err);
    // continue without throwing to avoid crashing the server at startup
  }

  if (credential) {
    admin.initializeApp({ credential });
    console.log('Initialized Firebase Admin SDK');
  }

  return admin;
};

initFirebaseAdmin();

export const verifyIdToken = async (
  idToken: string,
): Promise<admin.auth.DecodedIdToken> => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth().verifyIdToken(idToken);
};

export default admin;
