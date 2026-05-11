"use client";

interface AnalysisResultProps {
  data: any;
}

export default function AnalysisResult({ data }: AnalysisResultProps) {
  if (!data) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center opacity-50 border-dashed min-h-[500px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h3 className="text-xl font-medium text-white">No Analysis Active</h3>
        <p className="text-slate-500 mt-2">Trigger a local or remote analysis to see results here.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {data.error && (
        <div className="glass-card p-6 border-red-500/20 bg-red-500/5 mb-8">
          <h2 className="text-red-500 font-semibold flex items-center gap-2">Backend Error</h2>
          <p className="text-slate-400 mt-2 text-sm">{data.error}</p>
        </div>
      )}
      
      <div className="glass-card p-8 min-h-[500px]">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            AI Documentation
          </h2>
          <button 
            onClick={() => window.print()}
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            Print Report
          </button>
        </div>
        
        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-p:text-slate-400 prose-li:text-slate-400 prose-strong:text-white whitespace-pre-wrap leading-relaxed text-slate-300">
          {data.documentation}
        </div>
      </div>
    </div>
  );
}
