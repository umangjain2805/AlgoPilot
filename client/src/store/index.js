import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import leetcodeReducer from '../features/leetcode/leetcodeSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leetcode: leetcodeReducer,
  },
  devTools: import.meta.env.DEV,
})
