"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ActionPanel from "@/components/ActionPanel";
import AnalysisResult from "@/components/AnalysisResult";
import HistorySidebar from "@/components/HistorySidebar";
import { analysisService } from "@/services/api";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const json = await analysisService.getHistory();
      setHistory(json);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (isRemote: boolean, repoName: string) => {
    setLoading(true);
    try {
      const json = isRemote 
        ? await analysisService.analyzeRemote(repoName)
        : await analysisService.analyzeLocal();
      
      setData(json);
      fetchHistory(); 
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert("Failed to analyze: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 min-h-screen flex flex-col gap-16">
      <Header />
      
      <ActionPanel 
        onAnalyze={handleAnalyze} 
        loading={loading} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <AnalysisResult data={data} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <HistorySidebar 
            history={history} 
            onSelect={setData} 
          />
        </div>
      </div>
    </main>
  );
}