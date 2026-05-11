"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { analysisService } from "@/services/api";

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analysisService.getReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Total Reports", value: reports.length, icon: "📊" },
    { label: "Latest Commit", value: reports[0]?.commit_hash?.substring(0, 8) || "N/A", icon: "🔗" },
    { label: "AI Insights", value: reports.length * 5, icon: "🧠" }, // Just a mock stat
    { label: "Tasks Generated", value: reports.length * 3, icon: "✅" }, // Just a mock stat
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans selection:bg-accent/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              Productivity Dashboard
            </h1>
            <p className="text-gray-500 font-medium tracking-tight">
              Real-time insights from your development workflow.
            </p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold"
            >
              Back to Home
            </Link>
            <button className="px-6 py-2.5 rounded-xl bg-accent text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              <div className="text-3xl font-black mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Commit History <span className="text-sm font-normal text-gray-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{reports.length}</span>
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 w-full animate-pulse bg-white/5 rounded-2xl" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500 italic">No activity detected yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div 
                    key={report.id}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                          {report.commit_message.split('\n')[0]}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {report.commit_hash}
                        </p>
                      </div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-tighter">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4 prose prose-invert prose-sm max-w-none line-clamp-2 text-gray-400">
                      {report.ai_summary}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Analytics/Tasks */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20">
              <h3 className="text-xl font-bold mb-4">AI Task Generation</h3>
              <p className="text-sm text-gray-400 mb-6">
                Generate engineering tasks, PR descriptions, and testing checklists automatically.
              </p>
              <button className="w-full py-3 rounded-xl bg-white text-black font-black text-sm hover:opacity-90 transition-opacity">
                Generate Tasks
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Recommended Actions</h3>
              <div className="space-y-2">
                {[
                  "Review login validation logic",
                  "Fix security vulnerability in auth.ts",
                  "Update documentation for API changes"
                ].map((action, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
