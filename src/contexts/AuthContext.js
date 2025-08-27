import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirebaseError, getNetworkState } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, userData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: userData.displayName });
    
    // Create user profile in Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName,
      age: userData.age || null,
      weight: userData.weight || null,
      height: userData.height || null,
      fitnessGoal: userData.fitnessGoal || 'general',
      experienceLevel: userData.experienceLevel || 'beginner',
      preferences: userData.preferences || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
    setUserProfile(userDoc);
    
    return userCredential;
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile
  async function updateUserProfile(updates) {
    if (!currentUser) return;
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userDocRef, updatedData);
    setUserProfile(prev => ({ ...prev, ...updatedData }));
    
    // Update display name in auth if provided
    if (updates.displayName) {
      await updateProfile(currentUser, { displayName: updates.displayName });
    }
  }

  // Load user profile from Firestore
  async function loadUserProfile(user) {
    try {
      // Check network state first
      if (!getNetworkState()) {
        console.warn('Device is offline, skipping profile load');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data());
      } else {
        // Create profile if it doesn't exist (for existing users)
        const defaultProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      const friendlyMessage = handleFirebaseError(error, 'Loading user profile');
      console.error('Error loading user profile:', friendlyMessage);
      
      // For offline errors, don't show to user - just log
      if (error.code !== 'firestore/unavailable' && !error.message.includes('offline')) {
        // You could emit an error event here or set an error state
        console.warn('Profile loading failed, user may need to refresh');
      }
    }
  }

  // Google sign-in function
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists, if not create one
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // Create user profile for Google sign-in
        const userDoc = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          age: null,
          weight: null,
          height: null,
          fitnessGoal: 'general',
          experienceLevel: 'beginner',
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(userDocRef, userDoc);
        setUserProfile(userDoc);
      }
      
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
