export default function LoadingState() {
  return (
    <div className="mt-10 space-y-6 animate-fade-in">
      {/* Score card skeleton */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-full shimmer" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-6 w-40 rounded shimmer" />
            <div className="h-4 w-28 rounded shimmer" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 w-12 rounded shimmer" />
                  <div className="h-3 w-20 rounded shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Query result skeletons */}
      <div>
        <div className="h-5 w-32 rounded shimmer mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded shimmer" />
                  <div className="h-3 w-full rounded shimmer mt-2" />
                  <div className="h-3 w-2/3 rounded shimmer" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-full shimmer" />
                  <div className="h-6 w-16 rounded-full shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scanning indicator */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <svg
            className="animate-spin h-4 w-4 text-[var(--accent)]"
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
          Analyzing brand visibility with AI…
        </div>
      </div>
    </div>
  );
}
