import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
    <p className="font-display gradient-text text-8xl font-extrabold sm:text-9xl">404</p>
    <h1 className="font-display mt-4 text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
      Page not found
    </h1>
    <p className="mt-3 max-w-md text-ink-600 dark:text-ink-300">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <Link to="/" className="mt-8">
      <Button size="lg">Back to Home</Button>
    </Link>
  </div>
)

export default NotFound
