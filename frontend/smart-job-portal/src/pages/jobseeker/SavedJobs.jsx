import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { savedJobService } from '../../services/savedJobService'
import { applicationService } from '../../services/applicationService'
import Toast from '../../components/Toast'

export default function SavedJobs() {
  const navigate = useNavigate()
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    savedJobService.getSavedJobs()
      .then(res => setSavedJobs(res.data))
      .catch(() => setToast({ message: 'Failed to load saved jobs', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (jobId) => {
    setActionLoading(l => ({ ...l, [jobId]: true }))
    try {
      await savedJobService.unsaveJob(jobId)
      setSavedJobs(s => s.filter(j => j.jobId !== jobId))
      setToast({ message: 'Job removed from saved list', type: 'info' })
    } catch { setToast({ message: 'Failed to remove', type: 'error' }) }
    finally { setActionLoading(l => ({ ...l, [jobId]: false })) }
  }

  const handleApply = async (jobId) => {
    setActionLoading(l => ({ ...l, [`apply_${jobId}`]: true }))
    try {
      await applicationService.apply(jobId)
      setSavedJobs(s => s.map(j => j.jobId === jobId ? { ...j, alreadyApplied: true } : j))
      setToast({ message: 'Application submitted!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to apply', type: 'error' })
    } finally { setActionLoading(l => ({ ...l, [`apply_${jobId}`]: false })) }
  }

  if (loading) return <div className="loading">Loading saved jobs...</div>

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No saved jobs</h3>
          <p>Save jobs you're interested in to apply later</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid grid-3">
          {savedJobs.map(sj => (
            <div key={sj.id} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{sj.jobTitle}</h3>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.5rem' }}>🏢 {sj.companyName}</p>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                {sj.location && <span>📍 {sj.location} · </span>}
                {sj.jobType && <span>{sj.jobType.replace('_', ' ')} · </span>}
                {sj.salary && <span>💰 {sj.salary}</span>}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Saved {sj.savedAt ? new Date(sj.savedAt).toLocaleDateString() : ''}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/jobs/${sj.jobId}`} className="btn btn-outline btn-sm">View</Link>
                <button
                  className={`btn btn-sm ${sj.alreadyApplied ? 'btn-secondary' : 'btn-success'}`}
                  onClick={() => handleApply(sj.jobId)}
                  disabled={sj.alreadyApplied || actionLoading[`apply_${sj.jobId}`] || sj.status !== 'ACTIVE'}
                >{sj.alreadyApplied ? 'Applied' : 'Apply'}</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemove(sj.jobId)} disabled={actionLoading[sj.jobId]}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
