import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { TypingSession, LeaderboardEntry, UserProfile, CustomText } from '../types';

const LOCAL_STORAGE_SESSIONS = 'keypulse_sessions_v1';
const LOCAL_STORAGE_CUSTOM_TEXTS = 'keypulse_custom_texts_v1';
const LOCAL_STORAGE_PROFILE = 'keypulse_profile_v1';

// Initial baseline community leaderboard records to gamify right away
export const SEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    userId: 'bot-1',
    displayName: 'AuraTypist_99',
    wpm: 154,
    cpm: 770,
    accuracy: 99.2,
    mode: '60s',
    category: 'common-words',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'seed-2',
    userId: 'bot-2',
    displayName: 'CyberFinger_X',
    wpm: 142,
    cpm: 710,
    accuracy: 98.7,
    mode: '30s',
    category: 'common-words',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'seed-3',
    userId: 'bot-3',
    displayName: 'VimSorcerer',
    wpm: 135,
    cpm: 675,
    accuracy: 99.0,
    mode: '60s',
    category: 'code',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'seed-4',
    userId: 'bot-4',
    displayName: 'NovaKeys',
    wpm: 126,
    cpm: 630,
    accuracy: 97.8,
    mode: '15s',
    category: 'quotes',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'seed-5',
    userId: 'bot-5',
    displayName: 'ZenType',
    wpm: 118,
    cpm: 590,
    accuracy: 100,
    mode: '60s',
    category: 'quotes',
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: 'seed-6',
    userId: 'bot-6',
    displayName: 'SpeedyPanda',
    wpm: 109,
    cpm: 545,
    accuracy: 96.5,
    mode: '30s',
    category: 'common-words',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'seed-7',
    userId: 'bot-7',
    displayName: 'MechanicalClicker',
    wpm: 98,
    cpm: 490,
    accuracy: 98.2,
    mode: '15s',
    category: 'common-words',
    timestamp: new Date(Date.now() - 3600000 * 52).toISOString()
  }
];

export const storageService = {
  // Local storage retrieval
  getLocalSessions(): TypingSession[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLocalSession(session: TypingSession) {
    try {
      const existing = this.getLocalSessions();
      const updated = [session, ...existing].slice(0, 500); // store last 500
      localStorage.setItem(LOCAL_STORAGE_SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save session locally', e);
    }
  },

  getLocalCustomTexts(): CustomText[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TEXTS);
      if (data) return JSON.parse(data);
      // Default starter custom texts
      const starters: CustomText[] = [
        {
          id: 'starter-1',
          userId: 'local',
          title: 'Mechanical Keyboard Lore',
          content: 'Mechanical keyboards use physical switches underneath each key. Keystroke feel, actuation travel distance, and audible feedback define the typing experience.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'starter-2',
          userId: 'local',
          title: 'The Flow State in Typing',
          content: 'When fingers move without conscious instruction, typing transforms from mechanical input into a direct extension of thought. Relax the wrists and let rhythm guide speed.',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_TEXTS, JSON.stringify(starters));
      return starters;
    } catch {
      return [];
    }
  },

  saveLocalCustomText(text: CustomText) {
    try {
      const existing = this.getLocalCustomTexts();
      const index = existing.findIndex(t => t.id === text.id);
      let updated: CustomText[];
      if (index >= 0) {
        updated = [...existing];
        updated[index] = text;
      } else {
        updated = [text, ...existing];
      }
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_TEXTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save custom text locally', e);
    }
  },

  deleteLocalCustomText(id: string) {
    try {
      const existing = this.getLocalCustomTexts();
      const filtered = existing.filter(t => t.id !== id);
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_TEXTS, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to delete custom text locally', e);
    }
  },

  getLocalProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveLocalProfile(profile: UserProfile) {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile locally', e);
    }
  },

  // Cloud Sync Operations
  async syncSessionToCloud(session: TypingSession): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    const path = `users/${user.uid}/sessions/${session.id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'sessions', session.id), {
        id: session.id,
        userId: user.uid,
        wpm: session.wpm,
        cpm: session.cpm,
        rawWpm: session.rawWpm || session.wpm,
        accuracy: session.accuracy,
        duration: session.duration,
        characterCount: session.characterCount,
        errorCount: session.errorCount,
        mode: session.mode,
        category: session.category || 'common-words',
        timestamp: session.timestamp
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }

    // Also update UserProfile stats in Firestore
    const userPath = `users/${user.uid}`;
    try {
      const sessions = this.getLocalSessions();
      const bestWpm = Math.max(session.wpm, ...sessions.map(s => s.wpm), 0);
      const bestCpm = Math.max(session.cpm, ...sessions.map(s => s.cpm), 0);
      const avgAccuracy = sessions.length > 0
        ? Math.round(sessions.reduce((acc, cur) => acc + cur.accuracy, 0) / sessions.length * 10) / 10
        : session.accuracy;

      const profile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Typist',
        photoURL: user.photoURL || '',
        bestWpm,
        bestCpm,
        testsCompleted: sessions.length,
        averageAccuracy: avgAccuracy,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      this.saveLocalProfile(profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }
  },

  async publishToLeaderboard(session: TypingSession, displayName: string, photoURL?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    const entryId = `${user.uid}_${session.mode}`.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const path = `leaderboard/${entryId}`;

    try {
      const entry: LeaderboardEntry = {
        id: entryId,
        userId: user.uid,
        displayName: displayName || user.displayName || 'Anonymous Typist',
        photoURL: photoURL || user.photoURL || '',
        wpm: session.wpm,
        cpm: session.cpm,
        accuracy: session.accuracy,
        mode: session.mode,
        category: session.category,
        timestamp: session.timestamp
      };

      await setDoc(doc(db, 'leaderboard', entryId), entry, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const path = 'leaderboard';
    try {
      const q = query(collection(db, path), orderBy('wpm', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const results: LeaderboardEntry[] = [];
      snapshot.forEach(docSnap => {
        results.push(docSnap.data() as LeaderboardEntry);
      });

      // Merge with seed entries if results are small so leaderboard is active and exciting
      const combined = [...results];
      for (const seed of SEED_LEADERBOARD) {
        if (!combined.some(c => c.id === seed.id || c.displayName === seed.displayName)) {
          combined.push(seed);
        }
      }
      return combined.sort((a, b) => b.wpm - a.wpm);
    } catch {
      // In offline or restricted environments, return seed entries gracefully
      return [...SEED_LEADERBOARD].sort((a, b) => b.wpm - a.wpm);
    }
  },

  subscribeLeaderboard(callback: (entries: LeaderboardEntry[]) => void): () => void {
    const path = 'leaderboard';
    try {
      const q = query(collection(db, path), orderBy('wpm', 'desc'), limit(50));
      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const results: LeaderboardEntry[] = [];
          snapshot.forEach(docSnap => {
            results.push(docSnap.data() as LeaderboardEntry);
          });
          const combined = [...results];
          for (const seed of SEED_LEADERBOARD) {
            if (!combined.some(c => c.id === seed.id || c.displayName === seed.displayName)) {
              combined.push(seed);
            }
          }
          callback(combined.sort((a, b) => b.wpm - a.wpm));
        },
        error => {
          console.warn('Leaderboard realtime subscription error, using local fallback:', error);
          callback([...SEED_LEADERBOARD].sort((a, b) => b.wpm - a.wpm));
        }
      );
      return unsubscribe;
    } catch {
      callback([...SEED_LEADERBOARD].sort((a, b) => b.wpm - a.wpm));
      return () => {};
    }
  },

  async syncAllLocalDataToCloud(): Promise<{ syncedSessions: number; syncedTexts: number }> {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be signed in to sync data to cloud.');

    const sessions = this.getLocalSessions();
    const texts = this.getLocalCustomTexts();
    let syncedSessions = 0;
    let syncedTexts = 0;

    for (const session of sessions) {
      try {
        await this.syncSessionToCloud(session);
        syncedSessions++;
      } catch (e) {
        console.warn('Failed syncing session', session.id, e);
      }
    }

    for (const text of texts) {
      try {
        const textPath = `users/${user.uid}/custom_texts/${text.id}`;
        await setDoc(doc(db, 'users', user.uid, 'custom_texts', text.id), {
          ...text,
          userId: user.uid
        });
        syncedTexts++;
      } catch (e) {
        console.warn('Failed syncing custom text', text.id, e);
      }
    }

    return { syncedSessions, syncedTexts };
  },

  // Export full user JSON data for offline backup
  exportBackupJSON(): string {
    const sessions = this.getLocalSessions();
    const customTexts = this.getLocalCustomTexts();
    const profile = this.getLocalProfile();
    const backup = {
      app: 'KeyPulse',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      sessions,
      customTexts
    };
    return JSON.stringify(backup, null, 2);
  },

  // Restore user data from JSON backup file
  importBackupJSON(jsonStr: string): { sessionsRestored: number; textsRestored: number } {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') throw new Error('Invalid JSON format');

      let sessionsRestored = 0;
      let textsRestored = 0;

      if (Array.isArray(data.sessions)) {
        const current = this.getLocalSessions();
        const merged = [...data.sessions];
        for (const s of current) {
          if (!merged.some(m => m.id === s.id)) {
            merged.push(s);
          }
        }
        localStorage.setItem(LOCAL_STORAGE_SESSIONS, JSON.stringify(merged.slice(0, 500)));
        sessionsRestored = data.sessions.length;
      }

      if (Array.isArray(data.customTexts)) {
        const current = this.getLocalCustomTexts();
        const merged = [...data.customTexts];
        for (const t of current) {
          if (!merged.some(m => m.id === t.id)) {
            merged.push(t);
          }
        }
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_TEXTS, JSON.stringify(merged));
        textsRestored = data.customTexts.length;
      }

      return { sessionsRestored, textsRestored };
    } catch (e) {
      throw new Error('Failed to parse backup file: ' + (e instanceof Error ? e.message : 'Invalid data'));
    }
  }
};
