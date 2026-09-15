import React from 'react';
import { Globe, Satellite, Sparkles, Activity, Layers } from 'lucide-react';

export default function Navbar({ mode, setMode, isBackendConnected, onLoadDemo, isLoading }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/20 animate-glow">
          <Globe className="w-6 h-6 text-white" />
          <Satellite className="w-3.5 h-3.5 text-blue-200 absolute -top-1 -right-1" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200">
              EarthSight
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase">
              AI Satellite Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Multi-Temporal Satellite Semantic Change Platform</p>
        </div>
      </div>

      {/* Center Controls: Mode Toggle */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setMode('demo')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'demo'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          DEMO MODE
        </button>
        <button
          onClick={() => setMode('live')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'live'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          LIVE SATELLITE MODE
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Backend status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-slate-300 font-medium">
            {isBackendConnected ? 'API Connected' : 'Connecting API...'}
          </span>
        </div>

        {/* Load Demo CTA */}
        <button
          onClick={onLoadDemo}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          {isLoading ? 'Processing...' : 'Load Demo Area'}
        </button>
      </div>
    </header>
  );
}
