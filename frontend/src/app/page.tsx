"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/analyze");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (error: any) {
      console.error("Fetch error:", error);
      alert("Failed to analyze: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 min-h-screen flex flex-col gap-12">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          AI Agent Powered
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Developer Productivity AI
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          Automatically analyze your last git commit and generate comprehensive technical documentation in seconds.
        </p>
        <button
          onClick={analyze}
          disabled={loading}
          className="glow-button bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Last Commit
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {data.error && (
            <div className="lg:col-span-12 glass-card p-6 border-red-500/20 bg-red-500/5">
              <h2 className="text-red-500 font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Backend Error
              </h2>
              <p className="text-slate-400 mt-2 text-sm">{data.error}</p>
            </div>
          )}

          {/* Commit Sidebar */}
          {data.commit && (
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-card p-6 flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Commit Details</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Author</span>
                    <span className="font-medium">{data.commit.author}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Hash</span>
                    <span className="font-mono text-xs text-accent bg-accent/5 px-2 py-1 rounded border border-accent/10 truncate">
                      {data.commit.hash}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500">Message</span>
                  <p className="text-sm leading-relaxed mt-1 text-slate-300">
                    {data.commit.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documentation Content */}
          <div className={data.commit ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="glass-card p-8 min-h-[400px]">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  AI Documentation
                </h2>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500/50"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500/50"></div>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none prose-headings:font-bold prose-p:text-slate-400 prose-li:text-slate-400 prose-strong:text-white whitespace-pre-wrap leading-relaxed text-slate-300">
                {data.documentation}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}