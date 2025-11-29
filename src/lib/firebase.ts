import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if API key is present to avoid crash
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: any;
let auth: any;
let googleProvider: any;
let db: any;
let analytics: any = null;

if (isFirebaseConfigured) {
    try {
        // Initialize Firebase only if not already initialized
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        db = getFirestore(app);

        // Initialize Analytics conditionally
        isSupported().then(yes => yes && (analytics = getAnalytics(app)));
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    console.warn("⚠️ Firebase API keys are missing. Authentication and Cloud Sync will be disabled.");
}

export { app, auth, googleProvider, db, analytics, isFirebaseConfigured };
export default app;
