import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Button from '../components/Button.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
}

const features = [
  {
    title: 'Profile Analysis',
    description: 'Connect your LeetCode profile and get a deep, AI-powered breakdown of your strengths and weaknesses.',
    icon: (
      <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14H4zM9 7h6M9 11h6M9 15h4" />
    ),
  },
  {
    title: 'Personalized Recommendations',
    description: 'Receive a tailored roadmap of problems to solve next, ranked by what moves the needle most for you.',
    icon: (
      <path d="M9 12h6M9 8h6M9 16h4M12 3l1.9 1.9 2.6-.7.7 2.6 2.6 1.5-1.3 2.2 1.3 2.2-2.6 1.5-.7 2.6-2.6-.7L12 21l-1.9-1.9-2.6.7-.7-2.6-2.6-1.5 1.3-2.2-1.3-2.2 2.6-1.5.7-2.6 2.6.7L12 3z" />
    ),
  },
  {
    title: 'Progress Tracking',
    description: 'Watch your coding patterns improve over time with clear, measurable insights and streaks.',
    icon: (
      <path d="M3 17l5-5 4 4 7-8M19 8h-4M19 8v4" />
    ),
  },
  {
    title: 'Interview Readiness',
    description: 'Know exactly when you are ready for that dream role with readiness scores per topic.',
    icon: (
      <path d="M9 12l2 2 4-4M12 21a9 9 0 100-18 9 9 0 000 18z" />
    ),
  },
]

const steps = [
  { number: '01', title: 'Connect', description: 'Link your LeetCode profile with one click.' },
  { number: '02', title: 'Analyze', description: 'Our AI reviews your solved problems, tags, and trends.' },
  { number: '03', title: 'Improve', description: 'Follow your personalized problem recommendations.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'SDE Candidate', quote: 'The personalized roadmap helped me finally break through my dynamic programming plateau.', avatar: 'SM' },
  { name: 'James T.', role: 'CS Student', quote: 'It feels like having a senior engineer coaching me through every topic.', avatar: 'JT' },
  { name: 'Priya K.', role: 'Backend Engineer', quote: 'The readiness score told me exactly when to start applying. Landed my offer!', avatar: 'PK' },
]

const Landing = () => {
  const { isAuthenticated, isGuest } = useAuth()
  const dashboardPath = isAuthenticated ? (isGuest ? '/guest/dashboard' : '/dashboard') : '/login'

  return (
    <div className="overflow-hidden">
      {/* ===== Hero ===== */}
      <section id="home" className="relative">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-400/20 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-primary-100/60 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:border-primary-700/40 dark:bg-primary-900/40 dark:text-primary-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
              AI-Powered DSA Coaching
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.1}
            className="font-display mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Master Data Structures & Algorithms with your{' '}
            <span className="gradient-text">AI LeetCode Coach</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.2}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 dark:text-ink-300"
          >
            Analyze your LeetCode profile, get personalized recommendations, and track your
            progress toward interview success. Smarter practice, faster growth.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.3}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {isAuthenticated ? (
              <Link to={dashboardPath}>
                <Button size="lg">
                  Go to Dashboard
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Login</Button>
                </Link>
                <Link to="/guest" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Continue as Guest →
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.4}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="glass-card rounded-3xl p-2">
              <div className="gradient-hero flex h-64 items-center justify-center rounded-2xl sm:h-80">
                <div className="animate-float grid h-24 w-24 place-items-center rounded-3xl bg-white/15 text-5xl backdrop-blur-sm">
                  🧠
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="bg-white/60 py-20 dark:bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
              Everything you need to <span className="gradient-text">level up</span>
            </h2>
            <p className="mt-4 text-ink-600 dark:text-ink-300">
              A complete coaching toolkit built around how engineers actually prepare for interviews.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={index * 0.1}
                className="glass-card group rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 transition-transform duration-300 group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="mt-4 text-ink-600 dark:text-ink-300">
              Three simple steps between you and smarter practice.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={index * 0.15}
                className="relative rounded-2xl p-6 text-center"
              >
                <span className="font-display gradient-text text-6xl font-extrabold opacity-80">{step.number}</span>
                <h3 className="font-display mt-4 text-xl font-bold text-ink-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-ink-600 dark:text-ink-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials placeholder ===== */}
      <section id="testimonials" className="bg-white/60 py-20 dark:bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
              Loved by <span className="gradient-text">developers</span>
            </h2>
            <p className="mt-4 text-ink-600 dark:text-ink-300">Real results from engineers who leveled up.</p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, index) => (
              <motion.figure
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={index * 0.1}
                className="glass-card rounded-2xl p-6"
              >
                <div className="mb-4 flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-ink-700 dark:text-ink-200">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{t.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="gradient-hero relative overflow-hidden rounded-3xl px-6 py-16 text-center text-white sm:px-12"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to level up your DSA?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Join today and get your first personalized coaching plan in minutes. Free to start.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isAuthenticated ? (
                <Link to={dashboardPath}>
                  <Button size="lg" className="bg-white !text-primary-700 hover:bg-white/90">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white !text-primary-700 hover:bg-white/90">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link
                    to="/guest"
                    className="rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Continue as Guest
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Landing
