"use client";

import { useState } from "react";

interface ActionPanelProps {
  onAnalyze: (isRemote: boolean, repoName: string) => void;
  loading: boolean;
}

export default function ActionPanel({ onAnalyze, loading }: ActionPanelProps) {
  const [remoteRepo, setRemoteRepo] = useState("");

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mt-4 w-full max-w-3xl mx-auto">
      <div className="flex-1 w-full relative">
        <input 
          type="text"
          placeholder="Enter GitHub Repo (e.g. User/Repo)"
          value={remoteRepo}
          onChange={(e) => setRemoteRepo(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-accent/50 transition-all text-white"
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => onAnalyze(true, remoteRepo)}
          disabled={loading || !remoteRepo}
          className="glow-button bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-30 transition-all"
        >
          Analyze Remote
        </button>
        <button
          onClick={() => onAnalyze(false, "")}
          disabled={loading}
          className="glow-button bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 disabled:opacity-50 transition-all"
        >
          {loading ? "Analyzing..." : "Analyze Local"}
        </button>
      </div>
    </div>
  );
}
