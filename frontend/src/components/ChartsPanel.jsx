import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';

export default function ChartsPanel({ statistics }) {
  if (!statistics) return null;

  const { summary_cards = {}, timeline_series = [], year1 = 2018, year2 = 2025 } = statistics;

  // Prepare Bar Chart Data (Comparison between Year 1 and Year 2)
  const barData = Object.keys(summary_cards).map(key => {
    const item = summary_cards[key];
    return {
      feature: item.feature ? item.feature.charAt(0).toUpperCase() + item.feature.slice(1) : key,
      [year1]: item.area_year1 || 0,
      [year2]: item.area_year2 || 0,
      delta: item.delta_area_km2 || 0
    };
  });

  // Prepare Pie Data (Year 2 breakdown)
  const pieColors = {
    Buildings: '#ef4444',
    Vegetation: '#22c55e',
    Roads: '#a855f7',
    Water: '#3b82f6',
    Agriculture: '#eab308',
    Barren: '#94a3b8'
  };

  const pieData = barData.map(d => ({
    name: d.feature,
    value: d[year2],
    color: pieColors[d.feature] || '#3b82f6'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Bar Chart: Land Cover Comparison */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Land Cover Area Comparison ({year1} vs {year2})
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Area in km²</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="feature" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey={year1} fill="#3b82f6" radius={[4, 4, 0, 0]} name={`${year1} Base`} />
              <Bar dataKey={year2} fill="#10b981" radius={[4, 4, 0, 0]} name={`${year2} Target`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut Chart: Distribution Breakdown */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <PieIcon className="w-4 h-4 text-indigo-400" />
            {year2} Land Cover Share
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">% Ratio</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val) => [`${val} km²`, 'Area']}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Time Series Line Chart */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 lg:col-span-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Multi-Year Land Cover Timeline Dynamics (2018 - 2025)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Historical Trends</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline_series} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="buildings" stroke="#ef4444" strokeWidth={2.5} name="Buildings" />
              <Line type="monotone" dataKey="vegetation" stroke="#22c55e" strokeWidth={2.5} name="Vegetation" />
              <Line type="monotone" dataKey="roads" stroke="#a855f7" strokeWidth={2} name="Roads" />
              <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Water" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
