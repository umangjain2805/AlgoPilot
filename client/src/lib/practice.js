import problems from '../data/leetcode-problems.json' with { type: 'json' }
import { CURATED_DSA_TOPICS } from './topics.js'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const validSlug = (value) =>
  typeof value === 'string' && value.length <= 150 && slugPattern.test(value)
const unique = (values) => [...new Set(values)]
export const DAY_MS = 86400000
export const localDay = (timestamp = Date.now()) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function normalizeProgress(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) input = {}
  const array = (value) => (Array.isArray(value) ? value : [])
  const reviews = Object.fromEntries(
    Object.entries(input.reviews || {})
      .filter(
        ([slug, item]) =>
          validSlug(slug) &&
          item &&
          Number.isFinite(item.completedAt) &&
          item.completedAt > 0 &&
          item.completedAt <= Date.now(),
      )
      .map(([slug, item]) => [
        slug,
        {
          completedAt: item.completedAt,
          count: Math.max(0, Math.min(20, Math.floor(Number(item.count) || 0))),
        },
      ]),
  )
  return {
    solvedSlugs: unique(array(input.solvedSlugs).filter(validSlug)),
    solvedIds: unique(
      array(input.solvedIds).filter((id) => Number.isInteger(id) && id > 0 && id <= 100000),
    ),
    skippedSlugs: unique(array(input.skippedSlugs).filter(validSlug)),
    reviews,
    dailyGoal: Math.max(1, Math.min(20, Math.floor(Number(input.dailyGoal) || 3))),
    activity: array(input.activity)
      .filter(
        (item) =>
          item &&
          validSlug(item.slug) &&
          ['solve', 'review'].includes(item.type) &&
          Number.isFinite(item.at) &&
          item.at > 0 &&
          item.at <= Date.now(),
      )
      .slice(-2000),
  }
}

export function parseSolvedHistory(text) {
  if (typeof text !== 'string' || text.length > 200000)
    throw new Error('Import up to 200 KB of question IDs or slugs.')
  const tokens = text
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean)
  if (!tokens.length)
    throw new Error('Enter solved question numbers, slugs, or LeetCode problem URLs.')
  const solvedIds = [],
    solvedSlugs = []
  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      const id = Number(token)
      if (!Number.isInteger(id) || id < 1 || id > 100000)
        throw new Error(`Invalid question number: ${token}`)
      solvedIds.push(id)
    } else {
      let slug = token
      if (token.includes('/')) {
        let url
        try {
          url = new URL(token.startsWith('http') ? token : `https://${token}`)
        } catch {
          throw new Error('Invalid problem URL.')
        }
        if (
          !['leetcode.com', 'www.leetcode.com'].includes(url.hostname) ||
          !['http:', 'https:'].includes(url.protocol)
        )
          throw new Error('Use LeetCode problem URLs.')
        const match = url.pathname.match(/^\/problems\/([a-z0-9-]+)(?:\/|$)/)
        if (!match) throw new Error('Use a URL like https://leetcode.com/problems/two-sum/.')
        slug = match[1]
      }
      if (!validSlug(slug)) throw new Error(`Invalid question slug: ${token.slice(0, 60)}`)
      solvedSlugs.push(slug)
    }
  }
  return { solvedIds: unique(solvedIds), solvedSlugs: unique(solvedSlugs) }
}

export function mergeProgress(current, incoming) {
  const a = normalizeProgress(current),
    b = normalizeProgress(incoming)
  const activity = new Map(
    [...a.activity, ...b.activity].map((item) => [`${item.slug}:${item.type}:${item.at}`, item]),
  )
  const reviews = { ...a.reviews }
  for (const [slug, review] of Object.entries(b.reviews)) {
    if (!reviews[slug] || review.completedAt > reviews[slug].completedAt) reviews[slug] = review
  }
  return normalizeProgress({
    ...a,
    dailyGoal: incoming && Object.hasOwn(incoming, 'dailyGoal') ? b.dailyGoal : a.dailyGoal,
    solvedSlugs: [...a.solvedSlugs, ...b.solvedSlugs],
    solvedIds: [...a.solvedIds, ...b.solvedIds],
    skippedSlugs: [...a.skippedSlugs, ...b.skippedSlugs],
    reviews,
    activity: [...activity.values()].sort((x, y) => x.at - y.at),
  })
}

export function dueAt(review) {
  return review.completedAt + [1, 3, 7, 14, 30][Math.min(review.count, 4)] * DAY_MS
}

export function buildAnalysis(profile, input = {}, now = Date.now()) {
  const progress = normalizeProgress(input)
  const solvedIds = new Set(progress.solvedIds)
  const solvedSet = new Set([...(profile.solvedSlugs || []), ...progress.solvedSlugs])
  for (const problem of problems) if (solvedIds.has(problem.id)) solvedSet.add(problem.titleSlug)
  for (const slug of Object.keys(progress.reviews)) solvedSet.add(slug)
  const totalSolved = Number(profile.totalSolved) || 0
  const topics = CURATED_DSA_TOPICS.map((topic) => {
    // Count the union of matching free questions, not the maximum of tag counts.
    const pool = problems.filter(
      (p) => !p.paidOnly && p.tags.some((tag) => topic.tags.includes(tag)),
    )
    const solved = pool.filter((p) => solvedSet.has(p.titleSlug)).length
    return {
      name: topic.name,
      total: pool.length,
      solved,
      unsolved: pool.length - solved,
      ratio: pool.length ? solved / pool.length : 0,
      hasCurated: pool.length > 0,
    }
  }).sort((a, b) => a.ratio - b.ratio || b.total - a.total)
  const weakTopics = topics.filter((t) => t.hasCurated && t.unsolved > 0).slice(0, 8)
  const insights = [
    'Topic percentages measure coverage of our free curated questions, rather than mastery.',
    totalSolved < 30
      ? 'Build fundamentals with Easy questions, then introduce Medium problems.'
      : totalSolved < 300
        ? 'Focus on Medium questions and use Easy questions to fill topic gaps.'
        : 'Mix Medium and Hard questions while strengthening less-practised topics.',
  ]
  if (weakTopics.length)
    insights.push(
      `Lower recorded coverage: ${weakTopics
        .slice(0, 3)
        .map((t) => t.name)
        .join(', ')}.`,
    )
  if (profile.history?.status !== 'complete')
    insights.push(
      'Public solved history is incomplete. Import older solves to exclude them from new practice.',
    )
  const datasetSolved = problems.filter((p) => solvedSet.has(p.titleSlug)).length
  return {
    profile,
    progress,
    solvedSet,
    totalSolved,
    easySolved: Number(profile.easySolved) || 0,
    mediumSolved: Number(profile.mediumSolved) || 0,
    hardSolved: Number(profile.hardSolved) || 0,
    acceptanceRate: profile.acceptanceRate ?? null,
    streak: Number(profile.calendar?.streak) || 0,
    rating: Number(profile.contestRating) || 0,
    topics,
    weakTopics,
    strongTopics: [...topics]
      .filter((t) => t.total > 0 && t.solved > 0)
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 6),
    datasetSolved,
    datasetUnsolved: problems.length - datasetSolved,
    insights,
    completedToday: new Set(
      progress.activity.filter((a) => localDay(a.at) === localDay(now)).map((a) => a.slug),
    ).size,
  }
}

export function buildPlan(
  analysis,
  total = 10,
  selectedTopic = 'all',
  selectedDifficulty = 'all',
  mode = 'new',
  now = Date.now(),
) {
  if (!analysis) return null
  const topic = CURATED_DSA_TOPICS.find((t) => t.name === selectedTopic)
  const target = analysis.totalSolved < 30 ? 'Easy' : analysis.totalSolved < 300 ? 'Medium' : 'Hard'
  const difficultyRank = { Easy: 0, Medium: 1, Hard: 2 }
  const weakTags = new Map()
  analysis.weakTopics.forEach((entry, index) => {
    for (const tag of CURATED_DSA_TOPICS.find((t) => t.name === entry.name)?.tags || []) {
      weakTags.set(tag, Math.max(weakTags.get(tag) || 0, (8 - index) * (1 - entry.ratio)))
    }
  })
  const skipped = new Set(analysis.progress.skippedSlugs)
  const candidates = problems.filter(
    (p) =>
      !p.paidOnly &&
      !skipped.has(p.titleSlug) &&
      (selectedTopic === 'all' ||
        (topic
          ? p.tags.some((tag) => topic.tags.includes(tag))
          : p.tags.includes(selectedTopic))) &&
      (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) &&
      (mode === 'revision'
        ? analysis.solvedSet.has(p.titleSlug)
        : !analysis.solvedSet.has(p.titleSlug)),
  )
  const eligible = candidates.filter(
    (p) =>
      mode !== 'revision' ||
      !analysis.progress.reviews[p.titleSlug] ||
      dueAt(analysis.progress.reviews[p.titleSlug]) <= now,
  )
  const scored = eligible
    .map((p) => {
      const weak = Math.max(0, ...p.tags.map((tag) => weakTags.get(tag) || 0))
      const distance = Math.abs(difficultyRank[p.difficulty] - difficultyRank[target])
      const matchedTopic = analysis.weakTopics.find((entry) => {
        const config = CURATED_DSA_TOPICS.find((t) => t.name === entry.name)
        return p.tags.some((tag) => config?.tags.includes(tag))
      })
      return {
        ...p,
        score: weak * 3 - distance * 8,
        reason:
          mode === 'revision'
            ? 'Due for review to reinforce a recorded solve.'
            : `${matchedTopic ? `Build coverage in ${matchedTopic.name}. ` : ''}${p.difficulty === target ? 'Matches your current practice level.' : 'Adds variety to your practice.'}`,
      }
    })
    .sort((a, b) => b.score - a.score || a.id - b.id)
  // Round-robin topic buckets avoid filling the whole session with one topic.
  const buckets = new Map()
  for (const p of scored) {
    const key = p.tags.find((tag) => weakTags.has(tag)) || p.tags[0] || 'Other'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(p)
  }
  const count = Math.max(1, Math.min(50, Math.floor(Number(total) || 10)))
  const chosen = []
  while (chosen.length < Math.min(count, scored.length)) {
    for (const bucket of buckets.values()) {
      if (bucket.length && chosen.length < count) chosen.push(bucket.shift())
    }
  }
  return {
    revision: mode === 'revision' ? chosen : [],
    fresh: mode === 'revision' ? [] : chosen,
    solvedCount: mode === 'revision' ? chosen.length : 0,
    totalAvailable: scored.length,
    freshAvailable: mode === 'revision' ? 0 : scored.length,
    solvedAvailable: mode === 'revision' ? scored.length : 0,
    upcomingReviews: mode === 'revision' ? candidates.length - eligible.length : 0,
  }
}
