import api from '../../services/axios.js'

export const leetcodeApi = {
  connectProfile: (username) => api.post('/leetcode/connect', { username }),
  getProfile: () => api.get('/leetcode/profile'),
  syncProfile: () => api.post('/leetcode/sync'),
  disconnectProfile: () => api.delete('/leetcode/disconnect'),
}
