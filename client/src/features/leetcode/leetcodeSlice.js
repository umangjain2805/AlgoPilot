import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { leetcodeApi } from './leetcodeService.js'

const initialState = {
  loading: false,
  profile: null,
  connected: false,
  error: null,
  lastSynced: null,
}

export const connectLeetCode = createAsyncThunk(
  'leetcode/connect',
  async (username, { rejectWithValue }) => {
    try {
      const { data } = await leetcodeApi.connectProfile(username)
      return data.data.profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to connect LeetCode profile')
    }
  },
)

export const fetchLeetCodeProfile = createAsyncThunk(
  'leetcode/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await leetcodeApi.getProfile()
      return data.data.profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to fetch LeetCode profile')
    }
  },
)

export const syncLeetCodeProfile = createAsyncThunk(
  'leetcode/sync',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await leetcodeApi.syncProfile()
      return data.data.profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to sync LeetCode profile')
    }
  },
)

export const disconnectLeetCodeProfile = createAsyncThunk(
  'leetcode/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      await leetcodeApi.disconnectProfile()
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to disconnect LeetCode profile')
    }
  },
)

const leetcodeSlice = createSlice({
  name: 'leetcode',
  initialState,
  reducers: {
    clearLeetCodeError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect
      .addCase(connectLeetCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(connectLeetCode.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.connected = true
        state.lastSynced = action.payload.lastSyncedAt
        state.error = null
      })
      .addCase(connectLeetCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch stored profile
      .addCase(fetchLeetCodeProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchLeetCodeProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.connected = true
        state.lastSynced = action.payload.lastSyncedAt
        state.error = null
      })
      .addCase(fetchLeetCodeProfile.rejected, (state, action) => {
        state.loading = false
        state.connected = false
        state.profile = null
        state.lastSynced = null
        state.error = action.payload
      })
      // Sync
      .addCase(syncLeetCodeProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(syncLeetCodeProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.connected = true
        state.lastSynced = action.payload.lastSyncedAt
        state.error = null
      })
      .addCase(syncLeetCodeProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Disconnect
      .addCase(disconnectLeetCodeProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(disconnectLeetCodeProfile.fulfilled, (state) => {
        state.loading = false
        state.profile = null
        state.connected = false
        state.lastSynced = null
        state.error = null
      })
      .addCase(disconnectLeetCodeProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearLeetCodeError } = leetcodeSlice.actions

export const selectLeetCodeProfile = (state) => state.leetcode.profile
export const selectLeetCodeConnected = (state) => state.leetcode.connected
export const selectLeetCodeLoading = (state) => state.leetcode.loading
export const selectLeetCodeError = (state) => state.leetcode.error
export const selectLeetCodeLastSynced = (state) => state.leetcode.lastSynced

export default leetcodeSlice.reducer
