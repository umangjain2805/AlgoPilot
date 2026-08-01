import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from './authService.js'

const STORAGE_KEY = 'ai_leetcode_coach_auth'

const loadPersistedAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persisted = loadPersistedAuth()

const initialState = {
  user: persisted?.user ?? null,
  token: persisted?.token ?? null,
  isLoading: false,
  error: null,
  guestMode: persisted?.guestMode ?? false,
  isAuthenticated: persisted?.user ? true : false,
  status: persisted?.user ? 'authenticated' : 'idle',
}

const persistAuth = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        token: state.token,
        guestMode: state.guestMode,
      }),
    )
  } catch {
    // Ignore persistence failures (e.g. private browsing).
  }
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(userData)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  },
)

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout()
    return null
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed')
  }
})

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authApi.getMe()
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
    }
  },
)

export const loginWithGoogle = createAsyncThunk(
  'auth/google',
  async (idToken, { rejectWithValue }) => {
    try {
      const { data } = await authApi.googleLogin(idToken)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Google login failed')
    }
  },
)

export const loginAsGuest = createAsyncThunk(
  'auth/guest',
  async (guestData, { rejectWithValue }) => {
    try {
      const { data } = await authApi.guestLogin(guestData)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Guest login failed')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token, guestMode = false } = action.payload
      state.user = user
      state.token = token ?? null
      state.guestMode = guestMode
      state.isAuthenticated = true
      state.status = 'authenticated'
      state.error = null
      persistAuth(state)
    },
    clearCredentials(state) {
      state.user = null
      state.token = null
      state.guestMode = false
      state.isAuthenticated = false
      state.status = 'unauthenticated'
      state.error = null
      localStorage.removeItem(STORAGE_KEY)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token ?? null
        state.isAuthenticated = true
        state.status = 'authenticated'
        state.error = null
        persistAuth(state)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token ?? null
        state.isAuthenticated = true
        state.status = 'authenticated'
        state.error = null
        persistAuth(state)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.guestMode = false
        state.isAuthenticated = false
        state.status = 'unauthenticated'
        state.error = null
        localStorage.removeItem(STORAGE_KEY)
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.guestMode = false
        state.isAuthenticated = false
        state.status = 'unauthenticated'
        state.error = null
        localStorage.removeItem(STORAGE_KEY)
      })
      // Get current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.status = 'authenticated'
        state.error = null
        persistAuth(state)
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.status = 'unauthenticated'
        localStorage.removeItem(STORAGE_KEY)
      })
      // Google login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token ?? null
        state.isAuthenticated = true
        state.status = 'authenticated'
        state.error = null
        persistAuth(state)
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Guest login
      .addCase(loginAsGuest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsGuest.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token ?? null
        state.guestMode = true
        state.isAuthenticated = true
        state.status = 'authenticated'
        state.error = null
        persistAuth(state)
      })
      .addCase(loginAsGuest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setCredentials, clearCredentials, clearError } = authSlice.actions

export default authSlice.reducer
