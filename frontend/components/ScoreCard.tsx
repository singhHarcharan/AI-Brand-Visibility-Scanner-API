interface ScoreCardProps {
  brandName: string;
  score: number;
  totalQueries: number;
  mentionedCount: number;
}

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low";
  return "Very Low";
}

function ringColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export default function ScoreCard({
  brandName,
  score,
  totalQueries,
  mentionedCount,
}: ScoreCardProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 animate-pulse-glow">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Ring */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={ringColor(score)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-extrabold ${scoreColor(score)}`}>
              {score}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
              / 100
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-2xl font-bold">{brandName}</h3>
          <p className={`text-sm font-medium mt-1 ${scoreColor(score)}`}>
            {scoreLabel(score)} Visibility
          </p>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <Stat label="Queries Scanned" value={totalQueries} />
            <Stat label="Mentions Found" value={mentionedCount} />
            <Stat
              label="Mention Rate"
              value={`${Math.round((mentionedCount / totalQueries) * 100)}%`}
            />
            <Stat
              label="Missed"
              value={totalQueries - mentionedCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
