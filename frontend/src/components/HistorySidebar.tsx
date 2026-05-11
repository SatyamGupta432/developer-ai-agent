"use client";

import { analysisService } from "@/services/api";

interface HistorySidebarProps {
  history: any[];
  onSelect: (item: any) => void;
}

export default function HistorySidebar({ history, onSelect }: HistorySidebarProps) {
  const exportExcel = async () => {
    try {
      await analysisService.exportExcel();
      alert("Excel report generated successfully in backend/reports/history_report.xlsx");
    } catch (error) {
      alert("Failed to export Excel report");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Export Card */}
      <div className="glass-card p-6 bg-accent/5 border-accent/20">
        <h3 className="font-bold mb-2 text-white">Export Data</h3>
        <p className="text-xs text-slate-400 mb-4">Download your entire documentation history as a structured Excel report.</p>
        <button 
          onClick={exportExcel}
          className="w-full bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          Export to Excel
        </button>
      </div>

      {/* History List */}
      <div className="glass-card flex flex-col h-full max-h-[600px]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white">Analysis History</h3>
          <span className="text-xs bg-white/5 px-2 py-1 rounded text-slate-500">{history.length} records</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {history.length > 0 ? history.map((item) => (
            <button 
              key={item.id}
              onClick={() => onSelect({ 
                commit: { 
                  author: item.author, 
                  message: item.commit_message, 
                  hash: item.commit_hash 
                }, 
                documentation: item.documentation 
              })}
              className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5 mb-2"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-accent">{item.commit_hash?.substring(0, 8)}</span>
                <span className="text-[10px] text-slate-600">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                {item.commit_message?.split('\n')[0]}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">by {item.author}</p>
            </button>
          )) : (
            <div className="p-12 text-center text-slate-600 text-sm italic">
              No history available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
