import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import Toast from '../../components/Toast'

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const fetchJobs = async (page = 0) => {
    setLoading(true)
    try {
      const res = await jobService.getRecruiterJobs({ page, size: 10 })
      setJobs(res.data.content)
      setPagination({ page: res.data.page, totalPages: res.data.totalPages })
    } catch { setToast({ message: 'Failed to load jobs', type: 'error' }) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleDelete = (id) => {
    setConfirm({
      message: 'Deactivate this job? It will no longer be visible to job seekers.',
      onConfirm: async () => {
        setConfirm(null)
        try {
          await jobService.deleteJob(id)
          setToast({ message: 'Job deactivated', type: 'info' })
          fetchJobs(pagination.page)
        } catch { setToast({ message: 'Failed to deactivate', type: 'error' }) }
      }
    })
  }

  if (loading) return <div className="loading">Loading jobs...</div>

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Jobs</h1>
        <Link to="/recruiter/jobs/create" className="btn btn-primary">➕ Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs posted yet</h3>
          <Link to="/recruiter/jobs/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post Your First Job</Link>
        </div>
      ) : (
        <div className="card table-container">
          <table>
            <thead>
              <tr><th>Title</th><th>Location</th><th>Type</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 500 }}>{job.title}</td>
                  <td>{job.location || '—'}</td>
                  <td>{job.jobType?.replace('_', ' ') || '—'}</td>
                  <td><span className={`badge ${job.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span></td>
                  <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline btn-sm">Applicants</Link>
                      <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn btn-outline btn-sm">Edit</Link>
                      {job.status === 'ACTIVE' && <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Deactivate</button>}
                    </div>
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
