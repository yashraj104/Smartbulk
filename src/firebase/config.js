import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBWQ-wULKR2cFIQYoC_RXZdsrzj_c0Q6-Y",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "smartbulk-efd24.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "smartbulk-efd24",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "smartbulk-efd24.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "83687074580",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:83687074580:web:5776b9eb0f429a4469b001",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-CSQJD5XH3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (optional - only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Network management utilities
export const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore network enabled');
  } catch (error) {
    console.error('Error enabling Firestore network:', error);
  }
};

export const disableFirestoreNetwork = async () => {
  try {
    await disableNetwork(db);
    console.log('Firestore network disabled');
  } catch (error) {
    console.error('Error disabling Firestore network:', error);
  }
};

// Error handling utility
export const handleFirebaseError = (error, operation = 'Firebase operation') => {
  console.error(`${operation} error:`, error);
  
  // Common error messages
  const errorMessages = {
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/popup-blocked': 'Pop-up blocked. Please allow pop-ups and try again.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email.',
    'firestore/unavailable': 'Firestore service is temporarily unavailable.',
    'firestore/permission-denied': 'Permission denied. Please sign in again.',
    'firestore/failed-precondition': 'Operation failed. Please try again.',
  };
  
  return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
};

// Connection state management
let isOnline = navigator.onLine;
export const getNetworkState = () => isOnline;

// Listen for network changes
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    enableFirestoreNetwork();
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
  });
}

export default app;
