import React, { useState } from 'react';
import { SlidersHorizontal, Image as ImageIcon, Layers, Eye } from 'lucide-react';

export default function ImageSlider({
  image1Base64,
  image2Base64,
  segmentation1Base64,
  segmentation2Base64,
  year1 = 2018,
  year2 = 2025
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'segmentation'

  const imgLeft = viewMode === 'raw' ? image1Base64 : segmentation1Base64;
  const imgRight = viewMode === 'raw' ? image2Base64 : segmentation2Base64;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          Interactive Multi-Temporal Swipe Comparison
        </h3>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('raw')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Raw Satellite
          </button>
          <button
            onClick={() => setViewMode('segmentation')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'segmentation'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            AI Segmentation
          </button>
        </div>
      </div>

      {/* Swipe Container */}
      <div
        className="relative w-full h-[400px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-800 bg-slate-950"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Right Image (T2 Year) */}
        {imgRight && (
          <img
            src={imgRight}
            alt={`Satellite scene ${year2}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Left Image Clipped (T1 Year) */}
        {imgLeft && (
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={imgLeft}
              alt={`Satellite scene ${year1}`}
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        {/* Vertical Drag Slider Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_12px_rgba(59,130,246,0.9)] z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold">
            ↔
          </div>
        </div>

        {/* Date Labels */}
        <div className="absolute top-3 left-3 z-30 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 text-xs font-bold shadow-lg">
          {year1} ({viewMode === 'raw' ? 'Base Satellite' : 'Base Segmentation'})
        </div>
        <div className="absolute top-3 right-3 z-30 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 text-xs font-bold shadow-lg">
          {year2} ({viewMode === 'raw' ? 'Target Satellite' : 'Target Segmentation'})
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center italic">
        Drag slider left and right to compare land-cover transitions between {year1} and {year2}.
      </p>
    </div>
  );
}
