import { Badge, TypingSession } from '../types';

export const ALL_BADGES: Badge[] = [
  // --- SPEED MILESTONES ---
  {
    id: 'speed_rookie_40',
    name: 'Keyboard Cadet',
    description: 'Surpass 40 WPM in any typing test.',
    tier: 'bronze',
    category: 'speed',
    icon: 'Sparkles',
    targetMetric: 'wpm',
    targetValue: 40,
    points: 10
  },
  {
    id: 'speed_cruiser_60',
    name: 'Roadrunner 60',
    description: 'Reach a swift 60 WPM milestone.',
    tier: 'bronze',
    category: 'speed',
    icon: 'Zap',
    targetMetric: 'wpm',
    targetValue: 60,
    points: 25
  },
  {
    id: 'speed_swift_80',
    name: 'Velocity Surge',
    description: 'Reach 80 WPM with consistent rhythm.',
    tier: 'silver',
    category: 'speed',
    icon: 'Flame',
    targetMetric: 'wpm',
    targetValue: 80,
    points: 50
  },
  {
    id: 'speed_century_100',
    name: 'Century Club (100 WPM)',
    description: 'Break the prestigious triple-digit 100 WPM milestone!',
    tier: 'gold',
    category: 'speed',
    icon: 'Trophy',
    targetMetric: 'wpm',
    targetValue: 100,
    points: 100
  },
  {
    id: 'speed_titan_120',
    name: 'Velocity Titan (120 WPM)',
    description: 'Blast past 120 WPM into the top 2% of global typists.',
    tier: 'diamond',
    category: 'speed',
    icon: 'Crown',
    targetMetric: 'wpm',
    targetValue: 120,
    points: 200
  },
  {
    id: 'speed_mythic_150',
    name: 'Godlike Fingers (150 WPM)',
    description: 'Achieve legendary 150+ WPM typing velocity.',
    tier: 'mythic',
    category: 'speed',
    icon: 'Award',
    targetMetric: 'wpm',
    targetValue: 150,
    points: 500
  },

  // --- VOLUME & ENDURANCE MILESTONES ---
  {
    id: 'vol_starter_100',
    name: 'First Steps',
    description: 'Type a total of 100 words across sessions.',
    tier: 'bronze',
    category: 'volume',
    icon: 'BookOpen',
    targetMetric: 'totalWords',
    targetValue: 100,
    points: 10
  },
  {
    id: 'vol_warmup_500',
    name: 'Warmup Scribe',
    description: 'Accumulate 500 total words typed.',
    tier: 'bronze',
    category: 'volume',
    icon: 'Feather',
    targetMetric: 'totalWords',
    targetValue: 500,
    points: 25
  },
  {
    id: 'vol_wordsmith_1000',
    name: 'Wordsmith 1K (1,000 Words)',
    description: 'Cross the milestone of 1,000 total words typed!',
    tier: 'silver',
    category: 'volume',
    icon: 'Scroll',
    targetMetric: 'totalWords',
    targetValue: 1000,
    points: 75
  },
  {
    id: 'vol_scribe_5000',
    name: 'Novel Chapter (5,000 Words)',
    description: 'Type over 5,000 total words into KeyPulse.',
    tier: 'gold',
    category: 'volume',
    icon: 'BookMarked',
    targetMetric: 'totalWords',
    targetValue: 5000,
    points: 150
  },
  {
    id: 'vol_marathon_10000',
    name: 'Keystroke Marathon (10K Words)',
    description: 'Conquer the monumental 10,000 total words milestone.',
    tier: 'diamond',
    category: 'volume',
    icon: 'Target',
    targetMetric: 'totalWords',
    targetValue: 10000,
    points: 300
  },

  // --- EXPERIENCE & TEST COUNT MILESTONES ---
  {
    id: 'test_first',
    name: 'Initiation Key',
    description: 'Complete your first typing session.',
    tier: 'bronze',
    category: 'volume',
    icon: 'CheckCircle2',
    targetMetric: 'testsCompleted',
    targetValue: 1,
    points: 10
  },
  {
    id: 'test_ten',
    name: 'Tenacious Typist',
    description: 'Complete 10 total typing sessions.',
    tier: 'silver',
    category: 'volume',
    icon: 'Layers',
    targetMetric: 'testsCompleted',
    targetValue: 10,
    points: 40
  },
  {
    id: 'test_fifty',
    name: 'Half Century Club',
    description: 'Complete 50 comprehensive typing tests.',
    tier: 'gold',
    category: 'volume',
    icon: 'Shield',
    targetMetric: 'testsCompleted',
    targetValue: 50,
    points: 120
  },

  // --- ACCURACY & PRECISION MILESTONES ---
  {
    id: 'acc_flawless_100',
    name: 'Laser Precision (100% Acc)',
    description: 'Finish a test with flawless 100% accuracy (min 20 words).',
    tier: 'gold',
    category: 'accuracy',
    icon: 'Crosshair',
    targetMetric: 'special',
    targetValue: 100,
    points: 100
  },
  {
    id: 'acc_disciplined_98',
    name: 'Zen Master',
    description: 'Finish a 60s or longer test with at least 98% accuracy.',
    tier: 'silver',
    category: 'accuracy',
    icon: 'Compass',
    targetMetric: 'special',
    targetValue: 98,
    points: 60
  },

  // --- SPECIAL & DISCIPLINE MILESTONES ---
  {
    id: 'spec_code_master',
    name: 'Silicon Hacker',
    description: 'Complete a Code snippet test at 70+ WPM.',
    tier: 'gold',
    category: 'special',
    icon: 'Code2',
    targetMetric: 'special',
    targetValue: 70,
    points: 80
  },
  {
    id: 'spec_quote_sage',
    name: 'Philosopher Scribe',
    description: 'Complete a Famous Quote test at 80+ WPM.',
    tier: 'silver',
    category: 'special',
    icon: 'Quote',
    targetMetric: 'special',
    targetValue: 80,
    points: 60
  },
  {
    id: 'spec_sprint_100',
    name: 'Lightning Bolt',
    description: 'Score 100+ WPM in a 15-second Sprint.',
    tier: 'gold',
    category: 'special',
    icon: 'Zap',
    targetMetric: 'special',
    targetValue: 100,
    points: 90
  }
];

export const BADGE_TIER_CONFIG = {
  bronze: {
    label: 'Bronze',
    border: 'border-amber-700/50',
    bg: 'bg-gradient-to-br from-amber-950/40 via-stone-900 to-slate-900',
    badgeBg: 'bg-amber-800/30 text-amber-500',
    textColor: 'text-amber-500',
    glow: 'shadow-amber-900/20'
  },
  silver: {
    label: 'Silver',
    border: 'border-slate-500/50',
    bg: 'bg-gradient-to-br from-slate-800/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-slate-700/40 text-slate-200',
    textColor: 'text-slate-300',
    glow: 'shadow-slate-500/20'
  },
  gold: {
    label: 'Gold',
    border: 'border-amber-400/60',
    bg: 'bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950',
    badgeBg: 'bg-amber-400/20 text-amber-300',
    textColor: 'text-amber-400',
    glow: 'shadow-amber-500/30'
  },
  diamond: {
    label: 'Diamond',
    border: 'border-cyan-400/60',
    bg: 'bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-950',
    badgeBg: 'bg-cyan-400/20 text-cyan-300',
    textColor: 'text-cyan-400',
    glow: 'shadow-cyan-500/30'
  },
  mythic: {
    label: 'Mythic',
    border: 'border-purple-400/70',
    bg: 'bg-gradient-to-br from-purple-950/60 via-fuchsia-950/30 to-slate-950',
    badgeBg: 'bg-purple-400/25 text-purple-300',
    textColor: 'text-purple-300',
    glow: 'shadow-purple-500/40'
  }
};

/**
 * Calculates total words typed across all sessions
 */
export function calculateTotalWordsTyped(sessions: TypingSession[]): number {
  return sessions.reduce((sum, s) => {
    // Standard approximation: characters typed / 5
    const words = s.characterCount ? Math.round(s.characterCount / 5) : 0;
    return sum + words;
  }, 0);
}

/**
 * Evaluates all badges against user sessions and returns unlocked badges + newly unlocked
 */
export function evaluateBadges(
  sessions: TypingSession[],
  previouslyUnlockedIds: string[] = []
): {
  unlockedBadgeIds: string[];
  newlyUnlockedBadges: Badge[];
  totalPoints: number;
  totalWords: number;
} {
  const totalWords = calculateTotalWordsTyped(sessions);
  const testsCompleted = sessions.length;
  const bestWpm = sessions.reduce((max, s) => Math.max(max, s.wpm), 0);

  const unlockedIds = new Set<string>();

  ALL_BADGES.forEach(badge => {
    let unlocked = false;

    switch (badge.id) {
      // Speed badges
      case 'speed_rookie_40':
        unlocked = bestWpm >= 40;
        break;
      case 'speed_cruiser_60':
        unlocked = bestWpm >= 60;
        break;
      case 'speed_swift_80':
        unlocked = bestWpm >= 80;
        break;
      case 'speed_century_100':
        unlocked = bestWpm >= 100;
        break;
      case 'speed_titan_120':
        unlocked = bestWpm >= 120;
        break;
      case 'speed_mythic_150':
        unlocked = bestWpm >= 150;
        break;

      // Volume badges
      case 'vol_starter_100':
        unlocked = totalWords >= 100;
        break;
      case 'vol_warmup_500':
        unlocked = totalWords >= 500;
        break;
      case 'vol_wordsmith_1000':
        unlocked = totalWords >= 1000;
        break;
      case 'vol_scribe_5000':
        unlocked = totalWords >= 5000;
        break;
      case 'vol_marathon_10000':
        unlocked = totalWords >= 10000;
        break;

      // Tests completed
      case 'test_first':
        unlocked = testsCompleted >= 1;
        break;
      case 'test_ten':
        unlocked = testsCompleted >= 10;
        break;
      case 'test_fifty':
        unlocked = testsCompleted >= 50;
        break;

      // Accuracy & Special
      case 'acc_flawless_100':
        unlocked = sessions.some(s => s.accuracy === 100 && (s.characterCount >= 80 || s.duration >= 15));
        break;
      case 'acc_disciplined_98':
        unlocked = sessions.some(s => s.accuracy >= 98 && s.duration >= 60);
        break;
      case 'spec_code_master':
        unlocked = sessions.some(s => s.category === 'code' && s.wpm >= 70);
        break;
      case 'spec_quote_sage':
        unlocked = sessions.some(s => (s.category === 'quotes' || s.mode === 'quote') && s.wpm >= 80);
        break;
      case 'spec_sprint_100':
        unlocked = sessions.some(s => s.mode === '15s' && s.wpm >= 100);
        break;

      default:
        if (badge.targetMetric === 'wpm') unlocked = bestWpm >= badge.targetValue;
        else if (badge.targetMetric === 'totalWords') unlocked = totalWords >= badge.targetValue;
        else if (badge.targetMetric === 'testsCompleted') unlocked = testsCompleted >= badge.targetValue;
        break;
    }

    if (unlocked) {
      unlockedIds.add(badge.id);
    }
  });

  const unlockedBadgeIds = Array.from(unlockedIds);
  const newlyUnlockedBadges = ALL_BADGES.filter(
    b => unlockedIds.has(b.id) && !previouslyUnlockedIds.includes(b.id)
  );

  const totalPoints = ALL_BADGES.filter(b => unlockedIds.has(b.id)).reduce(
    (sum, b) => sum + b.points,
    0
  );

  return {
    unlockedBadgeIds,
    newlyUnlockedBadges,
    totalPoints,
    totalWords
  };
}

/**
 * Computes granular numerical progress towards unlocking a badge
 */
export function getBadgeProgress(
  badge: Badge,
  sessions: TypingSession[],
  totalWords: number,
  testsCompleted: number,
  bestWpm: number
): { current: number; target: number; percent: number; isUnlocked: boolean } {
  let current = 0;
  let target = badge.targetValue;

  switch (badge.targetMetric) {
    case 'wpm':
      current = bestWpm;
      break;
    case 'totalWords':
      current = totalWords;
      break;
    case 'testsCompleted':
      current = testsCompleted;
      break;
    case 'special':
      if (badge.id === 'acc_flawless_100') {
        current = sessions.some(s => s.accuracy === 100 && s.characterCount >= 80) ? 100 : Math.max(...sessions.map(s => s.accuracy), 0);
      } else if (badge.id === 'acc_disciplined_98') {
        const sixtySec = sessions.filter(s => s.duration >= 60);
        current = sixtySec.length > 0 ? Math.max(...sixtySec.map(s => s.accuracy)) : 0;
      } else if (badge.id === 'spec_code_master') {
        const codeTests = sessions.filter(s => s.category === 'code');
        current = codeTests.length > 0 ? Math.max(...codeTests.map(s => s.wpm)) : 0;
      } else if (badge.id === 'spec_quote_sage') {
        const quoteTests = sessions.filter(s => s.category === 'quotes' || s.mode === 'quote');
        current = quoteTests.length > 0 ? Math.max(...quoteTests.map(s => s.wpm)) : 0;
      } else if (badge.id === 'spec_sprint_100') {
        const sprintTests = sessions.filter(s => s.mode === '15s');
        current = sprintTests.length > 0 ? Math.max(...sprintTests.map(s => s.wpm)) : 0;
      }
      break;
    default:
      break;
  }

  const percent = Math.min(100, Math.round((current / Math.max(1, target)) * 100));
  const isUnlocked = percent >= 100;

  return { current, target, percent, isUnlocked };
}
