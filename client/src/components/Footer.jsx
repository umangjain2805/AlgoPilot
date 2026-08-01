import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-200/60 bg-white/50 dark:border-ink-800/60 dark:bg-ink-950/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              Personalized DSA coaching powered by your LeetCode profile. Level up your
              problem-solving skills with AI-driven recommendations.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-800 dark:text-ink-200">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
              <li>
                <a href="/#features" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-400">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-800 dark:text-ink-200">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
              <li className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</li>
              <li className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</li>
              <li className="hover:text-primary-600 dark:hover:text-primary-400">Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-200/60 pt-6 text-center text-xs text-ink-500 dark:border-ink-800/60 dark:text-ink-500">
          &copy; {year} AI LeetCode Coach. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
