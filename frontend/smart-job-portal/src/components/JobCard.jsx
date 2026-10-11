import { Link } from 'react-router-dom'

const jobTypeBadge = { FULL_TIME: 'badge-blue', PART_TIME: 'badge-yellow', INTERNSHIP: 'badge-green', CONTRACT: 'badge-purple', REMOTE: 'badge-cyan' }

export default function JobCard({ job, actions }) {
  const isExpired = job.applicationDeadline && new Date(job.applicationDeadline) < new Date()

  return (
    <div className="card" style={{ borderLeft: `4px solid ${job.status === 'ACTIVE' ? '#2563eb' : '#94a3b8'}` }}>
      <div className="flex-between mb-1">
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{job.title}</h3>
        <span className={`badge ${jobTypeBadge[job.jobType] || 'badge-gray'}`}>{job.jobType?.replace('_', ' ')}</span>
      </div>
      <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.5rem' }}>🏢 {job.companyName}</p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {job.location && <span>📍 {job.location}</span>}
        {job.salary && <span>💰 {job.salary}</span>}
        {job.experienceRequired && <span>🎯 {job.experienceRequired}</span>}
      </div>
      {job.skills && (
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
          🛠 {job.skills.split(',').slice(0, 4).join(', ')}
        </p>
      )}
      <div className="flex-between" style={{ marginTop: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          {isExpired ? <span style={{ color: '#dc2626' }}>⚠ Deadline passed</span>
            : job.applicationDeadline ? `Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}` : ''}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">View</Link>
          {actions}
        </div>
      </div>
    </div>
  )
}
