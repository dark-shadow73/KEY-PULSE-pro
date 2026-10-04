import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Zap,
  Target,
  Trophy,
  Clock,
  Trash2,
  FileDown,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { TypingSession } from '../types';

interface ProgressDashboardProps {
  sessions: TypingSession[];
  onDeleteSession?: (id: string) => void;
  onExportBackup?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  sessions,
  onDeleteSession,
  onExportBackup
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const [chartMetric, setChartMetric] = useState<'wpm' | 'cpm' | 'accuracy'>('wpm');
  const [limitCount, setLimitCount] = useState<number>(20);

  // Filter sessions
  const filteredSessions = sessions.filter(s => {
    if (filterMode === 'all') return true;
    return s.mode.toLowerCase().includes(filterMode.toLowerCase());
  });

  // Calculate high-level stats
  const totalTests = sessions.length;
  const bestWpm = sessions.reduce((max, s) => Math.max(max, s.wpm), 0);
  const bestCpm = sessions.reduce((max, s) => Math.max(max, s.cpm), 0);
  const avgWpm = totalTests > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / totalTests) : 0;
  const avgCpm = totalTests > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.cpm, 0) / totalTests) : 0;
  const avgAccuracy = totalTests > 0 ? Math.round((sessions.reduce((acc, s) => acc + s.accuracy, 0) / totalTests) * 10) / 10 : 0;
  const totalCharacters = sessions.reduce((acc, s) => acc + (s.characterCount || 0), 0);
  const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalTimeMinutes = Math.round(totalSeconds / 60);

  // Chart data: chronological order (oldest to newest)
  const chartSessions = [...filteredSessions].reverse().slice(-limitCount);

  // Chart dimensions
  const chartWidth = 720;
  const chartHeight = 180;

  const maxVal = Math.max(
    ...chartSessions.map(s => (chartMetric === 'wpm' ? s.wpm : chartMetric === 'cpm' ? s.cpm : s.accuracy)),
    chartMetric === 'accuracy' ? 100 : 80
  );

  const points = chartSessions.map((s, idx) => {
    const val = chartMetric === 'wpm' ? s.wpm : chartMetric === 'cpm' ? s.cpm : s.accuracy;
    const x = chartSessions.length > 1 ? (idx / (chartSessions.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (val / (chartMetric === 'accuracy' ? 100 : maxVal)) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = chartSessions.length > 1
    ? `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`
    : '';

  // Mode best records
  const getModeBest = (m: string) => {
    const modeList = sessions.filter(s => s.mode.toLowerCase().includes(m.toLowerCase()));
    if (modeList.length === 0) return null;
    return modeList.reduce((best, s) => s.wpm > best.wpm ? s : best, modeList[0]);
  };

  const best15s = getModeBest('15s');
  const best30s = getModeBest('30s');
  const best60s = getModeBest('60s');
  const bestQuote = getModeBest('quote');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-amber-400" />
            Analytics & Improvement History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking your keystroke velocity, character rate, and accuracy evolution over time
          </p>
        </div>

        {onExportBackup && (
          <button
            onClick={onExportBackup}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            Export Data Backup
          </button>
        )}
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Tests Completed</div>
          <div className="text-2xl font-extrabold font-mono text-slate-100 mt-1">{totalTests}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Best Speed</div>
          <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
            {bestWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Peak Char Rate</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {bestCpm} <span className="text-xs font-normal text-slate-400">CPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Avg Speed</div>
          <div className="text-2xl font-extrabold font-mono text-slate-200 mt-1">
            {avgWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Avg Accuracy</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            {avgAccuracy}<span className="text-xs font-normal text-slate-400">%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Time Practiced</div>
          <div className="text-2xl font-extrabold font-mono text-slate-200 mt-1">
            {totalTimeMinutes} <span className="text-xs font-normal text-slate-400">min</span>
          </div>
        </div>
      </div>

      {/* Personal Bests by Mode */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Personal Records by Discipline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">15s Sprint</span>
            <div className="text-xl font-bold text-slate-100 mt-1">
              {best15s ? `${best15s.wpm} WPM` : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {best15s ? `${best15s.accuracy}% acc · ${best15s.cpm} cpm` : 'No test yet'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">30s Standard</span>
            <div className="text-xl font-bold text-slate-100 mt-1">
              {best30s ? `${best30s.wpm} WPM` : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {best30s ? `${best30s.accuracy}% acc · ${best30s.cpm} cpm` : 'No test yet'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">60s Endurance</span>
            <div className="text-xl font-bold text-slate-100 mt-1">
              {best60s ? `${best60s.wpm} WPM` : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {best60s ? `${best60s.accuracy}% acc · ${best60s.cpm} cpm` : 'No test yet'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">Quotes</span>
            <div className="text-xl font-bold text-slate-100 mt-1">
              {bestQuote ? `${bestQuote.wpm} WPM` : '—'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {bestQuote ? `${bestQuote.accuracy}% acc · ${bestQuote.cpm} cpm` : 'No test yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Progress Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Progression Curve
            </h3>
            <p className="text-xs text-slate-400">
              Interactive trend of your typing metrics across historical sessions
            </p>
          </div>

          {/* Metric Selector & Limit */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setChartMetric('wpm')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartMetric === 'wpm' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                WPM
              </button>
              <button
                onClick={() => setChartMetric('cpm')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartMetric === 'cpm' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CPM
              </button>
              <button
                onClick={() => setChartMetric('accuracy')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartMetric === 'accuracy' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accuracy
              </button>
            </div>

            <select
              value={limitCount}
              onChange={e => setLimitCount(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value={10}>Last 10</option>
              <option value={20}>Last 20</option>
              <option value={50}>Last 50</option>
            </select>
          </div>
        </div>

        {chartSessions.length === 0 ? (
          <div className="text-center py-12 text-xs font-mono text-slate-500">
            Complete tests to visualize your progress curve here!
          </div>
        ) : (
          <div className="w-full overflow-x-auto pt-2">
            <div className="min-w-[550px]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid */}
                <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#334155" strokeWidth="1" />

                {/* Area under curve */}
                {areaPoints && <polygon points={areaPoints} fill="url(#progressGrad)" />}

                {/* Main line */}
                <polyline
                  fill="none"
                  stroke={chartMetric === 'accuracy' ? '#10b981' : chartMetric === 'cpm' ? '#38bdf8' : '#f59e0b'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Dots */}
                {chartSessions.map((s, idx) => {
                  const val = chartMetric === 'wpm' ? s.wpm : chartMetric === 'cpm' ? s.cpm : s.accuracy;
                  const x = chartSessions.length > 1 ? (idx / (chartSessions.length - 1)) * chartWidth : chartWidth / 2;
                  const y = chartHeight - (val / (chartMetric === 'accuracy' ? 100 : maxVal)) * (chartHeight - 20) - 10;
                  return (
                    <circle
                      key={s.id}
                      cx={x}
                      cy={y}
                      r={4.5}
                      fill="#f59e0b"
                      stroke="#0f172a"
                      strokeWidth="2"
                    >
                      <title>{`Test #${chartSessions.length - idx}: ${val} ${chartMetric.toUpperCase()} (${s.mode})`}</title>
                    </circle>
                  );
                })}
              </svg>

              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
                <span>Oldest ({chartSessions.length} tests ago)</span>
                <span>Latest Session</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Sessions Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Session History Log ({sessions.length})
          </h3>

          {/* Mode Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {['all', '15s', '30s', '60s', 'quote', 'custom'].map(m => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  filterMode === m ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-slate-500">
            No sessions match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Speed (WPM)</th>
                  <th className="py-2.5 px-3">Rate (CPM)</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Errors</th>
                  <th className="py-2.5 px-3">Duration</th>
                  {onDeleteSession && <th className="py-2.5 px-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSessions.slice(0, 30).map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {s.mode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-400 text-sm">
                      {s.wpm}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-bold">
                      {s.cpm}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">
                      {s.accuracy}%
                    </td>
                    <td className="py-3 px-3 text-rose-400">
                      {s.errorCount}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {s.duration}s
                    </td>
                    {onDeleteSession && (
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onDeleteSession(s.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors rounded"
                          title="Delete session record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
