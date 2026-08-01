import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ApiError } from '../../utils/ApiError.js'

const LEETCODE_URL = 'https://leetcode.com'
const LEETCODE_GRAPHQL_URL = `${LEETCODE_URL}/graphql`

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// LeetCode's bot protection blocks non-browser TLS fingerprints (including Node's
// native fetch), so requests are made through the system curl binary, which is
// available on Windows 10+, macOS and Linux.
const cookieJar = path.join(os.tmpdir(), `lc-csrftoken-${process.pid}.txt`)

let csrfToken = null
let csrfPromise = null

const runCurl = (args, input) =>
  new Promise((resolve, reject) => {
    const child = spawn('curl', args, { windowsHide: true })
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('error', reject)
    child.on('close', (code) => resolve({ code, stdout, stderr }))

    if (input) child.stdin.write(input)
    child.stdin.end()
  })

// Runs curl and returns the HTTP status plus the response body.
const curlRequest = async (args, input) => {
  const { code, stdout } = await runCurl([...args, '-w', '\n__HTTP_STATUS__:%{http_code}'], input)

  if (code !== 0) {
    throw new ApiError(502, 'Unable to reach LeetCode. Please try again later.')
  }

  const parts = stdout.trim().split('\n')
  const statusLine = parts.pop() || ''
  const status = Number(statusLine.split(':')[1])
  const body = parts.join('\n')

  return { status, body }
}

// Obtains (and caches) the csrftoken cookie required by LeetCode's CSRF protection.
const ensureCsrfToken = async () => {
  if (csrfToken) return csrfToken

  if (!csrfPromise) {
    csrfPromise = (async () => {
      await curlRequest([
        '-s',
        '-c',
        cookieJar,
        '-o',
        os.devNull,
        '-H',
        `User-Agent: ${USER_AGENT}`,
        '-H',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        LEETCODE_URL,
      ])

      const jarContents = fs.existsSync(cookieJar) ? fs.readFileSync(cookieJar, 'utf8') : ''
      const match = jarContents.match(/csrftoken\s+(\S+)/)

      if (!match) {
        throw new ApiError(502, 'Unable to initialize LeetCode session. Please try again later.')
      }

      csrfToken = match[1]
      return csrfToken
    })().finally(() => {
      csrfPromise = null
    })
  }

  return csrfPromise
}

const graphqlRequest = async ({ query, variables = {}, username }) => {
  const attempt = async () => {
    const token = await ensureCsrfToken()
    const body = JSON.stringify({ query, variables })

    return curlRequest(
      [
        '-s',
        '-b',
        cookieJar,
        '-c',
        cookieJar,
        '-X',
        'POST',
        '-H',
        'Content-Type: application/json',
        '-H',
        'Accept: application/json',
        '-H',
        `User-Agent: ${USER_AGENT}`,
        '-H',
        'Origin: https://leetcode.com',
        '-H',
        `Referer: ${LEETCODE_URL}/u/${username || ''}/`,
        '-H',
        `X-CSRFToken: ${token}`,
        '--data-binary',
        '@-',
        LEETCODE_GRAPHQL_URL,
      ],
      body,
    )
  }

  let { status, body } = await attempt()

  // A 403 usually means the CSRF token expired; refresh it and retry once.
  if (status === 403) {
    csrfToken = null
    if (fs.existsSync(cookieJar)) fs.unlinkSync(cookieJar)
    ;({ status, body } = await attempt())
  }

  if (status !== 200) {
    throw new ApiError(502, 'LeetCode is temporarily unavailable. Please try again later.')
  }

  let json
  try {
    json = JSON.parse(body)
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
