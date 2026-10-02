// GraphQL operations used to fetch public LeetCode profile data.

export const USER_PROFILE_QUERY = `
  query userPublicProfile($username: String!, $year: Int) {
    matchedUser(username: $username) {
      username
      githubUrl
      twitterUrl
      linkedinUrl
      profile {
        realName
        userAvatar
        ranking
        reputation
        countryName
        school
        websites
        aboutMe
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`

export const CONTEST_RANKING_QUERY = `
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
  }
`

export const RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int) {
    recentSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`

export const RECENT_AC_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`

export const SKILL_STATS_QUERY = `
  query skillStats($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`

// Paginated listing of the full problem catalog (all difficulty levels and
// topics, free and paid). Used to map a user's solved slugs onto topic tags so
// coverage is measured against every LeetCode problem they've actually solved.
export const PROBLEM_LIST_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
      total: totalNum
      questions: data {
        questionFrontendId
        title
        titleSlug
        difficulty
        isPaidOnly
        topicTags {
          name
          slug
        }
      }
    }
  }
`
