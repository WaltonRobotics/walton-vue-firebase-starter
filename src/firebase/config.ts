// This file connects your app to YOUR Firebase project.
// The values below come from environment variables in `.env` (see `.env.example`).
// Never hard-code your real keys here — that way they don't end up in git history.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

// Import these wherever you need to talk to Firebase, e.g.:
//   import { auth, db, storage } from '@/firebase/config'
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
