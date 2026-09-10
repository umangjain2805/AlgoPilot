import problems from '../data/leetcode-problems.json'

export const PROBLEMS = problems

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 }

// Important-list problems that are free to solve. Paid-only problems are never
// offered as "new practice" (the user couldn't solve them for free).
const FREE_PROBLEMS = problems.filter((p) => !p.paidOnly)

// Accepts a LeetCode profile URL (`https://leetcode.com/u/<username>/`,
// `https://leetcode.com/<username>/`, or a scheme-less `leetcode.com/...`), or a
// bare username, and returns the username.
export function extractUsername(input) {
  const value = String(input || '').trim()
  if (!value) return ''

  const looksLikeUrl = value.includes('/') || value.includes('leetcode.com')
  if (looksLikeUrl) {
    try {
      const candidate = value.replace(/^@/, '')
      const url = new URL(candidate.startsWith('http') ? candidate : `https://${candidate}`)
      const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
      const uIndex = segments.indexOf('u')
      if (uIndex !== -1 && segments[uIndex + 1]) return segments[uIndex + 1]
      return segments[0] || ''
    } catch {
      return value
    }
  }

  // Strip a leading "@" or trailing slash from a bare username.
  return value.replace(/^@/, '').replace(/\/+$/, '')
}

// Fetches the normalized public profile for a username from the backend.
export async function fetchProfile(username) {
  const response = await fetch(`${API_BASE}/leetcode/fetch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }

  return payload.data.profile
}

// Builds the full analysis object used by the sidebar and the planner.
export function buildAnalysis(profile) {
  const solvedSet = new Set(profile.solvedSlugs || [])

  const totalSolved = Number(profile.totalSolved) || 0
  const easySolved = Number(profile.easySolved) || 0
  const mediumSolved = Number(profile.mediumSolved) || 0
  const hardSolved = Number(profile.hardSolved) || 0

  // Per-topic coverage across the curated problem set.
  const topicMap = new Map()
  for (const problem of PROBLEMS) {
    for (const tag of problem.tags || []) {
      if (!topicMap.has(tag)) topicMap.set(tag, { total: 0, solved: 0 })
      const entry = topicMap.get(tag)
      entry.total += 1
      if (solvedSet.has(problem.titleSlug)) entry.solved += 1
    }
  }

  const topics = [...topicMap.entries()]
    .map(([name, { total, solved }]) => ({
      name,
      total,
      solved,
      unsolved: total - solved,
      ratio: total ? solved / total : 0,
    }))
    .sort((a, b) => a.ratio - b.ratio || b.total - a.total)

  const weakTopics = topics.filter((t) => t.ratio < 1).slice(0, 6)
  const strongTopics = topics.filter((t) => t.total > 0).slice(-3).reverse()

  const datasetSolved = PROBLEMS.filter((p) => solvedSet.has(p.titleSlug)).length
  const datasetUnsolved = PROBLEMS.length - datasetSolved

  // Rule-based "AI" insights, grounded in the fetched metrics.
  const insights = []
  const hardShare = totalSolved ? hardSolved / totalSolved : 0

  if (totalSolved === 0) {
    insights.push('No solved problems recorded — your first goal is consistency.')
  } else {
    if (hardShare < 0.08) {
      insights.push('Hard problems are under 8% of your solves — increase difficulty.')
    }
    if (mediumSolved < easySolved && easySolved > 0) {
      insights.push('Easy problems dominate — move the bulk of your practice to Medium.')
    }
  }

  const acceptanceRate = Number(profile.acceptanceRate) || 0
  if (acceptanceRate > 0 && acceptanceRate < 45) {
    insights.push(`Acceptance rate of ${acceptanceRate}% suggests focusing on correctness.`)
  }

  const streak = Number(profile.calendar?.streak) || 0
  if (streak <= 2) {
    insights.push('A short solve streak means consistency is your biggest lever.')
  } else {
    insights.push(`You have a ${streak}-day streak — protect it with daily practice.`)
  }

  const rating = Number(profile.contestRating) || 0
  if (!rating) {
    insights.push('No contest rating yet — try a weekly contest to benchmark yourself.')
  } else if (rating < 1500) {
    insights.push(`Contest rating of ${rating} — targeted practice on Medium/Hard will lift it.`)
  }

  if (weakTopics.length) {
    insights.push(
      `Weakest topics: ${weakTopics.slice(0, 3).map((t) => t.name).join(', ')}.`,
    )
  }

  return {
    profile,
    solvedSet,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    acceptanceRate,
    streak,
    rating,
    topics,
    weakTopics,
    strongTopics,
    datasetSolved,
    datasetUnsolved,
    insights,
  }
}

// Generates a practice plan of `total` questions — a mix of solved (revision)
// and unsolved (fresh) problems, all drawn from the curated important list.
// Supports filtering by specific topic and difficulty.
export function buildPlan(
  analysis,
  total = 10,
  selectedTopic = 'all',
  selectedDifficulty = 'all',
) {
  if (!analysis) return null

  const weakNames = new Set(analysis.weakTopics?.map((t) => t.name) || [])
  const weakScore = (p) => (p.tags?.some((tag) => weakNames.has(tag)) ? 1 : 0)
  const rank = (p) => DIFFICULTY_ORDER[p.difficulty] ?? 1

  const matchesTopic = (p) => {
    if (!selectedTopic || selectedTopic === 'all') return true
    return p.tags?.includes(selectedTopic)
  }

  const matchesDifficulty = (p) => {
    if (!selectedDifficulty || selectedDifficulty === 'all') return true
    return p.difficulty === selectedDifficulty
  }

  const matchesFilters = (p) => matchesTopic(p) && matchesDifficulty(p)

  const solvedPool = PROBLEMS.filter(
    (p) => analysis.solvedSet?.has(p.titleSlug) && matchesFilters(p),
  )
    .map((p) => ({ ...p, tags: p.tags || [] }))
    .sort((a, b) => weakScore(b) - weakScore(a) || rank(b) - rank(a))

  // Only offer free problems as new practice.
  const freshPool = FREE_PROBLEMS.filter(
    (p) => !analysis.solvedSet?.has(p.titleSlug) && matchesFilters(p),
  )
    .map((p) => ({ ...p, tags: p.tags || [] }))
    .sort((a, b) => weakScore(b) - weakScore(a) || rank(a) - rank(b))

  const totalAvail = solvedPool.length + freshPool.length
  const effectiveTotal = Math.min(Math.max(1, total), totalAvail > 0 ? totalAvail : total)

  let solvedCount = Math.round(effectiveTotal * 0.4)
  solvedCount = Math.min(solvedCount, solvedPool.length)
  solvedCount = Math.max(solvedCount, effectiveTotal - freshPool.length)
  solvedCount = Math.min(Math.max(0, solvedCount), effectiveTotal)

  const revision = solvedPool.slice(0, solvedCount)
  const fresh = freshPool.slice(0, Math.max(0, effectiveTotal - solvedCount))

  return {
    revision,
    fresh,
    solvedCount,
    totalAvailable: totalAvail,
    solvedAvailable: solvedPool.length,
    freshAvailable: freshPool.length,
  }
}
