import React, { useState, useRef } from 'react';
import {
  X,
  Cloud,
  CloudCheck,
  RefreshCw,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FileCode2,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';

interface CloudBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const CloudBackupModal: React.FC<CloudBackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored
}) => {
  const { user, syncStatus, lastSyncedAt, signInWithGoogle, logout, triggerManualSync } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setErrorMessage(null);
      await signInWithGoogle();
      setSyncResult('Successfully connected Google account and synced typing records!');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Sign-in was cancelled or encountered an error.');
    }
  };

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      setErrorMessage(null);
      await triggerManualSync();
      setSyncResult('Cloud synchronization completed successfully!');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Sync failed. Please verify your connection.');
    } finally {
      setSyncing(false);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = storageService.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KeyPulse_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSyncResult('Backup JSON file downloaded successfully.');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const res = storageService.importBackupJSON(content);
        setSyncResult(`Restored ${res.sessionsRestored} sessions and ${res.textsRestored} custom texts!`);
        if (onDataRestored) onDataRestored();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to parse backup file');
      }
    };
    reader.readAsText(file);
  };

  const localSessionsCount = storageService.getLocalSessions().length;
  const localTextsCount = storageService.getLocalCustomTexts().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Secure Cloud Synchronization</h3>
              <p className="text-xs text-slate-400 font-mono">Google Firebase Firestore Backup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {syncResult && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncResult}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Authentication Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full border border-amber-400/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{user.displayName || 'Typist Account'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected"></span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Link your account to auto-sync stats across all devices</span>
              </div>
              <button
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        {/* Sync Status & Action */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Stored on this device:</span>
            <span className="text-slate-200">{localSessionsCount} sessions · {localTextsCount} custom texts</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Cloud sync status:</span>
            <span className="capitalize text-amber-400 font-semibold">{syncStatus}</span>
          </div>
          {lastSyncedAt && (
            <div className="flex justify-between text-slate-400">
              <span>Last cloud sync:</span>
              <span className="text-slate-300">{lastSyncedAt.toLocaleTimeString()}</span>
            </div>
          )}

          {user && (
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronizing with Firestore...' : 'Sync All Data Now'}
            </button>
          )}
        </div>

        {/* Offline Backup & Restore Section */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-cyan-400" />
            Offline JSON Backup & Portability
          </div>
          <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
            Download your entire typing telemetry and custom texts as a portable JSON file to preserve your data offline or migrate between machines.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleExportJSON}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Download JSON Backup
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              Restore from File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
