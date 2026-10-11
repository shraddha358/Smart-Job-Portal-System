# API Documentation — Smart Job Portal System

Base URL: `http://localhost:8080/api`

All protected endpoints require: `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/register
**Role:** Public

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Test@1234",
  "confirmPassword": "Test@1234",
  "phone": "9876543210",
  "role": "JOB_SEEKER"
}
```
Role must be `JOB_SEEKER` or `RECRUITER`. `ADMIN` is rejected.

**Response 200:**
```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "JOB_SEEKER",
  "status": "ACTIVE"
}
```
**Errors:** 400 (validation), 400 (duplicate email), 400 (admin role attempt)

---

### POST /auth/login
**Role:** Public

**Request:**
```json
{ "email": "john@example.com", "password": "Test@1234" }
```

**Response 200:** Same as register response.

**Errors:** 401 (invalid credentials), 400 (inactive account)

---

### GET /auth/me
**Role:** Any authenticated

**Response 200:**
```json
{
  "id": 1, "fullName": "John Doe", "email": "john@example.com",
  "phone": "9876543210", "role": "JOB_SEEKER", "status": "ACTIVE",
  "createdAt": "2024-01-01T10:00:00", "updatedAt": "2024-01-01T10:00:00"
}
```

---

## Public Jobs

### GET /jobs
**Role:** Public

**Query params:** `keyword`, `company`, `location`, `jobType`, `experience`, `page` (default 0), `size` (default 10)

**Response 200:**
```json
{
  "content": [{ "id": 1, "title": "Java Developer", "companyName": "TechCorp", ... }],
  "page": 0, "size": 10, "totalElements": 25, "totalPages": 3, "last": false
}
```

### GET /jobs/{id}
**Role:** Public — returns only ACTIVE jobs

---

## Job Seeker Endpoints

### GET /jobseeker/dashboard
**Response:** `{ totalAvailableJobs, savedJobsCount, applicationsCount, applicationStatusStats, recentJobs }`

### GET /jobseeker/profile
### PUT /jobseeker/profile
**Request:** `{ address, city, state, dateOfBirth, skills, education, experience, linkedinUrl, githubUrl, portfolioUrl, phone }`

### POST /jobseeker/resume
**Content-Type:** multipart/form-data, field name: `file`
**Allowed:** PDF, DOC, DOCX, max 5MB

### GET /jobseeker/resume/download
Returns file as octet-stream.

### DELETE /jobseeker/resume

### POST /applications
**Request:** `{ "jobId": 1 }`
**Errors:** 400 (no resume), 400 (already applied), 400 (inactive job)

### GET /applications/my
Returns list of applicant's applications.

### GET /saved-jobs
### POST /saved-jobs/{jobId}
### DELETE /saved-jobs/{jobId}

---

## Recruiter Endpoints

### GET /recruiter/dashboard
### GET /recruiter/profile
### PUT /recruiter/profile
**Request:** `{ companyName, companyDescription, companyWebsite, companyLocation, linkedinUrl, phone }`

### GET /recruiter/jobs?page=0&size=10
### POST /recruiter/jobs
**Request:**
```json
{
  "title": "Java Developer", "companyName": "TechCorp",
  "location": "Bangalore", "jobType": "FULL_TIME",
  "salary": "4-6 LPA", "experienceRequired": "0-2 years",
  "skills": "Java, Spring Boot", "description": "...",
  "responsibilities": "...", "qualifications": "...",
  "applicationDeadline": "2024-12-31"
}
```

### GET /recruiter/jobs/{id}
### PUT /recruiter/jobs/{id}
### DELETE /recruiter/jobs/{id} — deactivates (soft delete)

### GET /recruiter/jobs/{jobId}/applicants
### PATCH /recruiter/applications/{applicationId}/status
**Request:** `{ "status": "SHORTLISTED" }`
Valid transitions: UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED

### GET /recruiter/applications/{applicationId}/resume
Returns resume file as download.

---

## Admin Endpoints

### GET /admin/dashboard
### GET /admin/users?search=&role=&status=&page=0&size=10
### GET /admin/users/{id}
### PATCH /admin/users/{id}/status — `{ "status": "INACTIVE" }`
### DELETE /admin/users/{id} — non-admin users only

### GET /admin/jobs?keyword=&status=&page=0&size=10
### PATCH /admin/jobs/{id}/status — `{ "status": "INACTIVE" }`
### DELETE /admin/jobs/{id} — deactivates

### GET /admin/applications?status=&page=0&size=10
### PATCH /admin/applications/{id}/status
### DELETE /admin/applications/{id}

---

## Error Response Format

```json
{ "success": false, "message": "Error description" }
```

Validation errors:
```json
{ "success": false, "message": "Validation failed", "errors": { "field": "message" } }
```

## HTTP Status Codes

| Code | Meaning                    |
|------|----------------------------|
| 200  | Success                    |
| 400  | Bad request / validation   |
| 401  | Unauthenticated            |
| 403  | Forbidden / wrong role     |
| 404  | Resource not found         |
| 409  | Conflict (duplicate)       |
| 500  | Internal server error      |
