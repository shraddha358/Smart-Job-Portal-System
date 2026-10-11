import api from './api'

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  updateJobStatus: (id, status) => api.patch(`/admin/jobs/${id}/status`, { status }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getApplications: (params) => api.get('/admin/applications', { params }),
  updateApplicationStatus: (id, status) => api.patch(`/admin/applications/${id}/status`, { status }),
  deleteApplication: (id) => api.delete(`/admin/applications/${id}`),
}
