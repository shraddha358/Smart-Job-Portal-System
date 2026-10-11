import api from './api'

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  // Recruiter
  getRecruiterJobs: (params) => api.get('/recruiter/jobs', { params }),
  getRecruiterJobById: (id) => api.get(`/recruiter/jobs/${id}`),
  createJob: (data) => api.post('/recruiter/jobs', data),
  updateJob: (id, data) => api.put(`/recruiter/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/recruiter/jobs/${id}`),
  getJobApplicants: (jobId) => api.get(`/recruiter/jobs/${jobId}/applicants`),
}
