// This file connects your app to Firebase. In development (`npm run dev`) it
// talks to your local emulators (see `npm run emulators`); a production build
// (`npm run build`, used for deploys) talks to the real project configured in
// `.env.production.local` — see DEPLOY.md.
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

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

// `import.meta.env.DEV` is true for `npm run dev` and false for `npm run build`,
// so local development always uses the emulators and deployed builds never do.
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}
