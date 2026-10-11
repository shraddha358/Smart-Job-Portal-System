import api from './api'

export const applicationService = {
  apply: (jobId) => api.post('/applications', { jobId }),
  getMyApplications: () => api.get('/applications/my'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStatus: (applicationId, status) =>
    api.patch(`/recruiter/applications/${applicationId}/status`, { status }),
  downloadResume: (applicationId) =>
    api.get(`/recruiter/applications/${applicationId}/resume`, { responseType: 'blob' }),
}
