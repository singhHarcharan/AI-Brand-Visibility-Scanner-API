"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ScanForm from "@/components/ScanForm";
import ScoreCard from "@/components/ScoreCard";
import ResultsList from "@/components/ResultsList";
import LoadingState from "@/components/LoadingState";

export interface QueryResult {
  query: string;
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative" | "not_applicable";
  rank: number | null;
  context: string;
}

export interface ScanResponse {
  brand_name: string;
  total_queries: number;
  visibility_score: number;
  results: QueryResult[];
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (brandName: string, queries: string[]) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, queries }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${res.status})`);
      }

      const data: ScanResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ScanForm onScan={handleScan} loading={loading} />

        {loading && <LoadingState />}

        {error && (
          <div className="mt-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {result && !loading && (
          <div className="mt-10 space-y-8 animate-fade-in">
            <ScoreCard
              brandName={result.brand_name}
              score={result.visibility_score}
              totalQueries={result.total_queries}
              mentionedCount={result.results.filter((r) => r.mentioned).length}
            />
            <ResultsList results={result.results} />
          </div>
        )}
      </div>
    </main>
  );
}
