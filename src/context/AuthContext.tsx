import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
  lastSyncedAt: Date | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  triggerManualSync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'offline'>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Automatically sync local sessions and custom texts on login
        try {
          setSyncStatus('syncing');
          await storageService.syncAllLocalDataToCloud();
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
        } catch (err) {
          console.warn('Initial cloud sync error:', err);
          setSyncStatus('error');
        }
      } else {
        setSyncStatus('idle');
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setSyncStatus('syncing');
      await signInWithPopup(auth, googleProvider);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err: unknown) {
      console.error('Google Sign-in failed', err);
      setSyncStatus('error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSyncStatus('idle');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const triggerManualSync = async () => {
    if (!user) {
      throw new Error('Sign in required for cloud backup.');
    }
    setSyncStatus('syncing');
    try {
      await storageService.syncAllLocalDataToCloud();
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      setSyncStatus('error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        syncStatus,
        lastSyncedAt,
        signInWithGoogle,
        logout,
        triggerManualSync
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
