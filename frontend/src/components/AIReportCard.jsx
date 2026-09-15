import React, { useState } from 'react';
import { FileText, Download, Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function AIReportCard({ report }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleDownloadMarkdown = () => {
    const content = `# ${report.title}\n\nGenerated At: ${report.generated_at}\n\n## Executive Summary\n${report.summary_narrative}\n\n## Key Metrics\n${report.key_metrics_bullets.join('\n')}\n`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EarthSight_Report_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20 shadow-2xl relative overflow-hidden space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{report.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                {report.reliability_score}
              </span>
              <span>•</span>
              <span>{report.generated_at}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          Export Report (.MD)
        </button>
      </div>

      {/* Summary Narrative */}
      <div className="text-xs text-slate-300 leading-relaxed space-y-2 font-normal bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {report.summary_narrative.split('\n\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {report.query_focus_note && (
        <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-medium text-blue-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          {report.query_focus_note}
        </div>
      )}

      {/* Key Metric Bullet points */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Quantified Breakdown Summary:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {report.key_metrics_bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-800 text-slate-200 font-mono text-[11px]"
            >
              {bullet}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
