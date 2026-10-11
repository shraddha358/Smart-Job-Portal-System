import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import Toast from '../../components/Toast'

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [filters, setFilters] = useState({ keyword: '', status: '' })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const fetchJobs = useCallback(async (page = 0) => {
    setLoading(true)
    try {
      const params = { page, size: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
      const res = await adminService.getJobs(params)
      setJobs(res.data.content)
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalElements: res.data.totalElements })
    } catch { setToast({ message: 'Failed to load jobs', type: 'error' }) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchJobs(0) }, [fetchJobs])

  const handleStatusToggle = (job) => {
    const newStatus = job.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setConfirm({
      message: `${newStatus === 'INACTIVE' ? 'Deactivate' : 'Activate'} job "${job.title}"?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await adminService.updateJobStatus(job.id, newStatus)
          setToast({ message: `Job ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`, type: 'success' })
          fetchJobs(pagination.page)
        } catch (err) {
          setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' })
        }
      }
    })
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h1 className="page-title">Job Management</h1>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input placeholder="Search by title..." value={filters.keyword}
            onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            style={{ flex: 1, minWidth: 200 }} />
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ width: 'auto' }}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button className="btn btn-outline" onClick={() => setFilters({ keyword: '', status: '' })}>Clear</button>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{pagination.totalElements} jobs found</p>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="card table-container">
          <table>
            <thead>
              <tr><th>Title</th><th>Company</th><th>Recruiter</th><th>Type</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 500 }}>{job.title}</td>
                  <td>{job.companyName}</td>
                  <td>{job.recruiterName}</td>
                  <td>{job.jobType?.replace('_', ' ') || '—'}</td>
                  <td><span className={`badge ${job.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span></td>
                  <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <button className={`btn btn-sm ${job.status === 'ACTIVE' ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => handleStatusToggle(job)}>
                      {job.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchJobs} />
    </div>
  )
}
