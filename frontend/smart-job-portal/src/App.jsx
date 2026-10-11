import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Public
import Home from './pages/public/Home'
import Jobs from './pages/public/Jobs'
import JobDetail from './pages/public/JobDetail'

// Job Seeker
import JobSeekerDashboard from './pages/jobseeker/Dashboard'
import JobSeekerProfile from './pages/jobseeker/Profile'
import MyApplications from './pages/jobseeker/Applications'
import SavedJobs from './pages/jobseeker/SavedJobs'

// Recruiter
import RecruiterDashboard from './pages/recruiter/Dashboard'
import RecruiterProfile from './pages/recruiter/Profile'
import RecruiterJobs from './pages/recruiter/Jobs'
import JobForm from './pages/recruiter/JobForm'
import Applicants from './pages/recruiter/Applicants'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminJobs from './pages/admin/Jobs'
import AdminApplications from './pages/admin/Applications'

function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>403 — Access Denied</h2>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>You don't have permission to view this page.</p>
      <a href="/" style={{ marginTop: '1rem', display: 'inline-block' }}>Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Job Seeker routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
            <Route path="/jobseeker/applications" element={<MyApplications />} />
            <Route path="/jobseeker/saved-jobs" element={<SavedJobs />} />
          </Route>

          {/* Recruiter routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
            <Route path="/recruiter/jobs/create" element={<JobForm />} />
            <Route path="/recruiter/jobs/edit/:id" element={<JobForm />} />
            <Route path="/recruiter/jobs/:jobId/applicants" element={<Applicants />} />
          </Route>

          {/* Admin routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
