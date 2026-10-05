import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Sparkles, Zap, Gift, Flame, TrendingUp } from 'lucide-react';

export const ADSTERRA_DIRECT_LINKS = [
  'https://www.profitableratecpmnetwork.com/cy6ezs34?key=f0221c22f211ad051de69df8d22e774e',
  'https://www.profitableratecpmnetwork.com/pguwke89d?key=793e74c9b2ac13a0ba74d1525169d303',
  'https://www.profitableratecpmnetwork.com/re9d49uh?key=310755648ced612e2779ab99f085b09b'
];

interface AdCreative {
  title: string;
  subtitle: string;
  badge: string;
  tag: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
}

const CREATIVES: AdCreative[] = [
  {
    title: 'Special Rewards & Bonus',
    subtitle: 'Exclusive partner offers unlocked for top speed typists',
    badge: 'Trending Now',
    tag: 'Claim Reward',
    accentColor: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'bg-amber-400/10'
  },
  {
    title: 'Top Rated Offers',
    subtitle: 'High speed tools, deals & exclusive digital gifts',
    badge: 'Popular',
    tag: 'Explore Offer',
    accentColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    glowColor: 'bg-emerald-400/10'
  },
  {
    title: 'Exclusive Access',
    subtitle: 'Discover trending apps, games & premium deals today',
    badge: 'Featured',
    tag: 'Visit Now',
    accentColor: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    glowColor: 'bg-purple-400/10'
  }
];

export const AdsterraSidebars: React.FC = () => {
  const [leftIndex, setLeftIndex] = useState(() => Math.floor(Math.random() * ADSTERRA_DIRECT_LINKS.length));
  const [rightIndex, setRightIndex] = useState(() => {
    const remaining = [0, 1, 2].filter(i => i !== Math.floor(Math.random() * ADSTERRA_DIRECT_LINKS.length));
    return remaining[Math.floor(Math.random() * remaining.length)] || 1;
  });

  const [leftCreativeIdx, setLeftCreativeIdx] = useState(0);
  const [rightCreativeIdx, setRightCreativeIdx] = useState(1);

  // Periodically rotate links and creative messages randomly every 15 seconds
  const rotateLinks = useCallback(() => {
    setLeftIndex(prev => {
      const next = (prev + 1 + Math.floor(Math.random() * 2)) % ADSTERRA_DIRECT_LINKS.length;
      return next;
    });
    setRightIndex(prev => {
      const next = (prev + 1 + Math.floor(Math.random() * 2)) % ADSTERRA_DIRECT_LINKS.length;
      return next;
    });
    setLeftCreativeIdx(prev => (prev + 1) % CREATIVES.length);
    setRightCreativeIdx(prev => (prev + 2) % CREATIVES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(rotateLinks, 16000);
    return () => clearInterval(timer);
  }, [rotateLinks]);

  const handleOpenAd = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // Rotate to next random link immediately upon click
    rotateLinks();
  };

  const leftCreative = CREATIVES[leftCreativeIdx];
  const rightCreative = CREATIVES[rightCreativeIdx];

  return (
    <>
      {/* Left Sidebar Ad (Desktop XL screens - exactly matching the left red box) */}
      <aside
        aria-label="Sponsored Partner Content"
        className="hidden xl:flex fixed left-3 2xl:left-6 top-24 bottom-6 w-36 2xl:w-44 z-20 flex-col justify-between"
      >
        <div
          onClick={() => handleOpenAd(ADSTERRA_DIRECT_LINKS[leftIndex])}
          className={`group h-full w-full rounded-2xl bg-gradient-to-b ${leftCreative.accentColor} bg-slate-900/90 border ${leftCreative.borderColor} p-3.5 flex flex-col justify-between shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/10 select-none overflow-hidden relative`}
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-10 -left-10 w-28 h-28 ${leftCreative.glowColor} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`} />

          {/* Top Header */}
          <div className="space-y-3 relative z-10 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                Sponsored
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300">
                AD
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-[10px] text-amber-400 font-mono">
              <Sparkles className="w-3 h-3" />
              <span>{leftCreative.badge}</span>
            </div>

            <h4 className="text-xs 2xl:text-sm font-extrabold text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
              {leftCreative.title}
            </h4>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {leftCreative.subtitle}
            </p>
          </div>

          {/* Center Graphic */}
          <div className="my-auto py-4 flex flex-col items-center justify-center relative z-10">
            <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-lg shadow-amber-400/5">
              <Flame className="w-7 h-7 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2 font-medium">
              Click to Open
            </span>
          </div>

          {/* Bottom Action Button */}
          <div className="relative z-10 space-y-2">
            <div className="w-full py-2.5 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono text-[11px] 2xl:text-xs flex items-center justify-center gap-1.5 shadow-md transition-all group-hover:shadow-amber-400/30 active:scale-95">
              <span>{leftCreative.tag}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </div>

            <div className="text-[9px] text-center text-slate-400 font-mono">
              Adsterra Direct
            </div>
          </div>
        </div>
      </aside>

      {/* Right Sidebar Ad (Desktop XL screens - exactly matching the right red box) */}
      <aside
        aria-label="Sponsored Partner Content"
        className="hidden xl:flex fixed right-3 2xl:right-6 top-24 bottom-6 w-36 2xl:w-44 z-20 flex-col justify-between"
      >
        <div
          onClick={() => handleOpenAd(ADSTERRA_DIRECT_LINKS[rightIndex])}
          className={`group h-full w-full rounded-2xl bg-gradient-to-b ${rightCreative.accentColor} bg-slate-900/90 border ${rightCreative.borderColor} p-3.5 flex flex-col justify-between shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/10 select-none overflow-hidden relative`}
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-10 -right-10 w-28 h-28 ${rightCreative.glowColor} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`} />

          {/* Top Header */}
          <div className="space-y-3 relative z-10 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                Sponsored
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-400/20 text-cyan-300">
                AD
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-[10px] text-cyan-400 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>{rightCreative.badge}</span>
            </div>

            <h4 className="text-xs 2xl:text-sm font-extrabold text-slate-100 group-hover:text-cyan-400 transition-colors leading-snug">
              {rightCreative.title}
            </h4>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {rightCreative.subtitle}
            </p>
          </div>

          {/* Center Graphic */}
          <div className="my-auto py-4 flex flex-col items-center justify-center relative z-10">
            <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300 shadow-lg shadow-cyan-400/5">
              <Gift className="w-7 h-7 2xl:w-8 2xl:h-8" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2 font-medium">
              Click to Open
            </span>
          </div>

          {/* Bottom Action Button */}
          <div className="relative z-10 space-y-2">
            <div className="w-full py-2.5 px-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-[11px] 2xl:text-xs flex items-center justify-center gap-1.5 shadow-md transition-all group-hover:shadow-cyan-400/30 active:scale-95">
              <span>{rightCreative.tag}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </div>

            <div className="text-[9px] text-center text-slate-400 font-mono">
              Adsterra Direct
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile/Tablet Sponsored Banner */}
      <div className="xl:hidden w-full max-w-4xl mx-auto px-4 mt-6">
        <div
          onClick={() => handleOpenAd(ADSTERRA_DIRECT_LINKS[leftIndex])}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 flex items-center justify-between gap-3 shadow-lg cursor-pointer transition-all hover:bg-slate-800/80"
        >
          <div className="flex items-center gap-2.5">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300">
              AD
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-100 line-clamp-1">{leftCreative.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-1">{leftCreative.subtitle}</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1 shrink-0">
            <span>{leftCreative.tag}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </>
  );
};
