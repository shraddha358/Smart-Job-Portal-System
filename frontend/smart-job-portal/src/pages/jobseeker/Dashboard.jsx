import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import JobCard from '../../components/JobCard'

export default function JobSeekerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/jobseeker/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  const stats = data?.applicationStatusStats || {}

  return (
    <div>
      <h1 className="page-title">My Dashboard</h1>

      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-value">{data?.totalAvailableJobs ?? 0}</div>
          <div className="stat-label">Available Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data?.savedJobsCount ?? 0}</div>
          <div className="stat-label">Saved Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data?.applicationsCount ?? 0}</div>
          <div className="stat-label">Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#16a34a' }}>{stats.SELECTED ?? 0}</div>
          <div className="stat-label">Selected</div>
        </div>
      </div>

      {data?.applicationsCount > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Application Status</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {Object.entries(stats).filter(([, v]) => v > 0).map(([status, count]) => (
              <div key={status} style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: 8 }}>
                <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{count}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{status.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/jobseeker/profile" className="btn btn-outline">👤 My Profile</Link>
        <Link to="/jobs" className="btn btn-primary">🔍 Browse Jobs</Link>
        <Link to="/jobseeker/applications" className="btn btn-outline">📋 My Applications</Link>
        <Link to="/jobseeker/saved-jobs" className="btn btn-outline">🔖 Saved Jobs</Link>
      </div>

      {data?.recentJobs?.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Recently Posted Jobs</h3>
          <div className="grid grid-3">
            {data.recentJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      )}
    </div>
  )
}
