import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../../services/applicationService'

const statusBadge = { APPLIED: 'badge-blue', UNDER_REVIEW: 'badge-yellow', SHORTLISTED: 'badge-cyan', INTERVIEW: 'badge-purple', SELECTED: 'badge-green', REJECTED: 'badge-red' }

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    applicationService.getMyApplications()
      .then(res => setApplications(res.data))
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading applications...</div>

  return (
    <div>
      <h1 className="page-title">My Applications</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Browse jobs and apply to get started</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="table-container card">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td><Link to={`/jobs/${app.jobId}`} style={{ fontWeight: 500 }}>{app.jobTitle}</Link></td>
                  <td>{app.companyName}</td>
                  <td>{app.location || '—'}</td>
                  <td>{app.jobType?.replace('_', ' ') || '—'}</td>
                  <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge ${statusBadge[app.status] || 'badge-gray'}`}>{app.status?.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
