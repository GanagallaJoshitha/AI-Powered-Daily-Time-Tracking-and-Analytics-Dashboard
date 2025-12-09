import { Activity, DayLog, User } from '../types';
import { auth, db, isConfigured } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'tasknest_data';
const USER_KEY = 'tasknest_user';
const USERS_DB_KEY = 'tasknest_users_db'; // Stores registered users for mock auth

export const storageService = {
  // --- AUTHENTICATION ---
  
  loginWithGoogle: async (): Promise<User> => {
    if (isConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        return { 
          uid: fbUser.uid, 
          email: fbUser.email || '', 
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] 
        };
      } catch (error) {
        console.error("Google Auth Error", error);
        throw error;
      }
    } else {
      // Realistic Mock Google Login
      return new Promise((resolve) => {
        setTimeout(() => {
          // Check for existing mock Google user or create one
          const usersDbStr = localStorage.getItem(USERS_DB_KEY);
          const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};
          
          let googleUser = Object.values(usersDb).find((u: any) => u.provider === 'google');
          
          if (!googleUser) {
              // Create a persistent mock Google user if one doesn't exist
              const newId = 'google_user_' + Date.now();
              googleUser = {
                  uid: newId,
                  email: 'alex.taylor@gmail.com', // Realistic mock email
                  displayName: 'Alex Taylor',
                  provider: 'google'
              };
              usersDb['alex.taylor@gmail.com'] = googleUser;
              localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
          }

          const user = { 
            uid: (googleUser as any).uid, 
            email: (googleUser as any).email, 
            displayName: (googleUser as any).displayName 
          };
          
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          resolve(user);
        }, 800);
      });
    }
  },

  login: async (email: string, password?: string): Promise<User> => {
    if (isConfigured && auth) {
      try {
        const pass = password || "";
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;
        return { 
            uid: fbUser.uid, 
            email: fbUser.email || '', 
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] 
        };
      } catch (error) {
        console.error("Firebase Login Error", error);
        throw error;
      }
    } else {
      // Realistic Mock Login
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 1. Fetch mock users DB
          const usersDbStr = localStorage.getItem(USERS_DB_KEY);
          const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};
          
          // 2. Find user
          const userRecord = usersDb[email];

          // 3. Validate
          if (!userRecord) {
            reject({ code: 'auth/user-not-found', message: 'User not found' });
            return;
          }

          if (userRecord.password !== password) {
             reject({ code: 'auth/wrong-password', message: 'Invalid password' });
             return;
          }

          // 4. Success - Create Session
          const sessionUser = { 
            uid: userRecord.uid, 
            email: userRecord.email, 
            displayName: userRecord.displayName 
          };
          
          localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
          resolve(sessionUser);
        }, 800);
      });
    }
  },

  register: async (email: string, password: string, name?: string): Promise<User> => {
    if (isConfigured && auth) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const fbUser = userCredential.user;
            
            if (name) {
                await updateProfile(fbUser, { displayName: name });
                return { uid: fbUser.uid, email: fbUser.email || '', displayName: name };
            }

            return { uid: fbUser.uid, email: fbUser.email || '', displayName: fbUser.email?.split('@')[0] };
        } catch (error) {
            console.error("Firebase Register Error", error);
            throw error;
        }
    } else {
        // Realistic Mock Register
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const usersDbStr = localStorage.getItem(USERS_DB_KEY);
                const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};

                // 1. Check if exists
                if (usersDb[email]) {
                    reject({ code: 'auth/email-already-in-use', message: 'Email already in use' });
                    return;
                }

                // 2. Create new user record
                const newUser = { 
                    uid: 'user_' + Date.now(), 
                    email, 
                    password, // NOTE: Storing plain text password only for mock local demo
                    displayName: name || email.split('@')[0] 
                };

                usersDb[email] = newUser;
                localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));

                // 3. Auto-login (Create Session)
                const sessionUser = { 
                    uid: newUser.uid, 
                    email: newUser.email, 
                    displayName: newUser.displayName 
                };
                localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
                
                resolve(sessionUser);
            }, 800);
        });
    }
  },

  logout: async (): Promise<void> => {
    if (isConfigured && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  getCurrentUser: (): User | null => {
    if (isConfigured && auth) {
       const fbUser = auth.currentUser;
       if (fbUser) {
           return { uid: fbUser.uid, email: fbUser.email || '', displayName: fbUser.displayName || fbUser.email?.split('@')[0] };
       }
    }
    
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // --- FIRESTORE / DATA ---
  getDayLog: async (date: string): Promise<DayLog | null> => {
    if (isConfigured && db && auth?.currentUser) {
       try {
         const path = `users/${auth.currentUser.uid}/days/${date}`;
         console.log(`[TaskNest] Fetching from Firestore: ${path}`);
         
         const docRef = doc(db, 'users', auth.currentUser.uid, 'days', date);
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            return docSnap.data() as DayLog;
         }
         return null;
       } catch (e) {
         console.error("Firestore Error", e);
         return null;
       }
    } else {
      // Mock Data
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = localStorage.getItem(STORAGE_KEY);
          const parsed = data ? JSON.parse(data) : {};
          const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
          
          // Filter mock data by user ID to prevent data bleeding between mock users
          const userKey = `${currentUser.uid}_${date}`;
          
          resolve(parsed[userKey] || null);
        }, 500);
      });
    }
  },

  saveDayLog: async (date: string, activities: Activity[]): Promise<void> => {
    if (isConfigured && db && auth?.currentUser) {
      try {
        const path = `users/${auth.currentUser.uid}/days/${date}`;
        const docRef = doc(db, 'users', auth.currentUser.uid, 'days', date);
        const dayLog: DayLog = {
            date,
            activities,
            isAnalyzed: false 
        };
        await setDoc(docRef, dayLog, { merge: true });
        console.log(`[TaskNest] Saved to Firestore: ${path}`, dayLog);
      } catch (e) {
        console.error("Firestore Save Error", e);
        throw e;
      }
    } else {
      // Mock Save
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = localStorage.getItem(STORAGE_KEY);
          const parsed = data ? JSON.parse(data) : {};
          const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
          const userKey = `${currentUser.uid}_${date}`;

          parsed[userKey] = {
            date,
            activities,
            isAnalyzed: parsed[userKey]?.isAnalyzed || false
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          console.log(`[TaskNest] Saved to Local Mock: ${userKey}`, parsed[userKey]);
          resolve();
        }, 400);
      });
    }
  },

  markAnalyzed: async (date: string): Promise<void> => {
    if (isConfigured && db && auth?.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'days', date);
        await setDoc(docRef, { isAnalyzed: true }, { merge: true });
    } else {
        const data = localStorage.getItem(STORAGE_KEY);
        const parsed = data ? JSON.parse(data) : {};
        const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        const userKey = `${currentUser.uid}_${date}`;

        if (parsed[userKey]) {
            parsed[userKey].isAnalyzed = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
    }
  }
};