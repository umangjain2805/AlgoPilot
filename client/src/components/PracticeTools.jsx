import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ProgressBar from './ProgressBar.jsx'
import { useState } from 'react'
import { Download, Upload, Target, History, ShieldCheck } from 'lucide-react'
import { useLeetCode } from '../hooks/useLeetCode.js'
import { PROBLEMS } from '../lib/leetcode.js'
import { dueAt } from '../lib/practice.js'

export default function PracticeTools() {
  const {
    profile,
    progress,
    analysis,
    importHistory,
    restoreBackup,
    restoreSkipped,
    undoCompletion,
    setDailyGoal,
    storageWarning,
  } = useLeetCode()
  const reducedMotion = useReducedMotion()
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const report = (work) => {
    try {
      setMessage(work())
      setFailed(false)
    } catch (error) {
      setMessage(error.message)
      setFailed(true)
    }
  }
  const exportBackup = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 2,
            username: profile.leetcodeUsername,
            exportedAt: new Date().toISOString(),
            progress,
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob),
      link = document.createElement('a')
    link.href = url
    link.download = `${profile.leetcodeUsername}-coach-backup.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Progress backup downloaded.')
    setFailed(false)
  }
  const readBackup = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 2000000) throw new Error('Backup must be smaller than 2 MB.')
      restoreBackup(await file.text())
      setMessage('Backup merged with your saved progress.')
      setFailed(false)
    } catch (error) {
      setMessage(error.message)
      setFailed(true)
    }
    event.target.value = ''
  }
  const recent = [...progress.activity]
    .reverse()
    .filter((item, index, list) => list.findIndex((entry) => entry.slug === item.slug) === index)
    .slice(0, 5)
  const due = Object.values(progress.reviews).filter((review) => dueAt(review) <= Date.now()).length
  return (
    <section
      className="neo-box-lg rounded-3xl bg-white p-6 sm:p-8 dark:bg-slate-900"
      aria-label="Practice progress and history"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Target className="h-5 w-5" />
            Your practice tracker
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Progress is saved in this browser for @{profile.leetcodeUsername}. Export a backup to
            move devices.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <label htmlFor="daily-goal">Daily goal</label>
          <input
            id="daily-goal"
            type="number"
            min="1"
            max="20"
            value={progress.dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="w-16 rounded-xl border border-slate-300 bg-transparent p-2 text-center dark:border-slate-700"
          />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ['Today', `${analysis.completedToday} / ${progress.dailyGoal}`],
          ['Scheduled reviews due', due],
          ['Skipped questions', progress.skippedSlugs.length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="metric-card rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
          >
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
            <p
              key={String(value)}
              className="metric-value mt-1 text-2xl font-black text-slate-900 dark:text-white"
            >
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="goal-progress mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>
            {analysis.completedToday >= progress.dailyGoal
              ? 'Daily goal reached. Nice work!'
              : 'A little closer to your daily goal'}
          </span>
          <span>
            {Math.min(100, Math.round((analysis.completedToday / progress.dailyGoal) * 100))}%
          </span>
        </div>
        <ProgressBar value={analysis.completedToday} max={progress.dailyGoal} height="h-3" />
      </div>
      <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-4 w-4" />
          {profile.history?.status === 'complete'
            ? 'Public history matches the reported solved count'
            : 'Public solved history is incomplete'}
        </p>
        <p className="mt-1">
          LeetCode reports {profile.totalSolved} solves. We have recorded {analysis.solvedSet.size}{' '}
          question slugs and {progress.solvedIds.length} imported IDs (these may overlap).{' '}
          {profile.history?.status !== 'complete' &&
            'Suggestions exclude recorded solves, but older solved questions may still appear. Import your older history below.'}
        </p>
      </div>
      {profile.warnings?.map((warning) => (
        <p key={warning} className="mt-2 text-xs text-amber-700 dark:text-amber-300">
          {warning}
        </p>
      ))}
      {storageWarning && (
        <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-300">
          {storageWarning}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="neo-btn rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
        >
          <History className="mr-1 inline h-4 w-4" />
          {open ? 'Close history import' : 'Import solved history'}
        </button>
        <button
          type="button"
          onClick={exportBackup}
          className="neo-btn rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
        >
          <Download className="mr-1 inline h-4 w-4" />
          Export backup
        </button>
        <label className="neo-btn cursor-pointer rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-800 dark:text-white">
          <Upload className="mr-1 inline h-4 w-4" />
          Restore backup
          <input
            type="file"
            accept=".json,application/json"
            onChange={readBackup}
            aria-label="Restore progress backup"
            className="sr-only"
          />
        </label>
        {progress.skippedSlugs.length > 0 && (
          <button
            type="button"
            onClick={() =>
              report(() => {
                restoreSkipped()
                return 'Skipped questions are available again.'
              })
            }
            className="neo-btn rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
          >
            Restore skipped
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            style={{ overflow: 'hidden' }}
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault()
              report(() => {
                const count = importHistory(text)
                setText('')
                return `${count} unique entries processed; recorded solves are excluded from new practice.`
              })
            }}
          >
            <label
              htmlFor="solved-history"
              className="text-sm font-bold text-slate-800 dark:text-slate-200"
            >
              Solved question IDs, slugs, or problem URLs
            </label>
            <textarea
              id="solved-history"
              rows="3"
              maxLength={200000}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="1, 2, 20, binary-search, https://leetcode.com/problems/two-sum/"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent p-3 text-sm text-slate-900 dark:border-slate-700 dark:text-white"
            />
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Separate entries with spaces, commas, or newlines. Imports are your own records and
              are not verified by LeetCode.
            </p>
            <button
              type="submit"
              className="neo-btn neo-btn-electric rounded-xl px-4 py-2 text-xs font-bold"
            >
              Add solved questions
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {message && (
        <p
          role={failed ? 'alert' : 'status'}
          className={`mt-3 text-sm ${failed ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}
        >
          {message}
        </p>
      )}
      {recent.length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent local completions
          </h3>
          <ul className="mt-2 space-y-2">
            {recent.map((item) => (
              <li
                key={item.slug}
                className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300"
              >
                <span>
                  {PROBLEMS.find((p) => p.titleSlug === item.slug)?.title || item.slug} ·{' '}
                  {item.type === 'review' ? 'Reviewed' : 'Marked solved'} ·{' '}
                  {new Date(item.at).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => undoCompletion(item.slug)}
                  className="rounded-md border border-slate-300 px-2 py-1 dark:border-slate-600"
                >
                  Undo local completion
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
