// @ts-ignore
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const STORAGE_CONFIG_KEY = 'firebase_config_override';

// 1. Environment Variable Config (Build time / Local Dev)
// In Vite, we use import.meta.env.VITE_...
// We also support process.env for other build systems just in case.
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore
    return import.meta.env[`VITE_${key}`];
  } catch (e) {
    try {
      return process.env[`FIREBASE_${key}`] || process.env[key];
    } catch (z) {
      return undefined;
    }
  }
};

const envConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY'),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('FIREBASE_APP_ID')
};

// 2. Local Storage Config (Runtime override for demo/ease of use)
const getStoredConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) { 
    return null; 
  }
};

const activeConfig = getStoredConfig() || (envConfig.apiKey ? envConfig : null);
export const isConfigured = !!(activeConfig && activeConfig.apiKey);

let app;
let auth: any = null;
let db: any = null;

if (isConfigured) {
  try {
    // Check if app is already initialized to avoid duplicate errors
    if (!getApps().length) {
      app = initializeApp(activeConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    auth = null;
    db = null;
  }
} else {
  console.log("No Firebase config found. Using Mock Storage.");
}

// Helpers to manage config from UI
export const updateFirebaseConfig = (config: any) => {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    window.location.reload();
};

export const resetFirebaseConfig = () => {
    localStorage.removeItem(STORAGE_CONFIG_KEY);
    window.location.reload();
};

export { auth, db };