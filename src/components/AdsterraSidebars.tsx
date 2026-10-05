import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Sparkles, Flame, Gift, TrendingUp, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export const ADSTERRA_DIRECT_LINKS = [
  'https://www.profitableratecpmnetwork.com/cy6ezs34?key=f0221c22f211ad051de69df8d22e774e',
  'https://www.profitableratecpmnetwork.com/pguwke89d?key=793e74c9b2ac13a0ba74d1525169d303',
  'https://www.profitableratecpmnetwork.com/re9d49uh?key=310755648ced612e2779ab99f085b09b'
];

interface AdCreative {
  title: string;
  badge: string;
  tagline: string;
  description: string;
  ctaText: string;
  highlights: string[];
  gradientBg: string;
  borderStyle: string;
  glowColor: string;
  buttonColor: string;
  iconColor: string;
}

const CREATIVES: AdCreative[] = [
  {
    title: 'Special Rewards & Bonus Deals',
    badge: 'Trending Offer',
    tagline: 'Exclusive partner rewards unlocked for active typists',
    description: 'Explore top-rated online offers, bonuses, and special rewards verified by our global network.',
    ctaText: 'Claim Your Reward',
    highlights: ['Instant Access Link', 'Verified Safe & Direct', 'No Registration Needed', 'Updated Daily Deals'],
    gradientBg: 'from-amber-950/40 via-yellow-950/20 to-slate-900/90',
    borderStyle: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'bg-amber-500/15',
    buttonColor: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20',
    iconColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30'
  },
  {
    title: 'Top Rated Digital Offers',
    badge: 'Popular Choice',
    tagline: 'High-speed tools, trending games & exclusive gifts',
    description: 'Discover trending entertainment, software perks, and popular high-paying web deals today.',
    ctaText: 'Explore Offers Now',
    highlights: ['Exclusive Partner Access', 'Top Ranked Worldwide', 'Zero Cooldown Period', 'Instant Fast Loading'],
    gradientBg: 'from-emerald-950/40 via-teal-950/20 to-slate-900/90',
    borderStyle: 'border-emerald-500/40 hover:border-emerald-400',
    glowColor: 'bg-emerald-500/15',
    buttonColor: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-400/20',
    iconColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
  },
  {
    title: 'Exclusive Partner Access',
    badge: 'Featured Network',
    tagline: 'Unlock premium digital content and sponsored prizes',
    description: 'Browse the latest curated promotions and special featured destination links from Adsterra.',
    ctaText: 'Visit & Discover',
    highlights: ['Special Curated Offers', 'High Conversion Rates', 'Multi-Platform Ready', '100% Free Access'],
    gradientBg: 'from-cyan-950/40 via-blue-950/20 to-slate-900/90',
    borderStyle: 'border-cyan-500/40 hover:border-cyan-400',
    glowColor: 'bg-cyan-500/15',
    buttonColor: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/20',
    iconColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
  }
];

export const LeftAdsterraSidebar: React.FC = () => {
  const [linkIdx, setLinkIdx] = useState(() => Math.floor(Math.random() * ADSTERRA_DIRECT_LINKS.length));
  const [creativeIdx, setCreativeIdx] = useState(0);

  const rotate = useCallback(() => {
    setLinkIdx(prev => (prev + 1 + Math.floor(Math.random() * 2)) % ADSTERRA_DIRECT_LINKS.length);
    setCreativeIdx(prev => (prev + 1) % CREATIVES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(rotate, 15000);
    return () => clearInterval(timer);
  }, [rotate]);

  const handleOpen = () => {
    window.open(ADSTERRA_DIRECT_LINKS[linkIdx], '_blank', 'noopener,noreferrer');
    rotate();
  };

  const creative = CREATIVES[creativeIdx];

  return (
    <aside
      aria-label="Sponsored Content Left"
      className="hidden xl:flex flex-1 min-w-[220px] max-w-[360px] 2xl:max-w-[420px] sticky top-20 h-[calc(100vh-6rem)] shrink-0 self-start"
    >
      <div
        onClick={handleOpen}
        className={`group w-full h-full rounded-3xl bg-gradient-to-b ${creative.gradientBg} border-2 ${creative.borderStyle} p-4 sm:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl select-none relative overflow-hidden`}
      >
        {/* Ambient Top Glow */}
        <div className={`absolute -top-12 -left-12 w-48 h-48 ${creative.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform`} />

        {/* Top Header */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Sponsored Partner
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
              AD
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono text-amber-400 font-semibold shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{creative.badge}</span>
          </div>

          <h3 className="text-base 2xl:text-lg font-black text-slate-100 group-hover:text-amber-400 transition-colors leading-tight">
            {creative.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {creative.tagline}
          </p>
        </div>

        {/* Center Visual Feature & Highlights */}
        <div className="my-auto py-3 space-y-4 relative z-10">
          <div className="flex justify-center">
            <div className={`w-16 h-16 2xl:w-20 2xl:h-20 rounded-2xl ${creative.iconColor} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
              <Flame className="w-9 h-9 2xl:w-11 2xl:h-11" />
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {creative.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center line-clamp-2 px-1">
            {creative.description}
          </p>
        </div>

        {/* Bottom CTA Button */}
        <div className="relative z-10 space-y-2">
          <button
            onClick={handleOpen}
            className={`w-full py-3.5 px-4 rounded-2xl ${creative.buttonColor} font-black font-mono text-xs 2xl:text-sm flex items-center justify-center gap-2 shadow-lg transition-all group-hover:scale-105 active:scale-95`}
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
            <span>Adsterra Direct Link</span>
            <span className="text-emerald-400 flex items-center gap-1">● Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const RightAdsterraSidebar: React.FC = () => {
  const [linkIdx, setLinkIdx] = useState(() => (Math.floor(Math.random() * 2) + 1) % ADSTERRA_DIRECT_LINKS.length);
  const [creativeIdx, setCreativeIdx] = useState(1);

  const rotate = useCallback(() => {
    setLinkIdx(prev => (prev + 1 + Math.floor(Math.random() * 2)) % ADSTERRA_DIRECT_LINKS.length);
    setCreativeIdx(prev => (prev + 1) % CREATIVES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(rotate, 15000);
    return () => clearInterval(timer);
  }, [rotate]);

  const handleOpen = () => {
    window.open(ADSTERRA_DIRECT_LINKS[linkIdx], '_blank', 'noopener,noreferrer');
    rotate();
  };

  const creative = CREATIVES[creativeIdx];

  return (
    <aside
      aria-label="Sponsored Content Right"
      className="hidden xl:flex flex-1 min-w-[220px] max-w-[360px] 2xl:max-w-[420px] sticky top-20 h-[calc(100vh-6rem)] shrink-0 self-start"
    >
      <div
        onClick={handleOpen}
        className={`group w-full h-full rounded-3xl bg-gradient-to-b ${creative.gradientBg} border-2 ${creative.borderStyle} p-4 sm:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl select-none relative overflow-hidden`}
      >
        {/* Ambient Top Glow */}
        <div className={`absolute -top-12 -right-12 w-48 h-48 ${creative.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform`} />

        {/* Top Header */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Sponsored Partner
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              AD
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono text-cyan-400 font-semibold shadow">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>{creative.badge}</span>
          </div>

          <h3 className="text-base 2xl:text-lg font-black text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
            {creative.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {creative.tagline}
          </p>
        </div>

        {/* Center Visual Feature & Highlights */}
        <div className="my-auto py-3 space-y-4 relative z-10">
          <div className="flex justify-center">
            <div className={`w-16 h-16 2xl:w-20 2xl:h-20 rounded-2xl ${creative.iconColor} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
              <Gift className="w-9 h-9 2xl:w-11 2xl:h-11" />
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {creative.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center line-clamp-2 px-1">
            {creative.description}
          </p>
        </div>

        {/* Bottom CTA Button */}
        <div className="relative z-10 space-y-2">
          <button
            onClick={handleOpen}
            className={`w-full py-3.5 px-4 rounded-2xl ${creative.buttonColor} font-black font-mono text-xs 2xl:text-sm flex items-center justify-center gap-2 shadow-lg transition-all group-hover:scale-105 active:scale-95`}
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
            <span>Adsterra Direct Link</span>
            <span className="text-cyan-400 flex items-center gap-1">● Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const MobileAdsterraBanner: React.FC = () => {
  const [linkIdx, setLinkIdx] = useState(() => Math.floor(Math.random() * ADSTERRA_DIRECT_LINKS.length));

  const handleOpen = () => {
    window.open(ADSTERRA_DIRECT_LINKS[linkIdx], '_blank', 'noopener,noreferrer');
    setLinkIdx(prev => (prev + 1) % ADSTERRA_DIRECT_LINKS.length);
  };

  return (
    <div className="xl:hidden w-full max-w-4xl mx-auto px-4 my-6">
      <div
        onClick={handleOpen}
        className="p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between gap-3 shadow-xl cursor-pointer transition-all hover:bg-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-400/20 text-amber-300">
            AD
          </span>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-100">Special Partner Offers & Rewards</p>
            <p className="text-[11px] text-slate-400">Exclusive bonuses unlocked for speed typists</p>
          </div>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shrink-0 shadow">
          <span>Claim</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
