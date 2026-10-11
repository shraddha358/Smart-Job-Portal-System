import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const statusBadge = { APPLIED: 'badge-blue', UNDER_REVIEW: 'badge-yellow', SHORTLISTED: 'badge-cyan', INTERVIEW: 'badge-purple', SELECTED: 'badge-green', REJECTED: 'badge-red' }

export default function RecruiterDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/recruiter/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <h1 className="page-title">Recruiter Dashboard</h1>

      <div className="grid grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Jobs Posted', value: data?.totalJobsPosted ?? 0 },
          { label: 'Active Jobs', value: data?.activeJobs ?? 0, color: '#16a34a' },
          { label: 'Total Applicants', value: data?.totalApplicants ?? 0 },
          { label: 'Pending Applications', value: data?.pendingApplications ?? 0, color: '#d97706' },
          { label: 'Selected Candidates', value: data?.selectedCandidates ?? 0, color: '#16a34a' },
          { label: 'Rejected', value: data?.rejectedCandidates ?? 0, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color || '#2563eb' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/recruiter/jobs/create" className="btn btn-primary">➕ Post New Job</Link>
        <Link to="/recruiter/jobs" className="btn btn-outline">💼 My Jobs</Link>
        <Link to="/recruiter/profile" className="btn btn-outline">🏢 Company Profile</Link>
      </div>

      {data?.recentJobs?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Recent Jobs</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Posted</th><th>Action</th></tr></thead>
              <tbody>
                {data.recentJobs.map(job => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 500 }}>{job.title}</td>
                    <td><span className={`badge ${job.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span></td>
                    <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}</td>
                    <td><Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline btn-sm">Applicants</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.recentApplications?.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Recent Applications</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Applicant</th><th>Job</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentApplications.map(app => (
                  <tr key={app.id}>
                    <td>{app.applicantName}</td>
                    <td>{app.jobTitle}</td>
                    <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                    <td><span className={`badge ${statusBadge[app.status] || 'badge-gray'}`}>{app.status?.replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
