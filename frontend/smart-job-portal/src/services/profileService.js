import api from './api'

export const profileService = {
  getJobSeekerProfile: () => api.get('/jobseeker/profile'),
  updateJobSeekerProfile: (data) => api.put('/jobseeker/profile', data),
  uploadResume: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/jobseeker/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  downloadResume: () => api.get('/jobseeker/resume/download', { responseType: 'blob' }),
  deleteResume: () => api.delete('/jobseeker/resume'),
  getRecruiterProfile: () => api.get('/recruiter/profile'),
  updateRecruiterProfile: (data) => api.put('/recruiter/profile', data),
}
