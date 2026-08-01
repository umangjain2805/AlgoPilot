// Transforms raw LeetCode GraphQL payloads into our normalized schema shape.

const getCount = (arr = [], difficulty) =>
  arr.find((item) => item?.difficulty === difficulty)?.count ?? 0

const round = (value, decimals = 2) => Math.round(value * 10 ** decimals) / 10 ** decimals

const parseBadgeDate = (creationDate) => {
  const seconds = Number(creationDate)
  if (!seconds || Number.isNaN(seconds)) return null
  return new Date(seconds * 1000)
}

const parseHeatmap = (submissionCalendar) => {
  if (!submissionCalendar || submissionCalendar === '{}') return {}

  try {
    return typeof submissionCalendar === 'string'
      ? JSON.parse(submissionCalendar)
      : submissionCalendar
  } catch {
    return {}
  }
}

export const normalizeProfile = ({ matchedUser, contestRanking, recentSubmissions }) => {
  const profile = matchedUser?.profile || {}
  const submitStats = matchedUser?.submitStats || {}
  const acSubmissionNum = submitStats.acSubmissionNum || []
  const totalSubmissionNum = submitStats.totalSubmissionNum || []
  const calendar = matchedUser?.userCalendar || {}
  const badges = matchedUser?.badges || []
  const websites = Array.isArray(profile.websites) ? profile.websites : []

  const totalSolved = getCount(acSubmissionNum, 'All')
  const easySolved = getCount(acSubmissionNum, 'Easy')
  const mediumSolved = getCount(acSubmissionNum, 'Medium')
  const hardSolved = getCount(acSubmissionNum, 'Hard')
  const totalSubmissions = getCount(totalSubmissionNum, 'All')

  return {
    leetcodeUsername: matchedUser?.username || '',
    realName: profile.realName || '',
    ranking: profile.ranking || 0,
    reputation: profile.reputation || 0,
    avatar: profile.userAvatar || '',
    country: profile.countryName || '',
    school: profile.school || '',
    github: matchedUser?.githubUrl || '',
    linkedin: matchedUser?.linkedinUrl || '',
    twitter: matchedUser?.twitterUrl || '',
    website: websites[0] || '',
    easySolved,
    mediumSolved,
    hardSolved,
    totalSolved,
    acceptanceRate: totalSubmissions ? round((totalSolved / totalSubmissions) * 100) : 0,
    contributionPoints: profile.contributionPoints ?? 0,
    heatmap: parseHeatmap(calendar.submissionCalendar),
    calendar: {
      activeYears: calendar.activeYears || [],
      streak: calendar.streak || 0,
      totalActiveDays: calendar.totalActiveDays || 0,
    },
    badges: badges.map((badge) => ({
      badgeId: badge.id || '',
      displayName: badge.displayName || '',
      icon: badge.icon || '',
      creationDate: parseBadgeDate(badge.creationDate),
    })),
    contestRating: contestRanking?.rating ?? 0,
    contestGlobalRanking: contestRanking?.globalRanking ?? null,
    contestTopPercentage: contestRanking?.topPercentage ?? null,
    recentSubmissions: (recentSubmissions || []).map((submission) => ({
      submissionId: String(submission.id || ''),
      title: submission.title || '',
      titleSlug: submission.titleSlug || '',
      timestamp: Number(submission.timestamp || 0),
      statusDisplay: submission.statusDisplay || '',
      lang: submission.lang || '',
    })),
  }
}
