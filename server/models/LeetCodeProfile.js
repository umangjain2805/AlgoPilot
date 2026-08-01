import mongoose from 'mongoose'

const calendarSchema = new mongoose.Schema(
  {
    activeYears: { type: [Number], default: [] },
    streak: { type: Number, default: 0 },
    totalActiveDays: { type: Number, default: 0 },
  },
  { _id: false },
)

const badgeSchema = new mongoose.Schema(
  {
    badgeId: { type: String, default: '' },
    displayName: { type: String, default: '' },
    icon: { type: String, default: '' },
    creationDate: { type: Date, default: null },
  },
  { _id: false },
)

const recentSubmissionSchema = new mongoose.Schema(
  {
    submissionId: { type: String, default: '' },
    title: { type: String, default: '' },
    titleSlug: { type: String, default: '' },
    timestamp: { type: Number, default: 0 },
    statusDisplay: { type: String, default: '' },
    lang: { type: String, default: '' },
  },
  { _id: false },
)

// One user -> one LeetCode profile.
const leetCodeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    leetcodeUsername: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    realName: { type: String, default: '' },
    ranking: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    avatar: { type: String, default: '' },
    country: { type: String, default: '' },
    school: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    contributionPoints: { type: Number, default: 0 },
    heatmap: { type: mongoose.Schema.Types.Mixed, default: {} },
    calendar: { type: calendarSchema, default: () => ({}) },
    badges: { type: [badgeSchema], default: [] },
    contestRating: { type: Number, default: 0 },
    contestGlobalRanking: { type: Number, default: null },
    contestTopPercentage: { type: Number, default: null },
    recentSubmissions: { type: [recentSubmissionSchema], default: [] },
    lastSyncedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v
        return ret
      },
    },
  },
)

export const LeetCodeProfile = mongoose.model('LeetCodeProfile', leetCodeProfileSchema)
