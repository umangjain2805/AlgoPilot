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

// The 20 canonical DSA topics requested by the user with their corresponding LeetCode tags.
export const CURATED_DSA_TOPICS = [
  { name: 'Arrays', tags: ['Array', 'Arrays'] },
  { name: 'Strings', tags: ['String', 'Strings'] },
  { name: 'Hashing (Map / Set)', tags: ['Hash Table', 'Hash Function', 'Ordered Set', 'Hashing'] },
  { name: 'Two Pointers', tags: ['Two Pointers'] },
  { name: 'Sliding Window', tags: ['Sliding Window'] },
  { name: 'Prefix Sum', tags: ['Prefix Sum'] },
  { name: 'Binary Search', tags: ['Binary Search'] },
  { name: 'Recursion', tags: ['Recursion'] },
  { name: 'Backtracking', tags: ['Backtracking'] },
  { name: 'Linked List', tags: ['Linked List', 'Doubly-Linked List'] },
  { name: 'Stack', tags: ['Stack'] },
  { name: 'Queue', tags: ['Queue', 'Monotonic Queue'] },
  { name: 'Monotonic Stack', tags: ['Monotonic Stack'] },
  { name: 'Trees (Binary Tree / BST)', tags: ['Tree', 'Binary Tree', 'Binary Search Tree', 'Trie'] },
  {
    name: 'Graphs',
    tags: ['Graph', 'Graph Theory', 'Breadth-First Search', 'Depth-First Search', 'Topological Sort'],
  },
  { name: 'Greedy', tags: ['Greedy'] },
  { name: 'Heap / Priority Queue', tags: ['Heap', 'Heap (Priority Queue)'] },
  { name: 'Dynamic Programming (DP)', tags: ['Dynamic Programming', 'Memoization'] },
  { name: 'Bit Manipulation', tags: ['Bit Manipulation', 'Bitmask'] },
  { name: 'Union Find (DSU)', tags: ['Union Find', 'Union-Find', 'Disjoint Set'] },
]

// Per-topic coverage across the curated problem set (used as the recommendation
// pool and as a fallback when the backend has no full-catalog topic stats).
const computeCuratedTopics = (solvedSet) => {
  return CURATED_DSA_TOPICS.map((topic) => {
    const matchingProblems = PROBLEMS.filter((p) =>
      (p.tags || []).some((tag) => topic.tags.includes(tag)),
    )
    const total = matchingProblems.length
    const solved = matchingProblems.filter((p) => solvedSet.has(p.titleSlug)).length

    return {
      name: topic.name,
      total,
      solved,
      unsolved: Math.max(0, total - solved),
      ratio: total ? solved / total : 0,
      hasCurated: total > 0,
    }
  }).sort((a, b) => a.ratio - b.ratio || b.total - a.total)
}

// Builds the full analysis object used by the sidebar and the planner.
export function buildAnalysis(profile) {
  const solvedSet = new Set(profile.solvedSlugs || [])

  const totalSolved = Number(profile.totalSolved) || 0
  const easySolved = Number(profile.easySolved) || 0
  const mediumSolved = Number(profile.mediumSolved) || 0
  const hardSolved = Number(profile.hardSolved) || 0

  const curatedTopics = computeCuratedTopics(solvedSet)
  const curatedMap = new Map(curatedTopics.map((t) => [t.name, t]))

  // Topic coverage measured against LeetCode's full problem catalog (fetched by
  // the backend). Falls back to the curated dataset when the catalog is absent.
  // Filters STRICTLY to the 20 requested DSA topics.
  const stats = Array.isArray(profile.solvedTopicStats) ? profile.solvedTopicStats : []
  const statMap = new Map(stats.map((s) => [s.name, s]))

  const topics = CURATED_DSA_TOPICS.map((topic) => {
    let catalogTotal = 0
    let catalogSolved = 0
    let foundCatalogStat = false

    for (const tag of topic.tags) {
      const s = statMap.get(tag)
      if (s) {
        foundCatalogStat = true
        catalogTotal = Math.max(catalogTotal, Number(s.total) || 0)
        catalogSolved = Math.max(catalogSolved, Number(s.solved) || 0)
      }
    }

    const curatedEntry = curatedMap.get(topic.name)
    const total = foundCatalogStat && catalogTotal > 0 ? catalogTotal : (curatedEntry?.total || 0)
    const solved = foundCatalogStat && catalogTotal > 0 ? catalogSolved : (curatedEntry?.solved || 0)

    return {
      name: topic.name,
      total,
      solved,
      unsolved: Math.max(0, total - solved),
      ratio: total ? solved / total : 0,
      hasCurated: (curatedEntry?.total || 0) > 0,
    }
  }).sort((a, b) => a.ratio - b.ratio || b.total - a.total)

  // Weak topics = the least-practised topics we can actually recommend from the
  // curated set. `topics` is already sorted least-practised first.
  const weakTopics = topics.filter((t) => t.hasCurated && t.solved < t.total).slice(0, 8)

  const strongTopics = [...topics]
    .filter((t) => t.total > 0)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 6)

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

  if (stats.length > 0) {
    const practiced = topics.filter((t) => t.solved > 0).length
    insights.push(
      `Across LeetCode's full catalog you have practised ${practiced} of ${topics.length} tagged topics.`,
    )
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
    const topicConfig = CURATED_DSA_TOPICS.find((t) => t.name === selectedTopic)
    if (topicConfig) {
      return (p.tags || []).some((tag) => topicConfig.tags.includes(tag))
    }
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
