import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthChange, 
  signInWithGoogle, 
  logOut, 
  saveFinancialProfile, 
  getFinancialProfile,
  saveCalculationHistory,
  getCalculationHistory,
  deleteCalculationHistory,
  saveUserSettings,
  getUserSettings
} from '../lib/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Firebase is configured
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey || apiKey === 'your_firebase_api_key_here') {
      console.warn('Firebase is not configured. Running in anonymous mode only.');
      setIsFirebaseConfigured(false);
      setLoading(false);
      return;
    }

    setIsFirebaseConfigured(true);

    // Listen for auth state changes
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAnonymous: false
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const login = async () => {
    if (!isFirebaseConfigured) {
      return { error: 'Firebase is not configured' };
    }
    const result = await signInWithGoogle();
    return result;
  };

  // Sign out
  const logout = async () => {
    if (!isFirebaseConfigured) {
      return { error: 'Firebase is not configured' };
    }
    const result = await logOut();
    return result;
  };

  // Save financial profile to Firebase (only for logged-in users)
  const saveProfile = async (profileData) => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }
    return await saveFinancialProfile(user.uid, profileData);
  };

  // Get financial profile from Firebase
  const getProfile = async () => {
    if (!user) {
      return { data: null, error: 'User not logged in' };
    }
    return await getFinancialProfile(user.uid);
  };

  // Save calculation to Firebase history
  const saveCalculation = async (calculationType, calculationData) => {
    if (!user) {
      return { id: null, error: 'User not logged in' };
    }
    return await saveCalculationHistory(user.uid, calculationType, calculationData);
  };

  // Get calculation history from Firebase
  const getHistory = async (calculationType = null) => {
    if (!user) {
      return { data: [], error: 'User not logged in' };
    }
    return await getCalculationHistory(user.uid, calculationType);
  };

  // Delete calculation from history
  const deleteHistory = async (historyId) => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }
    return await deleteCalculationHistory(user.uid, historyId);
  };

  // Save user settings
  const saveSettings = async (settings) => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }
    return await saveUserSettings(user.uid, settings);
  };

  // Get user settings
  const getSettings = async () => {
    if (!user) {
      return { data: null, error: 'User not logged in' };
    }
    return await getUserSettings(user.uid);
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isFirebaseConfigured,
    login,
    logout,
    saveProfile,
    getProfile,
    saveCalculation,
    getHistory,
    deleteHistory,
    saveSettings,
    getSettings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
