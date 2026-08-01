// Placeholder for the submission heatmap — visualization ships in Phase 3.
// The raw heatmap data is already stored and available at profile.heatmap.
const LeetCodeHeatmapPlaceholder = () => {
  const cells = Array.from({ length: 52 }, (_, i) => i)

  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-6 dark:border-ink-700 dark:bg-ink-900/50">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">
          Submission Heatmap
        </h3>
        <span className="rounded-full bg-primary-500/15 px-2.5 py-0.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
          Coming in Phase 3
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden="true">
        {cells.map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-[3px] bg-primary-100 dark:bg-ink-800"
            style={{ opacity: 0.4 + (i % 5) * 0.12 }}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-500 dark:text-ink-400">
        Heatmap data is being stored with each sync and will be visualized here in a later phase.
      </p>
    </div>
  )
}

export default LeetCodeHeatmapPlaceholder
