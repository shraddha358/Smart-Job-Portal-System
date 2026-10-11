import { useState, useEffect, useCallback } from 'react'
import { jobService } from '../../services/jobService'
import { savedJobService } from '../../services/savedJobService'
import { applicationService } from '../../services/applicationService'
import { useAuth } from '../../context/AuthContext'
import JobCard from '../../components/JobCard'
import Pagination from '../../components/Pagination'
import Toast from '../../components/Toast'

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE']

export default function Jobs() {
  const { isAuthenticated, isJobSeeker } = useAuth()
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [filters, setFilters] = useState({ keyword: '', company: '', location: '', jobType: '', experience: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const [appliedJobIds, setAppliedJobIds] = useState(new Set())
  const [toast, setToast] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  const fetchJobs = useCallback(async (page = 0) => {
    setLoading(true); setError('')
    try {
      const params = { page, size: 9, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
      const res = await jobService.getJobs(params)
      setJobs(res.data.content)
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalElements: res.data.totalElements })
    } catch { setError('Failed to load jobs') }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchJobs(0) }, [fetchJobs])

  useEffect(() => {
    if (!isJobSeeker) return
    Promise.all([savedJobService.getSavedJobs(), applicationService.getMyApplications()])
      .then(([savedRes, appRes]) => {
        setSavedJobIds(new Set(savedRes.data.map(s => s.jobId)))
        setAppliedJobIds(new Set(appRes.data.map(a => a.jobId)))
      }).catch(() => {})
  }, [isJobSeeker])

  const handleSave = async (jobId) => {
    if (!isJobSeeker) return
    setActionLoading(l => ({ ...l, [`save_${jobId}`]: true }))
    try {
      if (savedJobIds.has(jobId)) {
        await savedJobService.unsaveJob(jobId)
        setSavedJobIds(s => { const n = new Set(s); n.delete(jobId); return n })
        setToast({ message: 'Job removed from saved list', type: 'info' })
      } else {
        await savedJobService.saveJob(jobId)
        setSavedJobIds(s => new Set([...s, jobId]))
        setToast({ message: 'Job saved!', type: 'success' })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' })
    } finally { setActionLoading(l => ({ ...l, [`save_${jobId}`]: false })) }
  }

  const handleApply = async (jobId) => {
    if (!isJobSeeker) return
    setActionLoading(l => ({ ...l, [`apply_${jobId}`]: true }))
    try {
      await applicationService.apply(jobId)
      setAppliedJobIds(s => new Set([...s, jobId]))
      setToast({ message: 'Application submitted!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to apply', type: 'error' })
    } finally { setActionLoading(l => ({ ...l, [`apply_${jobId}`]: false })) }
  }

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(0) }
  const clearFilters = () => setFilters({ keyword: '', company: '', location: '', jobType: '', experience: '' })

  return (
    <div className="page-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">Browse Jobs</h1>

      <form onSubmit={handleSearch} className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="grid grid-3" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
          <input placeholder="Job title or keyword" value={filters.keyword} onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))} />
          <input placeholder="Company" value={filters.company} onChange={e => setFilters(f => ({ ...f, company: e.target.value }))} />
          <input placeholder="Location" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
          <select value={filters.jobType} onChange={e => setFilters(f => ({ ...f, jobType: e.target.value }))}>
            <option value="">All Job Types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <input placeholder="Experience (e.g. Fresher, 1-2 years)" value={filters.experience} onChange={e => setFilters(f => ({ ...f, experience: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Search</button>
            <button type="button" className="btn btn-outline" onClick={clearFilters}>Clear</button>
          </div>
        </div>
      </form>

      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
        {loading ? 'Loading...' : `${pagination.totalElements} job${pagination.totalElements !== 1 ? 's' : ''} found`}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state"><h3>No jobs found</h3><p>Try adjusting your filters</p></div>
      ) : (
        <div className="grid grid-3">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} actions={
              isJobSeeker && (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className={`btn btn-sm ${savedJobIds.has(job.id) ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => handleSave(job.id)}
                    disabled={actionLoading[`save_${job.id}`]}
                    title={savedJobIds.has(job.id) ? 'Unsave' : 'Save'}
                  >{savedJobIds.has(job.id) ? '🔖' : '🔖'}</button>
                  <button
                    className={`btn btn-sm ${appliedJobIds.has(job.id) ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleApply(job.id)}
                    disabled={appliedJobIds.has(job.id) || actionLoading[`apply_${job.id}`]}
                  >{appliedJobIds.has(job.id) ? 'Applied' : 'Apply'}</button>
                </div>
              )
            } />
          ))}
        </div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchJobs} />
    </div>
  )
}
