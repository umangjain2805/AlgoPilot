import problems from '../data/leetcode-problems.json' with { type: 'json' }

export const PROBLEMS = problems

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api'

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
      if (
        !['leetcode.com', 'www.leetcode.com'].includes(url.hostname) ||
        !['http:', 'https:'].includes(url.protocol)
      )
        return ''
      const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
      if (segments.length === 2 && segments[0] === 'u') return segments[1]
      return segments.length === 1 && !['problems', 'contest', 'discuss', 'u'].includes(segments[0])
        ? segments[0]
        : ''
    } catch {
      return ''
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
    signal: AbortSignal.timeout(45000),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }

  if (!payload.data?.profile?.leetcodeUsername)
    throw new Error('The server returned an incomplete profile.')
  return payload.data.profile
}

// The 20 canonical DSA topics requested by the user with their corresponding LeetCode tags.
export { CURATED_DSA_TOPICS } from './topics.js'
export { buildAnalysis, buildPlan } from './practice.js'
