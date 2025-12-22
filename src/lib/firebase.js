// Firebase Client Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDiE4QqyX6kuzhIKLab7CHN0Wf_isMMpC4",
  authDomain: "paydee-s-boss-ver.firebaseapp.com",
  projectId: "paydee-s-boss-ver",
  storageBucket: "paydee-s-boss-ver.firebasestorage.app",
  messagingSenderId: "533708723016",
  appId: "1:533708723016:web:08a85df2d601ced9d9997d",
  measurementId: "G-1RV8V43EX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions - Financial Profile
export const saveFinancialProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, 'users', userId, 'profile', 'financial');
    await setDoc(docRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    console.error('Save Financial Profile Error:', error);
    return { success: false, error: error.message };
  }
};

export const getFinancialProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId, 'profile', 'financial');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    console.error('Get Financial Profile Error:', error);
    return { data: null, error: error.message };
  }
};

// Firestore functions - Calculation History
export const saveCalculationHistory = async (userId, calculationType, calculationData) => {
  try {
    const colRef = collection(db, 'users', userId, 'calculationHistory');
    const docRef = await addDoc(colRef, {
      type: calculationType,
      data: calculationData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error('Save Calculation History Error:', error);
    return { id: null, error: error.message };
  }
};

export const getCalculationHistory = async (userId, calculationType = null) => {
  try {
    const colRef = collection(db, 'users', userId, 'calculationHistory');
    let q;
    if (calculationType) {
      q = query(colRef, where('type', '==', calculationType), orderBy('createdAt', 'desc'));
    } else {
      q = query(colRef, orderBy('createdAt', 'desc'));
    }
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return { data: history, error: null };
  } catch (error) {
    console.error('Get Calculation History Error:', error);
    return { data: [], error: error.message };
  }
};

export const deleteCalculationHistory = async (userId, historyId) => {
  try {
    const docRef = doc(db, 'users', userId, 'calculationHistory', historyId);
    await deleteDoc(docRef);
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete Calculation History Error:', error);
    return { success: false, error: error.message };
  }
};

// User Settings
export const saveUserSettings = async (userId, settings) => {
  try {
    const docRef = doc(db, 'users', userId, 'settings', 'preferences');
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    console.error('Save User Settings Error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserSettings = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId, 'settings', 'preferences');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    console.error('Get User Settings Error:', error);
    return { data: null, error: error.message };
  }
};

export { auth, db };
