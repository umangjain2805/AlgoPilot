import { ApiError } from '../../utils/ApiError.js'
import {
  PROBLEM_LIST_QUERY,
  RECENT_AC_SUBMISSIONS_QUERY,
  SKILL_STATS_QUERY,
} from './queries.js'

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const REQUEST_TIMEOUT_MS = 15000

/**
 * Executes a GraphQL query against LeetCode's public GraphQL API.
 * LeetCode's public queries do not require CSRF tokens or cookies.
 */
const graphqlRequest = async ({ query, variables = {}, username }) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': USER_AGENT,
    Origin: 'https://leetcode.com',
    Referer: `https://leetcode.com/u/${username || ''}/`,
  }

  let response
  try {
    response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new ApiError(504, 'LeetCode request timed out. Please try again.')
    }
    throw new ApiError(502, `Unable to reach LeetCode: ${err.message}`)
  }

  if (!response.ok) {
    throw new ApiError(502, 'LeetCode is temporarily unavailable. Please try again later.')
  }

  let json
  try {
    json = await response.json()
  } catch {
    throw new ApiError(502, 'Invalid response received from LeetCode.')
  }

  if (json.errors?.length > 0) {
    const message = json.errors[0].message || 'LeetCode request failed'

    if (message.toLowerCase().includes('does not exist')) {
      throw new ApiError(404, 'This LeetCode username does not exist')
    }

    throw new ApiError(502, `LeetCode API error: ${message}`)
  }

  return json.data || {}
}

export const leetcodeRequest = (query, variables, username) =>
  graphqlRequest({ query, variables, username })

/**
 * Fetches recent accepted submission slugs for a user via GraphQL.
 */
export const fetchAcSubmissionSlugs = async (username) => {
  try {
    const data = await graphqlRequest({
      query: RECENT_AC_SUBMISSIONS_QUERY,
      variables: { username, limit: 100 },
      username,
    })

    const list = Array.isArray(data?.recentAcSubmissionList) ? data.recentAcSubmissionList : []
    const slugs = list.map((entry) => entry?.titleSlug).filter(Boolean)
    return [...new Set(slugs)]
  } catch {
    return []
  }
}

/**
 * Fetches tag-level problem counts (fundamental, intermediate, advanced)
 * directly from LeetCode's skillStats GraphQL query.
 */
export const fetchSkillStats = async (username) => {
  try {
    const data = await graphqlRequest({
      query: SKILL_STATS_QUERY,
      variables: { username },
      username,
    })
    return data?.matchedUser?.tagProblemCounts || null
  } catch {
    return null
  }
}

// ---- Full problem catalog (cached) ----
//
// Fetches every LeetCode problem with its topic tags so a user's solved slugs
// can be mapped to topics. The catalog is cached in memory for 24 hours.

const CATALOG_PAGE_SIZE = 100
const CATALOG_TTL_MS = 24 * 60 * 60 * 1000
const CATALOG_MAX_PAGES = 50 // safety cap (~5000 problems)

let catalogCache = null // { problems, fetchedAt }
let catalogLoadPromise = null

const normalizeCatalogProblem = (question) => ({
  titleSlug: question?.titleSlug || '',
  title: question?.title || '',
  difficulty: question?.difficulty || '',
  paidOnly: Boolean(question?.isPaidOnly ?? question?.paidOnly),
  tags: Array.isArray(question?.topicTags)
    ? question.topicTags.map((t) => t?.name).filter(Boolean)
    : [],
})

const loadCatalog = async () => {
  const firstPage = await graphqlRequest({
    query: PROBLEM_LIST_QUERY,
    variables: { categorySlug: '', skip: 0, limit: CATALOG_PAGE_SIZE, filters: {} },
  })

  const total = Number(firstPage?.problemsetQuestionList?.total) || 0
  const questions = [...(firstPage?.problemsetQuestionList?.questions || [])]

  if (total === 0) {
    return []
  }

  const pages = Math.min(Math.ceil(total / CATALOG_PAGE_SIZE), CATALOG_MAX_PAGES)

  for (let page = 1; page < pages; page += 1) {
    const data = await graphqlRequest({
      query: PROBLEM_LIST_QUERY,
      variables: {
        categorySlug: '',
        skip: page * CATALOG_PAGE_SIZE,
        limit: CATALOG_PAGE_SIZE,
        filters: {},
      },
    })
    questions.push(...(data?.problemsetQuestionList?.questions || []))
  }

  return questions.map(normalizeCatalogProblem).filter((p) => p.titleSlug && p.tags.length > 0)
}

export const fetchProblemCatalog = async () => {
  if (catalogCache && Date.now() - catalogCache.fetchedAt < CATALOG_TTL_MS) {
    return catalogCache.problems
  }

  if (catalogLoadPromise) {
    return catalogLoadPromise
  }

  catalogLoadPromise = loadCatalog()
    .then((problems) => {
      catalogCache = { problems, fetchedAt: Date.now() }
      return problems
    })
    .finally(() => {
      catalogLoadPromise = null
    })

  return catalogLoadPromise
}

// Preloads problem catalog in the background so the first request is instant.
export const warmProblemCatalog = () => {
  fetchProblemCatalog().catch(() => {})
}
