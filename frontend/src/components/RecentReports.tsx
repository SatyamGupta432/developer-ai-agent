"use client";

import { useEffect, useState } from "react";

export default function RecentReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/reports")
      .then((res) => res.json())
      .then(setReports)
      .catch((err) => console.error("Failed to fetch reports:", err));
  }, []);

  if (reports.length === 0) return null;

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Recent Reports
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.slice(0, 4).map((r) => (
          <div
            key={r.id}
            className="glass-card p-6 border border-white/5 hover:border-accent/30 transition-all group"
          >
            <h3 className="font-bold text-white mb-2 group-hover:text-accent transition-colors truncate">
              {r.commit_message}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-3">
              {r.documentation}
            </p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-600 font-mono">{r.commit_hash?.substring(0, 8)}</span>
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest">{r.project_name || "Agent Analysis"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
