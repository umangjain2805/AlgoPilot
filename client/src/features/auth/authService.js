import api from '../../services/axios.js'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  guestLogin: (data) => api.post('/auth/guest', data),
}
