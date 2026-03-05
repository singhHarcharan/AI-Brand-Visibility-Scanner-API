import { QueryResult } from "@/app/page";

interface ResultsListProps {
  results: QueryResult[];
}

const sentimentBadge: Record<string, string> = {
  positive: "bg-green-500/15 text-green-400 border-green-500/30",
  neutral: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  negative: "bg-red-500/15 text-red-400 border-red-500/30",
  not_applicable: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const sentimentLabel: Record<string, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  not_applicable: "N/A",
};

export default function ResultsList({ results }: ResultsListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Query Results</h3>
      <div className="space-y-3">
        {results.map((r, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:border-[var(--accent)]/40 animate-fade-in"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              {/* Left side */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.query}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                  {r.context}
                </p>
              </div>

              {/* Right side badges */}
              <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                {/* Mentioned */}
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                    r.mentioned
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-red-500/15 text-red-400 border-red-500/30"
                  }`}
                >
                  {r.mentioned ? "Mentioned" : "Not Mentioned"}
                </span>

                {/* Sentiment */}
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                    sentimentBadge[r.sentiment]
                  }`}
                >
                  {sentimentLabel[r.sentiment]}
                </span>

                {/* Rank */}
                {r.rank !== null && (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">
                    Rank #{r.rank}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
