import api from './api'

export const recruiterService = {
  getDashboard: () => api.get('/recruiter/dashboard'),
}
