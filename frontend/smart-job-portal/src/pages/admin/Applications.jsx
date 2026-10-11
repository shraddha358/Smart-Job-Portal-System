import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import Toast from '../../components/Toast'

const statusBadge = { APPLIED: 'badge-blue', UNDER_REVIEW: 'badge-yellow', SHORTLISTED: 'badge-cyan', INTERVIEW: 'badge-purple', SELECTED: 'badge-green', REJECTED: 'badge-red' }
const ALL_STATUSES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [updating, setUpdating] = useState({})

  const fetchApplications = useCallback(async (page = 0) => {
    setLoading(true)
    try {
      const params = { page, size: 10, ...(statusFilter ? { status: statusFilter } : {}) }
      const res = await adminService.getApplications(params)
      setApplications(res.data.content)
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalElements: res.data.totalElements })
    } catch { setToast({ message: 'Failed to load applications', type: 'error' }) }
    finally { setLoading(false) }
  }, [statusFilter])

  useEffect(() => { fetchApplications(0) }, [fetchApplications])

  const handleStatusChange = async (id, status) => {
    setUpdating(u => ({ ...u, [id]: true }))
    try {
      await adminService.updateApplicationStatus(id, status)
      setApplications(a => a.map(app => app.id === id ? { ...app, status } : app))
      setToast({ message: 'Status updated', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' })
    } finally { setUpdating(u => ({ ...u, [id]: false })) }
  }

  const handleDelete = (app) => {
    setConfirm({
      message: `Delete application from "${app.applicantName}" for "${app.jobTitle}"?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await adminService.deleteApplication(app.id)
          setToast({ message: 'Application deleted', type: 'info' })
          fetchApplications(pagination.page)
        } catch (err) {
          setToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' })
        }
      }
    })
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h1 className="page-title">Application Management</h1>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <button className="btn btn-outline" onClick={() => setStatusFilter('')}>Clear</button>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{pagination.totalElements} applications found</p>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="card table-container">
          <table>
            <thead>
              <tr><th>Applicant</th><th>Job</th><th>Company</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{app.applicantName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.applicantEmail}</div>
                  </td>
                  <td>{app.jobTitle}</td>
                  <td>{app.companyName}</td>
                  <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)}
                      disabled={updating[app.id]} style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(app)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchApplications} />
    </div>
  )
}
