import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NaturalLanguageBox from './components/NaturalLanguageBox';
import ControlPanel from './components/ControlPanel';
import MapView from './components/MapView';
import ImageSlider from './components/ImageSlider';
import StatsOverview from './components/StatsOverview';
import ChartsPanel from './components/ChartsPanel';
import AIReportCard from './components/AIReportCard';
import { checkBackendHealth, runFullPipeline, executeSemanticQuery } from './services/api';
import { Layers, Eye, SlidersHorizontal, Sparkles, MapPin, AlertCircle } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('demo');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Parameters
  const [locationName, setLocationName] = useState('Austin Suburban Expansion Corridor');
  const [year1, setYear1] = useState(2018);
  const [year2, setYear2] = useState(2025);
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [activeOverlayMode, setActiveOverlayMode] = useState('change'); // 'change', 'segmentation', 'raw'

  // Results State
  const [analysisData, setAnalysisData] = useState(null);
  const [parsedQuery, setParsedQuery] = useState(null);

  // Check health on mount & trigger default demo load
  useEffect(() => {
    checkHealthAndInit();
  }, []);

  const checkHealthAndInit = async () => {
    const health = await checkBackendHealth();
    if (health && health.status === 'online') {
      setIsBackendConnected(true);
      loadDemoData();
    } else {
      setIsBackendConnected(false);
      // Fallback demo trigger even if backend connection check returned null
      loadDemoData();
    }
  };

  const loadDemoData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await runFullPipeline([-97.7431, 30.2672, -97.6431, 30.3672], 2018, 2025, mode);
      if (data && data.status === 'success') {
        setAnalysisData(data);
        setParsedQuery(null);
      } else {
        setErrorMsg('Failed to process satellite imagery demo.');
      }
    } catch (err) {
      console.error('Error loading demo data:', err);
      setErrorMsg('Error connecting to backend satellite service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await runFullPipeline([-97.7431, 30.2672, -97.6431, 30.3672], year1, year2, mode);
      if (data && data.status === 'success') {
        setAnalysisData(data);
        setParsedQuery(null);
      } else {
        setErrorMsg('Analysis failed. Please check date range.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg('Error processing satellite analysis pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemanticSearch = async (queryText) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await executeSemanticQuery(queryText, year1, year2);
      if (data && data.status === 'success') {
        setAnalysisData(data);
        setParsedQuery(data.parsed_query);
        if (data.year1) setYear1(data.year1);
        if (data.year2) setYear2(data.year2);
        if (data.target_feature) setSelectedFeature(data.target_feature);
      } else {
        setErrorMsg('Could not process natural language query.');
      }
    } catch (err) {
      console.error('Semantic search error:', err);
      setErrorMsg('Error executing natural language query.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        isBackendConnected={isBackendConnected}
        onLoadDemo={loadDemoData}
        isLoading={isLoading}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Error Alert if any */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Natural Language Query Input */}
        <NaturalLanguageBox
          onSearch={handleSemanticSearch}
          parsedQuery={parsedQuery}
          isLoading={isLoading}
        />

        {/* 2. Top Dashboard Row: Map View + Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Map & Overlay Mode Controls */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Geospatial AOI Map View</span>
              </div>

              {/* Map Layer Mode Switcher */}
              <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveOverlayMode('change')}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    activeOverlayMode === 'change'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Change Overlay
                </button>
                <button
                  onClick={() => setActiveOverlayMode('segmentation')}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    activeOverlayMode === 'segmentation'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  AI Segmentation
                </button>
                <button
                  onClick={() => setActiveOverlayMode('raw')}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    activeOverlayMode === 'raw'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Satellite
                </button>
              </div>
            </div>

            <MapView
              image1Base64={analysisData?.image1_base64}
              image2Base64={analysisData?.image2_base64}
              changeOverlayBase64={analysisData?.change_overlay_base64}
              segmentationMask2Base64={analysisData?.segmentation_mask2_base64}
              activeOverlayMode={activeOverlayMode}
            />
          </div>

          {/* Right Column: Parameters & Filters Control Panel */}
          <div className="space-y-4">
            <ControlPanel
              year1={year1}
              setYear1={setYear1}
              year2={year2}
              setYear2={setYear2}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
              onRunAnalysis={handleRunAnalysis}
              isLoading={isLoading}
              locationName={locationName}
              setLocationName={setLocationName}
            />
          </div>
        </div>

        {/* 3. KPI Statistics Overview Cards */}
        {analysisData?.statistics && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Quantified Change Metrics ({year1} vs {year2})
            </h2>
            <StatsOverview statistics={analysisData.statistics} />
          </div>
        )}

        {/* 4. Interactive Swipe Comparison Viewer */}
        <ImageSlider
          image1Base64={analysisData?.image1_base64}
          image2Base64={analysisData?.image2_base64}
          segmentation1Base64={analysisData?.segmentation_mask1_base64}
          segmentation2Base64={analysisData?.segmentation_mask2_base64}
          year1={year1}
          year2={year2}
        />

        {/* 5. Recharts Analytics Panel */}
        <ChartsPanel statistics={analysisData?.statistics} />

        {/* 6. AI Narrative Report */}
        <AIReportCard report={analysisData?.ai_report} />

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 mt-12 py-4 px-6 text-center text-xs text-slate-500">
        <p>EarthSight AI Platform • Hackathon & College Demonstration Prototype • Sentinel-2 STAC Integration</p>
      </footer>
    </div>
  );
}
