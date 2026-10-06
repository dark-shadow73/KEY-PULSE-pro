import React from 'react';
import {
  X,
  Settings as SettingsIcon,
  Volume2,
  Palette,
  Type,
  Sparkles,
  Keyboard
} from 'lucide-react';
import { AppSettings, ThemeName } from '../types';
import { THEMES } from '../data/themes';
import { soundSynth } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Typing Experience Settings</h3>
              <p className="text-xs text-slate-400 font-mono">Audio, Themes & Display Customization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs font-mono">
          {/* Zen Mode Setting */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Zen Mode (Distraction-Free)
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!settings.zenMode}
                  onChange={e => onUpdateSettings({ zenMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Hides navigation bar, partner ads, and distracting elements while practicing. Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">Alt+Z</kbd> anytime.
            </p>
          </div>

          {/* Sound Profile */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Volume2 className="w-4 h-4 text-amber-400" />
                Keyboard Audio Feedback
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            {settings.soundEnabled && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { id: 'mechanical', name: 'Mechanical Switch' },
                  { id: 'soft', name: 'Soft Thud' },
                  { id: 'click', name: 'High Click' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onUpdateSettings({ soundType: s.id as any });
                      soundSynth.playKeypress(s.id as any);
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-colors ${
                      settings.soundType === s.id
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Palette */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Palette className="w-4 h-4 text-cyan-400" />
              Color Theme & Dark Mode
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(THEMES).map(t => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    settings.theme === t.id
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{t.name}</span>
                  <span className={`w-3 h-3 rounded-full ${t.caret}`}></span>
                </button>
              ))}
            </div>
          </div>

          {/* Arena Font Size */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Type className="w-4 h-4 text-emerald-400" />
              Typing Text Font Size
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'small', label: 'Compact' },
                { id: 'medium', label: 'Balanced' },
                { id: 'large', label: 'Expansive' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontSize: f.id as any })}
                  className={`py-2 px-3 rounded-xl border text-center transition-colors ${
                    settings.fontSize === f.id
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts info */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-slate-500" />
              <span>Restart active test:</span>
            </div>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
              Esc
            </kbd>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono text-xs transition-all shadow"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
