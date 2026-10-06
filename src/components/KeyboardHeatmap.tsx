import React, { useState, useMemo } from 'react';
import {
  Flame,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Activity,
  Hand
} from 'lucide-react';
import { TypingSession } from '../types';

interface KeyboardHeatmapProps {
  sessions: TypingSession[];
  onPracticeKeys?: (keys: string[]) => void;
}

type HeatmapMode = 'errors' | 'frequency' | 'accuracy';

interface KeyConfig {
  key: string;
  display: string;
  width?: string;
  finger?: string;
  hand?: 'left' | 'right';
  isSpecial?: boolean;
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Number row
  [
    { key: '`', display: '`', finger: 'Left Pinky', hand: 'left' },
    { key: '1', display: '1', finger: 'Left Pinky', hand: 'left' },
    { key: '2', display: '2', finger: 'Left Ring', hand: 'left' },
    { key: '3', display: '3', finger: 'Left Middle', hand: 'left' },
    { key: '4', display: '4', finger: 'Left Index', hand: 'left' },
    { key: '5', display: '5', finger: 'Left Index', hand: 'left' },
    { key: '6', display: '6', finger: 'Right Index', hand: 'right' },
    { key: '7', display: '7', finger: 'Right Index', hand: 'right' },
    { key: '8', display: '8', finger: 'Right Middle', hand: 'right' },
    { key: '9', display: '9', finger: 'Right Ring', hand: 'right' },
    { key: '0', display: '0', finger: 'Right Pinky', hand: 'right' },
    { key: '-', display: '-', finger: 'Right Pinky', hand: 'right' },
    { key: '=', display: '=', finger: 'Right Pinky', hand: 'right' },
    { key: 'backspace', display: '⌫ Back', width: 'w-16 sm:w-20', isSpecial: true, finger: 'Right Pinky', hand: 'right' }
  ],
  // Top row
  [
    { key: 'tab', display: 'Tab ⇥', width: 'w-14 sm:w-16', isSpecial: true, finger: 'Left Pinky', hand: 'left' },
    { key: 'q', display: 'Q', finger: 'Left Pinky', hand: 'left' },
    { key: 'w', display: 'W', finger: 'Left Ring', hand: 'left' },
    { key: 'e', display: 'E', finger: 'Left Middle', hand: 'left' },
    { key: 'r', display: 'R', finger: 'Left Index', hand: 'left' },
    { key: 't', display: 'T', finger: 'Left Index', hand: 'left' },
    { key: 'y', display: 'Y', finger: 'Right Index', hand: 'right' },
    { key: 'u', display: 'U', finger: 'Right Index', hand: 'right' },
    { key: 'i', display: 'I', finger: 'Right Middle', hand: 'right' },
    { key: 'o', display: 'O', finger: 'Right Ring', hand: 'right' },
    { key: 'p', display: 'P', finger: 'Right Pinky', hand: 'right' },
    { key: '[', display: '[', finger: 'Right Pinky', hand: 'right' },
    { key: ']', display: ']', finger: 'Right Pinky', hand: 'right' },
    { key: '\\', display: '\\', width: 'w-12 sm:w-14', finger: 'Right Pinky', hand: 'right' }
  ],
  // Home row
  [
    { key: 'caps', display: 'Caps ⇪', width: 'w-16 sm:w-20', isSpecial: true, finger: 'Left Pinky', hand: 'left' },
    { key: 'a', display: 'A', finger: 'Left Pinky', hand: 'left' },
    { key: 's', display: 'S', finger: 'Left Ring', hand: 'left' },
    { key: 'd', display: 'D', finger: 'Left Middle', hand: 'left' },
    { key: 'f', display: 'F', finger: 'Left Index', hand: 'left' },
    { key: 'g', display: 'G', finger: 'Left Index', hand: 'left' },
    { key: 'h', display: 'H', finger: 'Right Index', hand: 'right' },
    { key: 'j', display: 'J', finger: 'Right Index', hand: 'right' },
    { key: 'k', display: 'K', finger: 'Right Middle', hand: 'right' },
    { key: 'l', display: 'L', finger: 'Right Ring', hand: 'right' },
    { key: ';', display: ';', finger: 'Right Pinky', hand: 'right' },
    { key: "'", display: "'", finger: 'Right Pinky', hand: 'right' },
    { key: 'enter', display: 'Enter ⏎', width: 'w-20 sm:w-24', isSpecial: true, finger: 'Right Pinky', hand: 'right' }
  ],
  // Bottom row
  [
    { key: 'shift_l', display: '⇧ Shift', width: 'w-20 sm:w-24', isSpecial: true, finger: 'Left Pinky', hand: 'left' },
    { key: 'z', display: 'Z', finger: 'Left Pinky', hand: 'left' },
    { key: 'x', display: 'X', finger: 'Left Ring', hand: 'left' },
    { key: 'c', display: 'C', finger: 'Left Middle', hand: 'left' },
    { key: 'v', display: 'V', finger: 'Left Index', hand: 'left' },
    { key: 'b', display: 'B', finger: 'Left Index', hand: 'left' },
    { key: 'n', display: 'N', finger: 'Right Index', hand: 'right' },
    { key: 'm', display: 'M', finger: 'Right Index', hand: 'right' },
    { key: ',', display: ',', finger: 'Right Middle', hand: 'right' },
    { key: '.', display: '.', finger: 'Right Ring', hand: 'right' },
    { key: '/', display: '/', finger: 'Right Pinky', hand: 'right' },
    { key: 'shift_r', display: '⇧ Shift', width: 'w-20 sm:w-24', isSpecial: true, finger: 'Right Pinky', hand: 'right' }
  ],
  // Space row
  [
    { key: 'ctrl_l', display: 'Ctrl', width: 'w-14 sm:w-16', isSpecial: true, finger: 'Left Pinky', hand: 'left' },
    { key: 'alt_l', display: 'Alt', width: 'w-14 sm:w-16', isSpecial: true, finger: 'Left Thumb', hand: 'left' },
    { key: ' ', display: 'Spacebar', width: 'flex-1 min-w-[140px] sm:min-w-[260px]', finger: 'Thumbs', hand: 'left' },
    { key: 'alt_r', display: 'Alt', width: 'w-14 sm:w-16', isSpecial: true, finger: 'Right Thumb', hand: 'right' },
    { key: 'ctrl_r', display: 'Ctrl', width: 'w-14 sm:w-16', isSpecial: true, finger: 'Right Pinky', hand: 'right' }
  ]
];

// Natural English character frequency distribution baseline for historical estimation
const DEFAULT_CHAR_DISTRIBUTION: Record<string, number> = {
  'e': 12.02, 't': 9.10, 'a': 8.12, 'o': 7.68, 'i': 7.31, 'n': 6.95, 's': 6.28,
  'r': 6.02, 'h': 5.92, 'd': 4.32, 'l': 3.98, 'u': 2.88, 'c': 2.71, 'm': 2.61,
  'f': 2.30, 'y': 2.11, 'w': 2.09, 'g': 2.03, 'p': 1.82, 'b': 1.49, 'v': 1.11,
  'k': 0.69, 'x': 0.17, 'q': 0.11, 'j': 0.10, 'z': 0.07, ' ': 18.00,
  '.': 1.5, ',': 1.2, ';': 0.3, "'": 0.5, '-': 0.4
};

export const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({
  sessions,
  onPracticeKeys
}) => {
  const [mode, setMode] = useState<HeatmapMode>('errors');
  const [sessionRange, setSessionRange] = useState<'all' | '10' | '25'>('all');
  const [selectedKey, setSelectedKey] = useState<string | null>('e');

  // Filter sessions by range
  const targetSessions = useMemo(() => {
    if (sessionRange === '10') return sessions.slice(0, 10);
    if (sessionRange === '25') return sessions.slice(0, 25);
    return sessions;
  }, [sessions, sessionRange]);

  // Aggregate keystroke frequency and errors from historical sessions
  const keyStats = useMemo(() => {
    const frequencyMap: Record<string, number> = {};
    const errorMap: Record<string, number> = {};

    let totalCharacters = 0;
    let totalErrors = 0;

    targetSessions.forEach(session => {
      totalErrors += session.errorCount || 0;
      totalCharacters += session.characterCount || 0;

      // 1. Errors aggregation
      if (session.missedCharacters) {
        Object.entries(session.missedCharacters).forEach(([char, count]) => {
          const lower = char.toLowerCase();
          errorMap[lower] = (errorMap[lower] || 0) + count;
        });
      }

      // 2. Frequency aggregation
      if (session.charFrequency && Object.keys(session.charFrequency).length > 0) {
        Object.entries(session.charFrequency).forEach(([char, count]) => {
          const lower = char.toLowerCase();
          frequencyMap[lower] = (frequencyMap[lower] || 0) + count;
        });
      } else {
        // Fallback: estimate per-key frequency from natural English text distribution & total chars
        const charCount = session.characterCount || 100;
        Object.entries(DEFAULT_CHAR_DISTRIBUTION).forEach(([char, pct]) => {
          const estimated = Math.round((pct / 100) * charCount);
          frequencyMap[char] = (frequencyMap[char] || 0) + estimated;
        });
      }
    });

    // If user has zero sessions, provide helpful default baseline
    if (targetSessions.length === 0) {
      Object.entries(DEFAULT_CHAR_DISTRIBUTION).forEach(([char, pct]) => {
        frequencyMap[char] = Math.round(pct * 5);
        if (['p', 'b', 'q', 'x', ';', 'z'].includes(char)) {
          errorMap[char] = Math.floor(Math.random() * 4) + 2;
        }
      });
    }

    // Calculate maximum values for normalization
    const maxFreq = Math.max(1, ...Object.values(frequencyMap));
    const maxErrors = Math.max(1, ...Object.values(errorMap));

    return {
      frequencyMap,
      errorMap,
      maxFreq,
      maxErrors,
      totalCharacters,
      totalErrors
    };
  }, [targetSessions]);

  // Helper to retrieve detailed key stats
  const getKeyMetrics = (k: string) => {
    const normalized = k.toLowerCase();
    const hits = keyStats.frequencyMap[normalized] || 0;
    const errors = keyStats.errorMap[normalized] || 0;
    const errorRate = hits > 0 ? (errors / hits) : (errors > 0 ? 1 : 0);
    const accuracy = hits > 0 ? Math.max(0, Math.round((1 - errorRate) * 1000) / 10) : (errors > 0 ? 0 : 100);

    return { hits, errors, errorRate, accuracy };
  };

  // Determine key background color depending on heatmap mode
  const getKeyColor = (keyConfig: KeyConfig) => {
    if (keyConfig.isSpecial) {
      return 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700';
    }

    const { hits, errors, accuracy } = getKeyMetrics(keyConfig.key);

    if (mode === 'errors') {
      if (errors === 0) {
        return 'bg-slate-900/70 text-slate-300 border-slate-800/80 hover:border-slate-600';
      }
      const intensity = Math.min(1, errors / (keyStats.maxErrors * 0.75 || 1));
      if (intensity > 0.65) {
        return 'bg-rose-500/80 text-white border-rose-400 shadow-md shadow-rose-500/20';
      }
      if (intensity > 0.35) {
        return 'bg-amber-500/70 text-slate-950 border-amber-400 shadow-sm';
      }
      return 'bg-yellow-500/30 text-yellow-200 border-yellow-500/50';
    }

    if (mode === 'frequency') {
      if (hits === 0) {
        return 'bg-slate-900/70 text-slate-400 border-slate-800/80';
      }
      const intensity = Math.min(1, hits / (keyStats.maxFreq * 0.8 || 1));
      if (intensity > 0.7) {
        return 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-400/20';
      }
      if (intensity > 0.4) {
        return 'bg-emerald-500/70 text-white border-emerald-400';
      }
      if (intensity > 0.2) {
        return 'bg-cyan-600/50 text-cyan-100 border-cyan-500/60';
      }
      return 'bg-blue-900/40 text-blue-200 border-blue-800/60';
    }

    // Accuracy mode
    if (hits === 0 && errors === 0) {
      return 'bg-slate-900/70 text-slate-400 border-slate-800/80';
    }
    if (accuracy >= 95) {
      return 'bg-emerald-500/40 text-emerald-200 border-emerald-500/60';
    }
    if (accuracy >= 85) {
      return 'bg-yellow-500/35 text-yellow-200 border-yellow-500/50';
    }
    return 'bg-rose-500/70 text-white border-rose-400 font-bold';
  };

  // Ranking of most problematic keys
  const problemKeys = useMemo(() => {
    const list = Object.entries(keyStats.errorMap)
      .filter(([k]) => k.length === 1)
      .map(([k, errs]) => {
        const hits = keyStats.frequencyMap[k] || errs;
        const rate = errs / (hits || 1);
        return { key: k, errs, hits, rate };
      })
      .sort((a, b) => b.errs - a.errs);
    return list.slice(0, 6);
  }, [keyStats]);

  // Ranking of top mastered keys
  const masteredKeys = useMemo(() => {
    const list = Object.entries(keyStats.frequencyMap)
      .filter(([k]) => k.length === 1 && k !== ' ')
      .map(([k, hits]) => {
        const errs = keyStats.errorMap[k] || 0;
        const acc = hits > 0 ? (1 - errs / hits) * 100 : 100;
        return { key: k, hits, errs, acc };
      })
      .filter(item => item.hits >= 5)
      .sort((a, b) => b.acc - a.acc || b.hits - a.hits);
    return list.slice(0, 6);
  }, [keyStats]);

  // Selected key metrics
  const activeMetrics = selectedKey ? getKeyMetrics(selectedKey) : null;
  const activeKeyConfig = useMemo(() => {
    if (!selectedKey) return null;
    for (const row of KEYBOARD_ROWS) {
      const found = row.find(k => k.key.toLowerCase() === selectedKey.toLowerCase());
      if (found) return found;
    }
    return null;
  }, [selectedKey]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono mb-2">
            <Activity className="w-3.5 h-3.5" />
            Biometric Keystroke Heatmap
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            Keyboard Frequency & Error Distribution
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing finger pressure, stumbling hot spots, and keystroke precision across {targetSessions.length} sessions
          </p>
        </div>

        {/* View Mode & Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setMode('errors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                mode === 'errors'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Error Hotspots</span>
            </button>

            <button
              onClick={() => setMode('frequency')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                mode === 'frequency'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Key Velocity</span>
            </button>

            <button
              onClick={() => setMode('accuracy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                mode === 'accuracy'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Precision %</span>
            </button>
          </div>

          {/* Sessions Filter */}
          <select
            value={sessionRange}
            onChange={e => setSessionRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Sessions ({sessions.length})</option>
            <option value="25">Recent 25 Tests</option>
            <option value="10">Recent 10 Tests</option>
          </select>
        </div>
      </div>

      {/* Legend & Summary Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            {mode === 'errors' ? 'Error Severity:' : mode === 'frequency' ? 'Keystroke Density:' : 'Key Accuracy:'}
          </span>
          {mode === 'errors' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" /> Clean (0)
              </span>
              <span className="flex items-center gap-1 text-yellow-300">
                <span className="w-3 h-3 rounded bg-yellow-500/50 border border-yellow-400" /> Moderate
              </span>
              <span className="flex items-center gap-1 text-rose-300">
                <span className="w-3 h-3 rounded bg-rose-500 border border-rose-400" /> High Stumble
              </span>
            </div>
          )}
          {mode === 'frequency' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-blue-300">
                <span className="w-3 h-3 rounded bg-blue-900/60" /> Low
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <span className="w-3 h-3 rounded bg-emerald-500/70" /> High
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-3 h-3 rounded bg-amber-400" /> Peak
              </span>
            </div>
          )}
          {mode === 'accuracy' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-3 h-3 rounded bg-emerald-500/50" /> 95%+
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-3 h-3 rounded bg-yellow-500/50" /> 85-94%
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-3 h-3 rounded bg-rose-500/70" /> &lt;85%
              </span>
            </div>
          )}
        </div>

        <div className="text-slate-400 text-[11px]">
          Click any key on the keyboard to inspect detailed analytics & finger guidance
        </div>
      </div>

      {/* Interactive Physical Keyboard Surface */}
      <div className="p-3 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-x-auto">
        <div className="min-w-[680px] space-y-1.5 sm:space-y-2 select-none">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={`row-${rowIdx}`} className="flex gap-1.5 sm:gap-2 justify-center">
              {row.map(k => {
                const isSelected = selectedKey?.toLowerCase() === k.key.toLowerCase();
                const metrics = getKeyMetrics(k.key);
                const colorClass = getKeyColor(k);

                return (
                  <button
                    key={k.key}
                    onClick={() => setSelectedKey(k.key)}
                    className={`
                      ${k.width || 'flex-1 min-w-[32px] sm:min-w-[42px]'}
                      h-10 sm:h-12 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-mono font-bold
                      flex flex-col items-center justify-center relative transition-all duration-150
                      active:scale-95 group
                      ${colorClass}
                      ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10' : ''}
                    `}
                    title={`${k.display}: ${metrics.hits} hits, ${metrics.errors} errors (${metrics.accuracy}% acc)`}
                  >
                    <span>{k.display}</span>

                    {/* Sub-label error or frequency count for standard keys */}
                    {!k.isSpecial && (
                      <span className="text-[9px] opacity-75 font-normal leading-none mt-0.5">
                        {mode === 'errors'
                          ? metrics.errors > 0 ? `${metrics.errors}x` : '—'
                          : mode === 'frequency'
                          ? metrics.hits > 0 ? `${metrics.hits}` : '0'
                          : `${Math.round(metrics.accuracy)}%`}
                      </span>
                    )}

                    {/* Active key glow indicator */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Inspection Card & Top Stumble Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Selected Key Deep-Dive Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono font-black text-2xl flex items-center justify-center shadow">
                {activeKeyConfig ? activeKeyConfig.display : selectedKey?.toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Active Key Inspector
                </span>
                <h4 className="text-base font-bold text-slate-100">
                  Key: &ldquo;{activeKeyConfig?.display || selectedKey}&rdquo;
                </h4>
              </div>
            </div>

            {activeKeyConfig?.finger && (
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Assigned Finger</span>
                <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1 justify-end">
                  <Hand className="w-3 h-3 text-amber-400" />
                  {activeKeyConfig.finger}
                </span>
              </div>
            )}
          </div>

          {activeMetrics && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Keystrokes</span>
                <span className="text-lg font-mono font-black text-slate-100">{activeMetrics.hits}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Misses</span>
                <span className="text-lg font-mono font-black text-rose-400">{activeMetrics.errors}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Precision</span>
                <span className="text-lg font-mono font-black text-emerald-400">{activeMetrics.accuracy}%</span>
              </div>
            </div>
          )}

          {/* Adaptive Training Advice */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 font-mono space-y-1">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Ergonomic Practice Advice:
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {activeMetrics && activeMetrics.errors > 3
                ? `You missed "${selectedKey?.toUpperCase()}" ${activeMetrics.errors} times. Try isolating ${activeKeyConfig?.finger || 'this key'} with targeted drills to anchor muscle memory.`
                : activeMetrics && activeMetrics.hits > 15
                ? `Excellent precision on "${selectedKey?.toUpperCase()}"! Keystroke consistency is high with minimal drift.`
                : `Solid baseline accuracy. Continue regular warmups to reinforce effortless touch typing.`}
            </p>
          </div>
        </div>

        {/* Weakest Keys & Mastered Keys Matrix */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weakest Keys */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Top Problem Keys
              </h5>
              <span className="text-[10px] font-mono text-slate-500">Highest misses</span>
            </div>

            {problemKeys.length === 0 ? (
              <div className="text-xs font-mono text-slate-500 py-6 text-center">
                No error records yet! Flawless precision.
              </div>
            ) : (
              <div className="space-y-1.5">
                {problemKeys.map((item, idx) => (
                  <div
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 w-3">#{idx + 1}</span>
                      <span className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.key.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">{item.hits} strikes</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        {item.errs} errors
                      </span>
                    </div>
                  </div>
                ))}

                {onPracticeKeys && problemKeys.length > 0 && (
                  <button
                    onClick={() => onPracticeKeys(problemKeys.map(p => p.key))}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Practice Weak Keys Drill</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mastered Keys */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Mastered Keys
              </h5>
              <span className="text-[10px] font-mono text-slate-500">High accuracy</span>
            </div>

            {masteredKeys.length === 0 ? (
              <div className="text-xs font-mono text-slate-500 py-6 text-center">
                Complete more sessions to build confidence scores.
              </div>
            ) : (
              <div className="space-y-1.5">
                {masteredKeys.map((item, idx) => (
                  <div
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 w-3">#{idx + 1}</span>
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.key.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">{item.hits} strikes</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {Math.round(item.acc)}% acc
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
