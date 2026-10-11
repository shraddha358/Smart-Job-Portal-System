import api from './api'

export const savedJobService = {
  getSavedJobs: () => api.get('/saved-jobs'),
  saveJob: (jobId) => api.post(`/saved-jobs/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/saved-jobs/${jobId}`),
}
