
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

// Safely access environment variables with shims
const getEnv = (key: string) => {
  try {
    return (window as any).process?.env?.[key] || (import.meta as any).env?.[key] || "";
  } catch (e) {
    return "";
  }
};

// Standard Firebase configuration for the Nova Apk Store
const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY") || "AIzaSyCI5SVkx0xIp1R79FyV5Xf-rcKFMqrC0t8",
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN") || "nova-apk-store.firebaseapp.com",
  projectId: getEnv("FIREBASE_PROJECT_ID") || "nova-apk-store",
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET") || "nova-apk-store.firebasestorage.app",
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID") || "909684732136",
  appId: getEnv("FIREBASE_APP_ID") || "1:909684732136:web:3ed10061b4a60e066b995d",
  measurementId: getEnv("FIREBASE_MEASUREMENT_ID") || "G-YS8JYBN8KV"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Export flag to check if Firebase is configured in the current environment
export const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

// Initialize Firebase modular services with singleton pattern checks
try {
  const existingApps = getApps();
  if (existingApps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.warn("Firebase initialization skipped or failed. Falling back to local mode.");
}

/**
 * Sanitizes Firestore data, converting Timestamp objects to ISO strings for frontend consistency.
 * @param data - The data object from Firestore.
 * @returns Sanitized data object.
 */
export const sanitizeData = (data: any): any => {
  if (!data) return data;
  try {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (value && typeof value === 'object' && value instanceof Timestamp) {
        return value.toDate().toISOString();
      }
      return value;
    }));
  } catch (e) {
    return data;
  }
};

export { 
  auth, db, storage, 
  onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp,
  ref, uploadBytesResumable, getDownloadURL
};
