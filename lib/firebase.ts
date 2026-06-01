import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// In AI Studio, the set_up_firebase tool creates this file automatically.
// For Vercel deployments, we can fallback to environment variables.
let firebaseConfig = {};

try {
  firebaseConfig = require('../firebase-applet-config.json');
} catch (e) {
  // Se estivermos na Vercel e o arquivo não existir, usa as variáveis de ambiente
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Database ID in AI Studio enterprise setup is often passed via firebaseConfig.firestoreDatabaseId
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
const auth = getAuth(app);

export { app, auth, db };
