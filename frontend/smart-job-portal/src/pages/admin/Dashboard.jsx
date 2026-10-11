import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: data?.totalUsers ?? 0 },
          { label: 'Job Seekers', value: data?.totalJobSeekers ?? 0, color: '#0891b2' },
          { label: 'Recruiters', value: data?.totalRecruiters ?? 0, color: '#7e22ce' },
          { label: 'Total Jobs', value: data?.totalJobs ?? 0 },
          { label: 'Active Jobs', value: data?.activeJobs ?? 0, color: '#16a34a' },
          { label: 'Total Applications', value: data?.totalApplications ?? 0 },
          { label: 'Pending Applications', value: data?.pendingApplications ?? 0, color: '#d97706' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color || '#2563eb' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/admin/users" className="btn btn-primary">👥 Manage Users</Link>
        <Link to="/admin/jobs" className="btn btn-outline">💼 Manage Jobs</Link>
        <Link to="/admin/applications" className="btn btn-outline">📋 Manage Applications</Link>
      </div>
    </div>
  )
}
