import { ThemeConfig, ThemeName } from '../types';

export const THEMES: Record<ThemeName, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Cyber',
    isDark: true,
    bg: 'bg-slate-950',
    cardBg: 'bg-slate-900/80',
    textMain: 'text-slate-100',
    textMuted: 'text-slate-500',
    accent: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    accentText: 'text-amber-400',
    correct: 'text-emerald-400',
    incorrect: 'text-rose-500 underline decoration-rose-500/80 decoration-wavy',
    caret: 'bg-amber-400'
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon Gray',
    isDark: true,
    bg: 'bg-neutral-950',
    cardBg: 'bg-neutral-900/80',
    textMain: 'text-neutral-100',
    textMuted: 'text-neutral-500',
    accent: 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950',
    accentText: 'text-cyan-400',
    correct: 'text-neutral-200',
    incorrect: 'text-red-400 underline decoration-red-400',
    caret: 'bg-cyan-400'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Terminal',
    isDark: true,
    bg: 'bg-black',
    cardBg: 'bg-emerald-950/20',
    textMain: 'text-emerald-400',
    textMuted: 'text-emerald-800',
    accent: 'bg-emerald-500 hover:bg-emerald-400 text-black',
    accentText: 'text-emerald-400',
    correct: 'text-emerald-300',
    incorrect: 'text-red-500 underline decoration-red-500',
    caret: 'bg-emerald-400'
  },
  amber: {
    id: 'amber',
    name: 'Amber Glow',
    isDark: true,
    bg: 'bg-stone-950',
    cardBg: 'bg-stone-900/80',
    textMain: 'text-amber-100',
    textMuted: 'text-stone-500',
    accent: 'bg-amber-500 hover:bg-amber-400 text-stone-950',
    accentText: 'text-amber-500',
    correct: 'text-amber-200',
    incorrect: 'text-rose-400 underline decoration-rose-400',
    caret: 'bg-amber-500'
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula Purple',
    isDark: true,
    bg: 'bg-[#1e1e2e]',
    cardBg: 'bg-[#252538]',
    textMain: 'text-[#cdd6f4]',
    textMuted: 'text-[#6c7086]',
    accent: 'bg-[#f5c2e7] hover:bg-[#f5bde6] text-[#11111b]',
    accentText: 'text-[#f5c2e7]',
    correct: 'text-[#a6e3a1]',
    incorrect: 'text-[#f38ba8] underline decoration-[#f38ba8]',
    caret: 'bg-[#f5c2e7]'
  },
  paper: {
    id: 'paper',
    name: 'Minimal Paper',
    isDark: false,
    bg: 'bg-stone-50',
    cardBg: 'bg-white shadow-sm border border-stone-200',
    textMain: 'text-stone-900',
    textMuted: 'text-stone-400',
    accent: 'bg-stone-900 hover:bg-stone-800 text-stone-50',
    accentText: 'text-stone-900',
    correct: 'text-stone-900',
    incorrect: 'text-rose-600 underline decoration-rose-500',
    caret: 'bg-stone-900'
  }
};
