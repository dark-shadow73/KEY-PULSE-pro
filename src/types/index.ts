export type TestMode = 'time' | 'words' | 'quote' | 'custom';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 25 | 50 | 100;
export type TextCategory = 'common-words' | 'quotes' | 'code' | 'punctuation' | 'custom';

export interface SecondTelemetry {
  second: number;
  wpm: number;
  rawWpm: number;
  cpm: number;
  errors: number;
  accuracy: number;
}

export interface TypingSession {
  id: string;
  userId: string;
  wpm: number;
  cpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number; // in seconds
  characterCount: number;
  errorCount: number;
  mode: string;
  category: string;
  timestamp: string; // ISO string
  telemetryHistory?: SecondTelemetry[];
  missedCharacters?: Record<string, number>;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  mode: string;
  category?: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  bestWpm: number;
  bestCpm: number;
  testsCompleted: number;
  averageAccuracy: number;
  updatedAt: string;
}

export interface CustomText {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export type ThemeName = 'midnight' | 'matrix' | 'carbon' | 'amber' | 'dracula' | 'paper';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  isDark: boolean;
  bg: string;
  cardBg: string;
  textMain: string;
  textMuted: string;
  accent: string;
  accentText: string;
  correct: string;
  incorrect: string;
  caret: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  soundType: 'mechanical' | 'soft' | 'click' | 'silent';
  theme: ThemeName;
  smoothCaret: boolean;
  showLiveWpm: boolean;
  showLiveCpm: boolean;
  showLiveAccuracy: boolean;
  quickRestartKey: boolean;
  fontSize: 'small' | 'medium' | 'large';
}
