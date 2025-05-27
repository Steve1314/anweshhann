import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using proper string values
const firebaseConfig = {
  apiKey: "AIzaSyDQVg1NxjQR6IrRytWVEpAgkC-UEQHkibQ",
  authDomain: "anweshhann-22b0d.firebaseapp.com",
  projectId: "anweshhann-22b0d",
  storageBucket: "anweshhann-22b0d.firebasestorage.app",
  messagingSenderId: "313399078328",
  appId: "1:313399078328:web:e801ef73d34806a26ff34d",
  measurementId: "G-F47B60E0ZQ"
};


// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication, Firestore, and Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, app };
