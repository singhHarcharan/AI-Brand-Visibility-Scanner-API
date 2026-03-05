"use client";

import { useState } from "react";

interface ScanFormProps {
  onScan: (brandName: string, queries: string[]) => void;
  loading: boolean;
}

const EXAMPLE_QUERIES: Record<string, string[]> = {
  Notion: [
    "best productivity tools for teams",
    "top note-taking apps 2025",
    "alternatives to Microsoft Word",
  ],
  OpenAI: [
    "best AI tools for developers",
    "top chatbot platforms",
    "AI code generation tools",
  ],
  Figma: [
    "best UI design tools",
    "prototyping software for teams",
    "alternatives to Adobe XD",
  ],
};

export default function ScanForm({ onScan, loading }: ScanFormProps) {
  const [brandName, setBrandName] = useState("");
  const [queryText, setQueryText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queries = queryText
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean);
    if (brandName.trim() && queries.length > 0) {
      onScan(brandName.trim(), queries);
    }
  };

  const loadExample = (brand: string) => {
    setBrandName(brand);
    setQueryText(EXAMPLE_QUERIES[brand].join("\n"));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-5">
        <div>
          <h2 className="text-xl font-semibold mb-1">Scan a Brand</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Enter a brand name and the search queries you want to evaluate.
          </p>
        </div>

        {/* Quick-fill examples */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[var(--text-muted)] self-center mr-1">
            Try:
          </span>
          {Object.keys(EXAMPLE_QUERIES).map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => loadExample(brand)}
              className="text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Brand name */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">
            Brand Name
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. Notion"
            required
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        {/* Queries */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">
            Search Queries{" "}
            <span className="text-[var(--text-muted)] font-normal">
              (one per line)
            </span>
          </label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={"best productivity tools for teams\ntop note-taking apps 2025\nalternatives to Microsoft Word"}
            rows={4}
            required
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[var(--accent)] to-blue-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Scanning…
            </span>
          ) : (
            "Run Scan"
          )}
        </button>
      </div>
    </form>
  );
}
