import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ImageOverlay, Rectangle, useMap } from 'react-leaflet';
import { Layers, Eye, ShieldAlert, Sparkles } from 'lucide-react';

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({
  center = [30.3172, -97.6931],
  zoom = 13,
  image1Base64,
  image2Base64,
  changeOverlayBase64,
  segmentationMask2Base64,
  showChangeOverlay = true,
  showSegmentationOverlay = false,
  activeOverlayMode = 'change' // 'change' or 'segmentation' or 'raw'
}) {
  // Bounding box bounds for image overlay mapping (Austin suburban corridor extent)
  const bounds = [
    [30.2672, -97.7431], // [south, west]
    [30.3672, -97.6431]  // [north, east]
  ];

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={center} zoom={zoom} />
        
        {/* Base Map Tiles (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* AOI Bounding Box Rectangle */}
        <Rectangle
          bounds={bounds}
          pathOptions={{
            color: '#3b82f6',
            weight: 2,
            dashArray: '6, 6',
            fillColor: '#3b82f6',
            fillOpacity: 0.05
          }}
        />

        {/* Satellite Image T2 Overlay if available */}
        {image2Base64 && activeOverlayMode === 'raw' && (
          <ImageOverlay
            url={image2Base64}
            bounds={bounds}
            opacity={0.9}
          />
        )}

        {/* Segmentation Overlay if enabled */}
        {segmentationMask2Base64 && activeOverlayMode === 'segmentation' && (
          <ImageOverlay
            url={segmentationMask2Base64}
            bounds={bounds}
            opacity={0.85}
          />
        )}

        {/* Spatial Change Mask Overlay if enabled */}
        {changeOverlayBase64 && activeOverlayMode === 'change' && (
          <ImageOverlay
            url={changeOverlayBase64}
            bounds={bounds}
            opacity={0.85}
          />
        )}
      </MapContainer>

      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] glass-panel px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-slate-200">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        Interactive AOI View (Austin Suburban Corridor)
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[1000] glass-panel p-3 rounded-xl border border-slate-700/80 text-xs shadow-xl max-w-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-2 border-b border-slate-800 pb-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Layer Legend</span>
        </div>

        {activeOverlayMode === 'change' ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-sm" />
              <span className="text-slate-300 font-medium">Feature Increased (+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-red-500 shadow-sm" />
              <span className="text-slate-300 font-medium">Feature Decreased (-)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-500 shadow-sm" />
              <span className="text-slate-300 font-medium">Significant Landscape Transition</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span className="text-slate-300">Buildings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Vegetation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
              <span className="text-slate-300">Roads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="text-slate-300">Water</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className="text-slate-300">Agriculture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
              <span className="text-slate-300">Barren</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
