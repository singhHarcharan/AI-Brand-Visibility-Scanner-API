export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            BV
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Brand Visibility Scanner
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Powered by AI &middot; Anthropic Claude
            </p>
          </div>
        </div>
        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          API Docs ↗
        </a>
      </div>
    </header>
  );
}
