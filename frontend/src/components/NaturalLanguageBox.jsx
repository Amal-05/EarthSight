import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Code2, Tag } from 'lucide-react';

export default function NaturalLanguageBox({ onSearch, parsedQuery, isLoading }) {
  const [query, setQuery] = useState('');

  const EXAMPLE_QUERIES = [
    "Show areas where buildings increased between 2018 and 2025.",
    "Find vegetation loss in this region.",
    "How much did the water-body area change?",
    "Show areas with significant urban expansion."
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleChipClick = (example) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-blue-500/20 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10">
        <label className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Natural Language Semantic Query
        </label>

        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask e.g. "Show vegetation loss between 2018 and 2025"...'
            className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm font-medium pl-12 pr-28 py-3.5 rounded-xl border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50"
          >
            <span>Analyze</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick Example Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-400" />
          Try asking:
        </span>
        {EXAMPLE_QUERIES.map((example, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(example)}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all text-left cursor-pointer"
          >
            "{example}"
          </button>
        ))}
      </div>

      {/* Parsed Parameter JSON View */}
      {parsedQuery && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-300">Parsed Query Parameters:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded font-mono text-[11px]">
              Feature: {parsedQuery.feature?.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded font-mono text-[11px]">
              Action: {parsedQuery.operation?.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded font-mono text-[11px]">
              {parsedQuery.start_year} ➔ {parsedQuery.end_year}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
