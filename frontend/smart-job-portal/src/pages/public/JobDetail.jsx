import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import { savedJobService } from '../../services/savedJobService'
import { useAuth } from '../../context/AuthContext'
import Toast from '../../components/Toast'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isJobSeeker } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    jobService.getJobById(id)
      .then(res => setJob(res.data))
      .catch(() => setError('Job not found'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!isJobSeeker) return
    Promise.all([savedJobService.getSavedJobs(), applicationService.getMyApplications()])
      .then(([savedRes, appRes]) => {
        setSaved(savedRes.data.some(s => s.jobId === Number(id)))
        setApplied(appRes.data.some(a => a.jobId === Number(id)))
      }).catch(() => {})
  }, [id, isJobSeeker])

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setActionLoading(true)
    try {
      await applicationService.apply(Number(id))
      setApplied(true)
      setToast({ message: 'Application submitted successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to apply', type: 'error' })
    } finally { setActionLoading(false) }
  }

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setActionLoading(true)
    try {
      if (saved) {
        await savedJobService.unsaveJob(Number(id))
        setSaved(false)
        setToast({ message: 'Job removed from saved list', type: 'info' })
      } else {
        await savedJobService.saveJob(Number(id))
        setSaved(true)
        setToast({ message: 'Job saved!', type: 'success' })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' })
    } finally { setActionLoading(false) }
  }

  if (loading) return <div className="loading">Loading job details...</div>
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>
  if (!job) return null

  const isExpired = job.applicationDeadline && new Date(job.applicationDeadline) < new Date()

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Back</button>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{job.title}</h1>
            <p style={{ color: '#475569', marginTop: '0.25rem' }}>🏢 {job.companyName}</p>
          </div>
          <span className={`badge ${job.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#475569' }}>
          {job.location && <span>📍 {job.location}</span>}
          {job.jobType && <span>💼 {job.jobType.replace('_', ' ')}</span>}
          {job.salary && <span>💰 {job.salary}</span>}
          {job.experienceRequired && <span>🎯 {job.experienceRequired}</span>}
          {job.applicationDeadline && <span style={{ color: isExpired ? '#dc2626' : '#475569' }}>📅 Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>}
        </div>

        {isJobSeeker && (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button className={`btn ${applied ? 'btn-secondary' : 'btn-primary'}`} onClick={handleApply}
              disabled={applied || actionLoading || isExpired || job.status !== 'ACTIVE'}>
              {applied ? '✓ Applied' : isExpired ? 'Deadline Passed' : 'Apply Now'}
            </button>
            <button className={`btn ${saved ? 'btn-secondary' : 'btn-outline'}`} onClick={handleSave} disabled={actionLoading}>
              {saved ? '🔖 Saved' : '🔖 Save Job'}
            </button>
          </div>
        )}
        {!isAuthenticated && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login to Apply</button>
          </div>
        )}

        {job.skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.skills.split(',').map(s => <span key={s} className="badge badge-blue">{s.trim()}</span>)}
            </div>
          </div>
        )}

        {job.description && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Job Description</h3>
            <p style={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.description}</p>
          </div>
        )}

        {job.responsibilities && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Responsibilities</h3>
            <p style={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.responsibilities}</p>
          </div>
        )}

        {job.qualifications && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Qualifications</h3>
            <p style={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.qualifications}</p>
          </div>
        )}

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Posted by {job.recruiterName} · {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}
        </div>
      </div>
    </div>
  )
}
