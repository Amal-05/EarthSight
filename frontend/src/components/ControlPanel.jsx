import React from 'react';
import { Calendar, MapPin, Filter, Play, RefreshCw, Layers } from 'lucide-react';

export default function ControlPanel({
  year1,
  setYear1,
  year2,
  setYear2,
  selectedFeature,
  setSelectedFeature,
  onRunAnalysis,
  isLoading,
  locationName,
  setLocationName
}) {
  const YEARS = [2018, 2020, 2022, 2025];

  const FEATURES = [
    { id: 'all', label: 'All Features', color: 'bg-slate-500' },
    { id: 'buildings', label: 'Buildings', color: 'bg-red-500' },
    { id: 'vegetation', label: 'Vegetation', color: 'bg-emerald-500' },
    { id: 'roads', label: 'Roads', color: 'bg-purple-500' },
    { id: 'water', label: 'Water', color: 'bg-blue-500' },
    { id: 'agriculture', label: 'Agriculture', color: 'bg-amber-500' },
    { id: 'barren', label: 'Barren Land', color: 'bg-slate-400' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          Analysis Parameters
        </h2>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800">
          AOI Config
        </span>
      </div>

      {/* Location Search Input */}
      <div>
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          Target Location / AOI
        </label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="e.g. Austin Suburban Expansion Corridor"
          className="w-full bg-slate-900 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700/80 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Date Range Selector */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Base Year (T1)
          </label>
          <select
            value={year1}
            onChange={(e) => setYear1(Number(e.target.value))}
            className="w-full bg-slate-900 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none cursor-pointer"
          >
            {YEARS.map(y => (
              <option key={y} value={y} disabled={y >= year2}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Compare Year (T2)
          </label>
          <select
            value={year2}
            onChange={(e) => setYear2(Number(e.target.value))}
            className="w-full bg-slate-900 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none cursor-pointer"
          >
            {YEARS.map(y => (
              <option key={y} value={y} disabled={y <= year1}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Selection Tags */}
      <div>
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Target Feature Filter
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FEATURES.map(feat => {
            const isSelected = selectedFeature === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setSelectedFeature(feat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${feat.color}`} />
                {feat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Run Action */}
      <button
        onClick={onRunAnalysis}
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
            Analyzing Imagery...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 text-blue-200 fill-blue-200" />
            Run Multi-Temporal Analysis
          </>
        )}
      </button>
    </div>
  );
}
