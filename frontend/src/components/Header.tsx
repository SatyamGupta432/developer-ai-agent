"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col items-center text-center gap-6 relative">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        AI Agent Powered
      </div>

      <div className="absolute top-0 right-0 flex gap-4">
        <Link 
          href="/login"
          className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-all text-white"
        >
          Login
        </Link>
        <Link 
          href="/signup"
          className="text-xs bg-accent hover:bg-accent/90 px-4 py-2 rounded-lg transition-all text-white font-bold"
        >
          Sign Up
        </Link>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
        Developer Productivity AI
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl">
        Automate your documentation workflow. Analyze local commits, remote GitHub repos, and track your history.
      </p>
    </div>
  );
}
