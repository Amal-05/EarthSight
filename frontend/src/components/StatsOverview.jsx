import React from 'react';
import { TrendingUp, TrendingDown, Building2, Trees, Car, Droplets, Wheat, Mountain } from 'lucide-react';

export default function StatsOverview({ statistics }) {
  if (!statistics || !statistics.summary_cards) return null;

  const cards = statistics.summary_cards;

  const METRIC_CONFIGS = [
    {
      id: 'buildings',
      title: 'Built-up Area',
      icon: Building2,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20'
    },
    {
      id: 'vegetation',
      title: 'Vegetation Coverage',
      icon: Trees,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'water',
      title: 'Water Bodies',
      icon: Droplets,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'roads',
      title: 'Road Network',
      icon: Car,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'agriculture',
      title: 'Agricultural Land',
      icon: Wheat,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'barren',
      title: 'Barren Soil',
      icon: Mountain,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10 border-slate-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {METRIC_CONFIGS.map(cfg => {
        const item = cards[cfg.id] || {};
        const Icon = cfg.icon;
        const isPositive = item.delta_area_km2 > 0;
        const isNegative = item.delta_area_km2 < 0;

        return (
          <div
            key={cfg.id}
            className={`glass-panel p-3.5 rounded-xl border ${cfg.bg} flex flex-col justify-between transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {cfg.title}
              </span>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-100 tracking-tight">
                  {item.formatted_change || '0%'}
                </span>
                <span
                  className={`text-[11px] font-bold flex items-center ${
                    isPositive
                      ? 'text-emerald-400'
                      : isNegative
                      ? 'text-red-400'
                      : 'text-slate-400'
                  }`}
                >
                  {isPositive && <TrendingUp className="w-3 h-3 mr-0.5 inline" />}
                  {isNegative && <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                  {item.delta_area_km2 > 0 ? `+${item.delta_area_km2}` : item.delta_area_km2} km²
                </span>
              </div>

              <div className="mt-1 text-[10px] text-slate-400 font-medium">
                {item.area_year1} km² ➔ {item.area_year2} km²
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
