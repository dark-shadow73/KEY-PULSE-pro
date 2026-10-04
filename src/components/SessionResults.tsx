import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Share2,
  Trophy,
  Copy,
  Check,
  Download,
  Twitter,
  ArrowRight,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { TypingSession, LeaderboardEntry } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

interface SessionResultsProps {
  session: TypingSession;
  onRestart: () => void;
  onNextTest: () => void;
  onViewStats: () => void;
  onViewLeaderboard: () => void;
}

export const SessionResults: React.FC<SessionResultsProps> = ({
  session,
  onRestart,
  onNextTest,
  onViewStats,
  onViewLeaderboard
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [leaderboardName, setLeaderboardName] = useState(user?.displayName || 'SpeedTypist');
  const [showNameInput, setShowNameInput] = useState(!user);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger celebration confetti for solid typing speeds
  useEffect(() => {
    if (session.wpm >= 60 || session.accuracy >= 98) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
        });
      } catch {
        // ignore if canvas not supported
      }
    }
  }, [session.wpm, session.accuracy]);

  // Determine speed tier
  const getSpeedRating = (wpm: number) => {
    if (wpm >= 120) return { label: 'Grandmaster Typist', color: 'text-amber-400', desc: 'Top 1% elite typing velocity!' };
    if (wpm >= 90) return { label: 'Pro Typist', color: 'text-purple-400', desc: 'Blazing fast keystrokes!' };
    if (wpm >= 65) return { label: 'Fast Typist', color: 'text-emerald-400', desc: 'Significantly above average!' };
    if (wpm >= 45) return { label: 'Fluent Typist', color: 'text-cyan-400', desc: 'Solid everyday productivity.' };
    return { label: 'Developing Speed', color: 'text-slate-300', desc: 'Keep practicing to unlock effortless rhythm!' };
  };

  const rating = getSpeedRating(session.wpm);

  // Calculate consistency score from telemetry
  const calculateConsistency = () => {
    if (!session.telemetryHistory || session.telemetryHistory.length < 2) return 92;
    const wpms = session.telemetryHistory.map(t => t.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    if (mean === 0) return 0;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;
    const consistency = Math.max(10, Math.min(100, Math.round((1 - coefficientOfVariation) * 100)));
    return consistency;
  };

  const consistency = calculateConsistency();

  // Social Share text
  const shareText = `⚡ I just achieved ${session.wpm} WPM (${session.cpm} CPM) with ${session.accuracy}% accuracy on KeyPulse! Mode: ${session.mode}. Can you beat my score? 🏆`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KeyPulse Typing Speed Test',
          text: shareText,
          url: window.location.href
        });
      } catch {
        // Share cancelled or unavailable
      }
    } else {
      handleCopyShare();
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePublishLeaderboard = async () => {
    setIsPublishing(true);
    try {
      await storageService.publishToLeaderboard(
        session,
        leaderboardName.trim() || 'Anonymous Typist',
        user?.photoURL || undefined
      );
      setPublished(true);
    } catch (e) {
      console.warn('Leaderboard publish fallback', e);
      // Even if cloud permission fails, mark as published locally
      setPublished(true);
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate downloadable scorecard PNG image using Canvas
  const handleDownloadScorecard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative grid & accents
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }

    // Header branding
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('KEYPULSE PRO', 80, 90);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText(`TEST MODE: ${session.mode.toUpperCase()} · ${new Date(session.timestamp).toLocaleDateString()}`, 80, 130);

    // Main Score Hero
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px monospace';
    ctx.fillText(`${session.wpm}`, 80, 270);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('WORDS PER MINUTE', 80, 320);

    // Sub metrics boxes
    const metrics = [
      { label: 'CHARACTERS / MIN', value: `${session.cpm} CPM` },
      { label: 'ACCURACY', value: `${session.accuracy}%` },
      { label: 'CONSISTENCY', value: `${consistency}%` },
      { label: 'RAW SPEED', value: `${session.rawWpm} WPM` }
    ];

    metrics.forEach((m, idx) => {
      const x = 80 + idx * 260;
      const y = 390;

      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.roundRect ? ctx.roundRect(x, y, 230, 110, 16) : ctx.fillRect(x, y, 230, 110);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText(m.label, x + 20, y + 40);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(m.value, x + 20, y + 85);
    });

    // Rating tagline at bottom
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Rank: ${rating.label} — "${rating.desc}"`, 80, 560);

    // Download trigger
    const link = document.createElement('a');
    link.download = `KeyPulse_Score_${session.wpm}WPM.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Telemetry chart geometry calculations
  const telemetry = session.telemetryHistory && session.telemetryHistory.length > 1
    ? session.telemetryHistory
    : [
        { second: 0, wpm: 0, cpm: 0, rawWpm: 0, errors: 0, accuracy: 100 },
        { second: session.duration, wpm: session.wpm, cpm: session.cpm, rawWpm: session.rawWpm, errors: session.errorCount, accuracy: session.accuracy }
      ];

  const maxWpm = Math.max(...telemetry.map(t => Math.max(t.wpm, t.rawWpm)), 10) + 10;
  const chartWidth = 700;
  const chartHeight = 160;

  const points = telemetry.map(t => {
    const x = (t.second / Math.max(1, session.duration)) * chartWidth;
    const y = chartHeight - (t.wpm / maxWpm) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const rawPoints = telemetry.map(t => {
    const x = (t.second / Math.max(1, session.duration)) * chartWidth;
    const y = chartHeight - (t.rawWpm / maxWpm) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Banner / Hero Speed rating */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          Test Session Completed
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Performance Breakdown
        </h2>
        <p className={`text-sm font-medium ${rating.color}`}>
          {rating.label} · {rating.desc}
        </p>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* WPM Main */}
        <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 font-mono">
              Net Speed
            </span>
            <span className="text-[11px] font-mono text-slate-400">words/min</span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-50">
              {session.wpm}
            </span>
            <span className="text-xl font-bold font-mono text-amber-400">WPM</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Raw: {session.rawWpm} WPM</span>
            <span>·</span>
            <span>Duration: {session.duration}s</span>
          </div>
        </div>

        {/* CPM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-cyan-400 font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Char Rate
            </span>
            <span className="text-[10px] text-slate-500 font-mono">cpm</span>
          </div>
          <div className="my-2">
            <div className="text-4xl font-extrabold font-mono text-slate-100">
              {session.cpm}
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {session.characterCount} total chars
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 font-mono flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Accuracy
            </span>
            <span className="text-[10px] text-slate-500 font-mono">%</span>
          </div>
          <div className="my-2">
            <div className="text-4xl font-extrabold font-mono text-slate-100">
              {session.accuracy}
              <span className="text-lg text-slate-500 font-normal">%</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {session.errorCount} error{session.errorCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
          <div className="text-[11px] font-mono uppercase text-slate-400">Consistency</div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1">{consistency}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
          <div className="text-[11px] font-mono uppercase text-slate-400">Mode</div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1">{session.mode}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
          <div className="text-[11px] font-mono uppercase text-slate-400">Errors</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">{session.errorCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
          <div className="text-[11px] font-mono uppercase text-slate-400">Test Category</div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1 capitalize">{session.category}</div>
        </div>
      </div>

      {/* Interactive Second-by-Second Telemetry Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Velocity Progression (Seconds vs WPM)
            </h3>
            <p className="text-xs text-slate-400">
              Live typing cadence and velocity changes throughout the test duration
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              Net WPM
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>
              Raw WPM
            </span>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="w-full overflow-x-auto pt-2">
          <div className="min-w-[500px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#334155" strokeWidth="1" />

              {/* Shaded Area */}
              <polygon points={areaPoints} fill="url(#wpmGradient)" />

              {/* Raw WPM Line */}
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="3 3"
                points={rawPoints}
              />

              {/* Net WPM Line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data points */}
              {telemetry.map((t, idx) => {
                const cx = (t.second / Math.max(1, session.duration)) * chartWidth;
                const cy = chartHeight - (t.wpm / maxWpm) * chartHeight;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={idx === telemetry.length - 1 ? 5 : 3}
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth="2"
                  >
                    <title>{`Second ${t.second}: ${t.wpm} WPM (${t.cpm} CPM)`}</title>
                  </circle>
                );
              })}
            </svg>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
              <span>0s</span>
              <span>{Math.round(session.duration / 2)}s</span>
              <span>{session.duration}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Missed Characters Heatmap / Summary */}
      {session.missedCharacters && Object.keys(session.missedCharacters).length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="font-semibold text-slate-300 mb-2">Key Miss Frequency:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(session.missedCharacters).map(([char, count]) => (
              <span
                key={char}
                className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 font-mono"
              >
                Key <strong className="text-white font-bold">{char === ' ' ? 'Space' : char}</strong> ({count}x)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gamified Leaderboard Submission Panel */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Global Leaderboard</h4>
            <p className="text-xs text-slate-400">
              Submit this score to compete on the global rankings!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {showNameInput && !published && (
            <input
              type="text"
              value={leaderboardName}
              onChange={e => setLeaderboardName(e.target.value)}
              placeholder="Your typist handle"
              maxLength={24}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          )}

          <button
            onClick={handlePublishLeaderboard}
            disabled={isPublishing || published}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
              published
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            {published ? (
              <>
                <Check className="w-4 h-4" />
                Score Submitted!
              </>
            ) : isPublishing ? (
              'Publishing...'
            ) : (
              <>
                <Award className="w-4 h-4" />
                Post to Leaderboard
              </>
            )}
          </button>
        </div>
      </div>

      {/* Social Sharing Strip */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Share your milestone with friends:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </button>

          <button
            onClick={handleTwitterShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            <Twitter className="w-3.5 h-3.5 text-sky-400" />
            Share to X
          </button>

          <button
            onClick={handleDownloadScorecard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Download Scorecard PNG
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-mono transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share...
          </button>
        </div>
      </div>

      {/* Navigation action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Test
        </button>

        <button
          onClick={onNextTest}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold font-mono text-sm transition-all hover:scale-105 active:scale-95 shadow"
        >
          Next Text
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onViewStats}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-sm transition-colors"
        >
          Detailed Analytics & History
        </button>
      </div>
    </div>
  );
};
