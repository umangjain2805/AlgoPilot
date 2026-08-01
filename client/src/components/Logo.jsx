import { Link } from 'react-router-dom'

const Logo = ({ to = '/', className = '' }) => (
  <Link to={to} className={`flex items-center gap-2 ${className}`}>
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-500/30">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3l2.35 4.76 5.26.77-3.8 3.71.9 5.23L12 18.6l-4.71 2.47.9-5.23-3.8-3.71 5.26-.77L12 3z"
          fill="currentColor"
        />
      </svg>
    </span>
    <span className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-white">
      AI LeetCode <span className="gradient-text">Coach</span>
    </span>
  </Link>
)

export default Logo
