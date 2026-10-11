import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { applicationService } from '../../services/applicationService'
import Toast from '../../components/Toast'

const STATUSES = ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']
const statusBadge = { APPLIED: 'badge-blue', UNDER_REVIEW: 'badge-yellow', SHORTLISTED: 'badge-cyan', INTERVIEW: 'badge-purple', SELECTED: 'badge-green', REJECTED: 'badge-red' }

export default function Applicants() {
  const { jobId } = useParams()
  const [applicants, setApplicants] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    Promise.all([
      jobService.getRecruiterJobById(jobId),
      jobService.getJobApplicants(jobId)
    ]).then(([jobRes, appRes]) => {
      setJob(jobRes.data)
      setApplicants(appRes.data)
    }).catch(() => setToast({ message: 'Failed to load applicants', type: 'error' }))
    .finally(() => setLoading(false))
  }, [jobId])

  const handleStatusChange = async (applicationId, status) => {
    setUpdating(u => ({ ...u, [applicationId]: true }))
    try {
      const res = await applicationService.updateStatus(applicationId, status)
      setApplicants(a => a.map(app => app.id === applicationId ? { ...app, status: res.data.status } : app))
      setToast({ message: 'Status updated', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' })
    } finally { setUpdating(u => ({ ...u, [applicationId]: false })) }
  }

  const handleDownloadResume = async (applicationId, fileName) => {
    try {
      const res = await applicationService.downloadResume(applicationId)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href = url; a.download = fileName || 'resume'; a.click()
      URL.revokeObjectURL(url)
    } catch { setToast({ message: 'Resume download failed', type: 'error' }) }
  }

  if (loading) return <div className="loading">Loading applicants...</div>

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">← Back to Jobs</Link>
      </div>
      <h1 className="page-title">Applicants — {job?.title}</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p>

      {applicants.length === 0 ? (
        <div className="empty-state"><h3>No applicants yet</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applicants.map(app => (
            <div key={app.id} className="card">
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{app.applicantName}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569' }}>{app.applicantEmail} · {app.applicantPhone || 'No phone'}</p>
                </div>
                <span className={`badge ${statusBadge[app.status] || 'badge-gray'}`}>{app.status?.replace('_', ' ')}</span>
              </div>
              {app.applicantSkills && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>🛠 {app.applicantSkills}</p>
              )}
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {app.hasResume && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleDownloadResume(app.id, app.resumeFileName)}>
                    📄 Download Resume
                  </button>
                )}
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                  disabled={updating[app.id]}
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <option value="APPLIED" disabled>APPLIED</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
