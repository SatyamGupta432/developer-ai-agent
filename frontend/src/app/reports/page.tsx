"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            AI Developer Reports
          </h1>
          <Link 
            href="/"
            className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-all"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-gray-500 italic">No reports found in the system.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((r) => (
              <div
                key={r.id}
                className="glass-card border border-white/10 p-6 rounded-2xl hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold group-hover:text-accent transition-colors">
                    {r.commit_message}
                  </h2>
                  <span className="text-xs font-mono text-gray-500">
                    {r.commit_hash?.substring(0, 8)}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none prose-sm">
                  <p className="text-gray-400 leading-relaxed">
                    {r.documentation}
                  </p>
                </div>

                {r.project_name && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                    <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
                      Project: {r.project_name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
                      Author: {r.author}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
