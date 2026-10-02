import mongoose from 'mongoose'

const solvedProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'userId is required'],
      trim: true,
      unique: true,
      index: true,
    },
    questionIds: {
      type: [Number],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.every((id) => Number.isInteger(id)),
        message: 'All question IDs must be valid integers',
      },
    },
  },
  {
    collection: 'solvedProblems',
    timestamps: true,
    versionKey: false,
  },
)

// Ensure unique index is registered on userId
solvedProblemSchema.index({ userId: 1 }, { unique: true })

export const SolvedProblem = mongoose.model('SolvedProblem', solvedProblemSchema)
