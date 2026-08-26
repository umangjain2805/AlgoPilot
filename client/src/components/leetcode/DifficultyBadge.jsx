const difficultyStyles = {
  Easy: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
  Medium: 'bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-400',
  Hard: 'bg-rose-500/15 text-rose-700 ring-rose-500/20 dark:text-rose-400',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
}

// Color-coded difficulty indicator: Easy (green), Medium (amber), Hard (red).
const DifficultyBadge = ({ difficulty = 'Easy', size = 'md', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${
      difficultyStyles[difficulty] || difficultyStyles.Easy
    } ${sizeClasses[size]} ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {difficulty}
  </span>
)

export default DifficultyBadge
