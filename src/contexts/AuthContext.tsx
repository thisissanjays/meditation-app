import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User as AppUser, UserPreferences } from '../types';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const defaultPreferences: UserPreferences = {
  goals: ['mindfulness'],
  experienceLevel: 'beginner',
  preferredDuration: 10,
  preferredTime: 'morning',
  favoriteCategories: [],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as AppUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: AppUser = {
      uid: cred.user.uid,
      email,
      displayName: name,
      isPremium: false,
      preferences: defaultPreferences,
      streak: 0,
      totalMinutes: 0,
      joinedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), newUser);
    setUser(newUser);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updated = { ...user, preferences: { ...user.preferences, ...prefs } };
    await setDoc(doc(db, 'users', user.uid), updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, signIn, signUp, signOut, updatePreferences }}
    >
      {children}
    </AuthContext.Provider>
  );
}
