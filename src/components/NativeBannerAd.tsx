import React, { useEffect, useRef } from 'react';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export const NATIVE_BANNER_SCRIPT_SRC =
  'https://pl31689374.profitableratecpmnetwork.com/c54e081f07e280d291d57c9ef613cbb9/invoke.js';
export const NATIVE_BANNER_CONTAINER_ID = 'container-c54e081f07e280d291d57c9ef613cbb9';
export const SMART_LINK_URL =
  'https://www.profitableratecpmnetwork.com/b2fsbf2ezy?key=f69668c3fadb6abd07c344b047348282';

export const NativeBannerAd: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically append script if not already loaded into container
    const existing = containerRef.current.querySelector(`script[src="${NATIVE_BANNER_SCRIPT_SRC}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = NATIVE_BANNER_SCRIPT_SRC;
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <section
      aria-label="Sponsored Native Recommendations"
      className="w-full max-w-4xl 2xl:max-w-5xl mx-auto my-6 px-2 sm:px-4"
    >
      <div className="rounded-3xl bg-slate-900/90 border-2 border-amber-500/30 hover:border-amber-400/60 transition-all p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Strip */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/90 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
              AD
            </span>
            <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Sponsored Partner Recommendations
            </span>
          </div>

          <a
            href={SMART_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors group"
          >
            <Sparkles className="w-3 h-3 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Explore Partner Offers</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Adsterra Native Banner Target Container */}
        <div ref={containerRef} className="w-full min-h-[90px] flex items-center justify-center relative z-10">
          <div id={NATIVE_BANNER_CONTAINER_ID} className="w-full"></div>
        </div>

        {/* Bottom Partner Strip */}
        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Adsterra Native Ad Network</span>
          </div>
          <a
            href={SMART_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors"
          >
            Direct Partner Link ↗
          </a>
        </div>
      </div>
    </section>
  );
};
