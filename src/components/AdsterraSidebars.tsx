import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export const ADSTERRA_SMART_LINK =
  'https://www.profitableratecpmnetwork.com/b2fsbf2ezy?key=f69668c3fadb6abd07c344b047348282';

interface LiveAdContainerProps {
  side: 'left' | 'right';
}

const LiveAdContainer: React.FC<LiveAdContainerProps> = ({ side }) => {
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setKey(k => k + 1);
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(ADSTERRA_SMART_LINK, '_blank', 'noopener,noreferrer');
  };

  const isLeft = side === 'left';
  const borderColor = isLeft
    ? 'border-amber-500/40 hover:border-amber-400/70'
    : 'border-cyan-500/40 hover:border-cyan-400/70';
  const accentBadge = isLeft
    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
    : 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30';
  const labelText = isLeft ? 'Sponsored Partner #1' : 'Sponsored Partner #2';

  return (
    <aside
      aria-label={`Sponsored Live Content ${side}`}
      className="hidden xl:flex flex-1 min-w-[240px] max-w-[360px] 2xl:max-w-[420px] sticky top-20 h-[calc(100vh-6rem)] shrink-0 self-start"
    >
      <div className={`w-full h-full rounded-3xl bg-slate-900/95 border-2 ${borderColor} p-2.5 sm:p-3 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-200`}>
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-800/90 text-xs px-1">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${accentBadge} border`}>
              AD
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-300">
              {labelText}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              title="Refresh smart offer"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleOpenExternal}
              title="Open offer in new tab"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Original Smart Link Frame */}
        <div className="relative flex-1 w-full h-full min-h-[300px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-inner">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-slate-400 font-mono text-xs gap-2">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              <span>Loading partner offer...</span>
            </div>
          )}

          <iframe
            key={key}
            src={ADSTERRA_SMART_LINK}
            title={`Adsterra Smart Offer ${side}`}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 rounded-2xl bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            loading="lazy"
          />
        </div>

        {/* Bottom Status Strip */}
        <div className="pt-2 mt-1.5 flex items-center justify-between px-1 text-[10px] font-mono text-slate-400 border-t border-slate-800/60">
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Live Smart Link</span>
          </div>
          <button
            onClick={handleOpenExternal}
            className="hover:text-amber-400 flex items-center gap-1 transition-colors text-slate-400"
          >
            <span>Open Link</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export const LeftAdsterraSidebar: React.FC = () => {
  return <LiveAdContainer side="left" />;
};

export const RightAdsterraSidebar: React.FC = () => {
  return <LiveAdContainer side="right" />;
};

export const MobileAdsterraBanner: React.FC = () => {
  const handleOpen = () => {
    window.open(ADSTERRA_SMART_LINK, '_blank', 'noopener,noreferrer');
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
            <p className="text-xs font-bold text-slate-100">Sponsored Partner Deal</p>
            <p className="text-[11px] text-slate-400">Tap to unlock exclusive partner offer</p>
          </div>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shrink-0 shadow">
          <span>Explore</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
