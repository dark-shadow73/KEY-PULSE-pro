import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { TypingArena } from './components/TypingArena';
import { SessionResults } from './components/SessionResults';
import { ProgressDashboard } from './components/ProgressDashboard';
import { Leaderboard } from './components/Leaderboard';
import { CustomLibraryManager } from './components/CustomLibraryManager';
import { CloudBackupModal } from './components/CloudBackupModal';
import { SettingsModal } from './components/SettingsModal';
import { TypingSession, CustomText, AppSettings, ThemeName } from './types';
import { storageService } from './services/storageService';
import { THEMES } from './data/themes';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  soundType: 'mechanical',
  theme: 'midnight',
  smoothCaret: true,
  showLiveWpm: true,
  showLiveCpm: true,
  showLiveAccuracy: true,
  quickRestartKey: true,
  fontSize: 'medium'
};

const LOCAL_STORAGE_SETTINGS = 'keypulse_settings_v1';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'test' | 'stats' | 'leaderboard' | 'library' | 'settings'>('test');
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [sessions, setSessions] = useState<TypingSession[]>([]);
  const [customTexts, setCustomTexts] = useState<CustomText[]>([]);
  const [completedSession, setCompletedSession] = useState<TypingSession | null>(null);
  const [customPracticeText, setCustomPracticeText] = useState<string | null>(null);
  const [customPracticeTitle, setCustomPracticeTitle] = useState<string | null>(null);

  // Modals
  const [cloudBackupOpen, setCloudBackupOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load initial local data
  useEffect(() => {
    const loadedSessions = storageService.getLocalSessions();
    const loadedTexts = storageService.getLocalCustomTexts();
    setSessions(loadedSessions);
    setCustomTexts(loadedTexts);
  }, []);

  // Persist settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(updated));
      return updated;
    });
  };

  const handleTestComplete = (session: TypingSession) => {
    // Save to local storage
    storageService.saveLocalSession(session);
    setSessions(prev => [session, ...prev]);

    // Background sync to cloud if authenticated
    if (user) {
      storageService.syncSessionToCloud(session).catch(e => {
        console.warn('Background sync error', e);
      });
    }

    setCompletedSession(session);
  };

  const handleRestartTest = () => {
    setCompletedSession(null);
  };

  const handleNextTest = () => {
    setCompletedSession(null);
    setCustomPracticeText(null);
    setCustomPracticeTitle(null);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    try {
      localStorage.setItem('keypulse_sessions_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update sessions', e);
    }
  };

  const handleAddCustomText = (text: CustomText) => {
    storageService.saveLocalCustomText(text);
    setCustomTexts(prev => [text, ...prev]);
  };

  const handleDeleteCustomText = (id: string) => {
    storageService.deleteLocalCustomText(id);
    setCustomTexts(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectPracticeText = (content: string, title: string) => {
    setCustomPracticeText(content);
    setCustomPracticeTitle(title);
    setCompletedSession(null);
    setActiveTab('test');
  };

  const handleChallengeScore = (mode: string) => {
    setActiveTab('test');
    setCompletedSession(null);
    setCustomPracticeText(null);
  };

  const themeConfig = THEMES[settings.theme] || THEMES.midnight;

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.textMain} flex flex-col font-sans transition-colors duration-200`}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab === 'test') {
            setCompletedSession(null);
          }
        }}
        currentTheme={settings.theme}
        setTheme={t => handleUpdateSettings({ theme: t })}
        soundEnabled={settings.soundEnabled}
        setSoundEnabled={val => handleUpdateSettings({ soundEnabled: val })}
        onOpenCloudBackup={() => setCloudBackupOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onResetTest={() => {
          setCompletedSession(null);
          setCustomPracticeText(null);
        }}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center">
        {activeTab === 'test' && (
          <div className="w-full">
            {completedSession ? (
              <SessionResults
                session={completedSession}
                onRestart={handleRestartTest}
                onNextTest={handleNextTest}
                onViewStats={() => {
                  setCompletedSession(null);
                  setActiveTab('stats');
                }}
                onViewLeaderboard={() => {
                  setCompletedSession(null);
                  setActiveTab('leaderboard');
                }}
              />
            ) : (
              <div className="space-y-4">
                {customPracticeTitle && (
                  <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
                    <span>Practicing: <strong>{customPracticeTitle}</strong></span>
                    <button
                      onClick={() => {
                        setCustomPracticeText(null);
                        setCustomPracticeTitle(null);
                      }}
                      className="text-slate-400 hover:text-slate-200 underline"
                    >
                      Clear custom
                    </button>
                  </div>
                )}
                <TypingArena
                  onComplete={handleTestComplete}
                  settings={settings}
                  customTextOverride={customPracticeText}
                  onClearCustomOverride={() => {
                    setCustomPracticeText(null);
                    setCustomPracticeTitle(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <ProgressDashboard
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
            onExportBackup={() => setCloudBackupOpen(true)}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard onChallengeScore={handleChallengeScore} />
        )}

        {activeTab === 'library' && (
          <CustomLibraryManager
            customTexts={customTexts}
            onAddCustomText={handleAddCustomText}
            onDeleteCustomText={handleDeleteCustomText}
            onSelectForPractice={handleSelectPracticeText}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/40 py-4 px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span>KeyPulse Pro</span>
            <span>·</span>
            <span>Real-time WPM/CPM Telemetry</span>
            <span>·</span>
            <span>Encrypted Cloud Sync</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400">Esc</kbd> anytime to restart</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CloudBackupModal
        isOpen={cloudBackupOpen}
        onClose={() => setCloudBackupOpen(false)}
        onDataRestored={() => {
          setSessions(storageService.getLocalSessions());
          setCustomTexts(storageService.getLocalCustomTexts());
        }}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
