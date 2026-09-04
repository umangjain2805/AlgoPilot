import { useMemo } from 'react'

const WEEK_COUNT = 52
const DAYS_PER_WEEK = 7

const colorFor = (count) => {
  if (count === 0) return 'bg-slate-200 dark:bg-slate-800'
  if (count <= 2) return 'bg-indigo-300 dark:bg-indigo-800'
  if (count <= 5) return 'bg-indigo-400 dark:bg-indigo-600'
  if (count <= 9) return 'bg-indigo-500 dark:bg-indigo-500'
  return 'bg-indigo-600 dark:bg-indigo-400'
}

// Builds `WEEK_COUNT` columns (oldest → newest) of 7 days, anchored to the
// current week (Sunday-start). Each day resolves its submission count from the
// normalized `heatmap` object (unix-seconds → count).
function buildWeeks(heatmap) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const weeks = []
  for (let w = WEEK_COUNT - 1; w >= 0; w -= 1) {
    const days = []
    for (let d = 0; d < DAYS_PER_WEEK; d += 1) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() - w * DAYS_PER_WEEK + d)
      const ts = Math.floor(date.getTime() / 1000)
      days.push({ date, ts, count: Number(heatmap?.[ts]) || 0 })
    }
    weeks.push(days)
  }
  return weeks
}

function formatDay(day) {
  const label = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(day.date)
  return day.count === 0
    ? `No submissions on ${label}`
    : `${day.count} submission${day.count === 1 ? '' : 's'} on ${label}`
}

export default function Heatmap({ heatmap = {}, calendar = {} }) {
  const weeks = useMemo(() => buildWeeks(heatmap), [heatmap])
  const streak = Number(calendar.streak) || 0
  const activeDays = Number(calendar.totalActiveDays) || 0

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="flex w-max gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.ts}
                  title={formatDay(day)}
                  className={`h-2.5 w-2.5 rounded-[3px] ${colorFor(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          {streak}-day streak · {activeDays} active day{activeDays === 1 ? '' : 's'}
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {[0, 2, 5, 9, 10].map((n) => (
            <span key={n} className={`h-2.5 w-2.5 rounded-[3px] ${colorFor(n)}`} />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
