# Smart Job Portal System

A full-stack job portal web application built with Spring Boot 3, React, and MySQL.

---

## Features

- JWT-based authentication with role-based access (JOB_SEEKER, RECRUITER, ADMIN)
- Job seekers: browse/search jobs, apply, save jobs, manage profile, upload resume
- Recruiters: post/edit/deactivate jobs, manage applicants, update application status
- Admin: manage users, jobs, and applications
- Secure resume upload (PDF/DOC/DOCX, max 5MB)
- Responsive UI for desktop, tablet, and mobile

---

## Technology Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Java 21, Spring Boot 3.2.5, Maven       |
| Security  | Spring Security, JWT (jjwt 0.12.5)      |
| Database  | MySQL 8+, Spring Data JPA, Hibernate    |
| Frontend  | React 18, Vite, React Router 6, Axios   |
| Testing   | JUnit 5, Spring Boot Test, H2 (tests)   |

---

## Prerequisites

1. **Java 21** — verify: `java -version`
2. **Maven 3.8+** — install from https://maven.apache.org/download.cgi
3. **Node.js 18+** — install from https://nodejs.org
4. **MySQL 8+** — install from https://dev.mysql.com/downloads/

---

## Installing Maven on Windows

1. Download apache-maven-3.9.x-bin.zip from https://maven.apache.org/download.cgi
2. Extract to `C:\maven`
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Under System Variables, edit `Path`
   - Add `C:\maven\bin`
4. Verify: open new CMD and run `mvn -version`

## Installing Node.js on Windows

1. Download LTS installer from https://nodejs.org
2. Run installer (npm is included)
3. Verify: `node -v` and `npm -v`

---

## Database Setup

```sql
-- In MySQL client or MySQL Workbench:
CREATE DATABASE smart_job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or use the schema file:
```cmd
mysql -u root -p < database\schema.sql
```

---

## Environment Configuration (Windows)

### Option A — Set environment variables in CMD before running:

```cmd
set DB_URL=jdbc:mysql://localhost:3306/smart_job_portal?createDatabaseIfNotExist=true^&useSSL=false^&serverTimezone=UTC^&allowPublicKeyRetrieval=true
set DB_USERNAME=root
set DB_PASSWORD=your_password
set JWT_SECRET=YourSuperSecretJWTKeyThatIsAtLeast32CharactersLong2024
set JWT_EXPIRATION=86400000
set UPLOAD_DIR=C:\uploads\smart-job-portal
set CORS_ORIGIN=http://localhost:5173
```

### Option B — Edit application.properties defaults directly (dev only):

Edit `backend/smart-job-portal/src/main/resources/application.properties` and replace the `${VAR:default}` values.

> **Note:** Spring Boot does NOT automatically load `.env` files. Use environment variables or application.properties.

---

## Backend Setup and Run

```cmd
cd backend\smart-job-portal

:: Set environment variables (see above), then:
mvn clean verify

:: Run the application:
mvn spring-boot:run
```

Backend starts at: http://localhost:8080

On first startup, DataSeeder automatically creates sample data if the database is empty.

---

## Frontend Setup and Run

```cmd
cd frontend\smart-job-portal

:: Create .env file:
copy .env.example .env

:: Install dependencies:
npm install

:: Build (production):
npm run build

:: Run development server:
npm run dev
```

Frontend starts at: http://localhost:5173

---

## Development Test Credentials (DEV ONLY — never use in production)

| Role       | Email                        | Password        |
|------------|------------------------------|-----------------|
| Admin      | admin@smartjobportal.com     | Admin@1234      |
| Recruiter  | rahul@techcorp.com           | Recruiter@1234  |
| Recruiter  | priya@infosys.com            | Recruiter@1234  |
| Job Seeker | amit@gmail.com               | Seeker@1234     |
| Job Seeker | sneha@gmail.com              | Seeker@1234     |
| Job Seeker | vikram@gmail.com             | Seeker@1234     |
| Job Seeker | pooja@gmail.com              | Seeker@1234     |
| Job Seeker | rohan@gmail.com              | Seeker@1234     |

---

## API Endpoints Summary

### Auth (Public)
| Method | Path               | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register user      |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Get current user   |

### Jobs (Public)
| Method | Path          | Description         |
|--------|---------------|---------------------|
| GET    | /api/jobs     | List/search jobs    |
| GET    | /api/jobs/:id | Get job details     |

### Job Seeker (JOB_SEEKER role)
| Method | Path                          | Description           |
|--------|-------------------------------|-----------------------|
| GET    | /api/jobseeker/dashboard      | Dashboard stats       |
| GET    | /api/jobseeker/profile        | Get profile           |
| PUT    | /api/jobseeker/profile        | Update profile        |
| POST   | /api/jobseeker/resume         | Upload resume         |
| GET    | /api/jobseeker/resume/download| Download own resume   |
| DELETE | /api/jobseeker/resume         | Delete resume         |
| POST   | /api/applications             | Apply for job         |
| GET    | /api/applications/my          | My applications       |
| GET    | /api/saved-jobs               | Get saved jobs        |
| POST   | /api/saved-jobs/:jobId        | Save a job            |
| DELETE | /api/saved-jobs/:jobId        | Unsave a job          |

### Recruiter (RECRUITER role)
| Method | Path                                        | Description              |
|--------|---------------------------------------------|--------------------------|
| GET    | /api/recruiter/dashboard                    | Dashboard stats          |
| GET    | /api/recruiter/profile                      | Get profile              |
| PUT    | /api/recruiter/profile                      | Update profile           |
| GET    | /api/recruiter/jobs                         | My jobs                  |
| POST   | /api/recruiter/jobs                         | Create job               |
| GET    | /api/recruiter/jobs/:id                     | Get job                  |
| PUT    | /api/recruiter/jobs/:id                     | Update job               |
| DELETE | /api/recruiter/jobs/:id                     | Deactivate job           |
| GET    | /api/recruiter/jobs/:jobId/applicants       | Get applicants           |
| PATCH  | /api/recruiter/applications/:id/status      | Update application status|
| GET    | /api/recruiter/applications/:id/resume      | Download applicant resume|

### Admin (ADMIN role)
| Method | Path                            | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/admin/dashboard            | Dashboard stats          |
| GET    | /api/admin/users                | List users               |
| GET    | /api/admin/users/:id            | Get user                 |
| PATCH  | /api/admin/users/:id/status     | Update user status       |
| DELETE | /api/admin/users/:id            | Delete user              |
| GET    | /api/admin/jobs                 | List jobs                |
| PATCH  | /api/admin/jobs/:id/status      | Update job status        |
| DELETE | /api/admin/jobs/:id             | Deactivate job           |
| GET    | /api/admin/applications         | List applications        |
| PATCH  | /api/admin/applications/:id/status | Update app status     |
| DELETE | /api/admin/applications/:id     | Delete application       |

---

## Resume Upload

- Allowed formats: PDF, DOC, DOCX
- Max size: 5MB
- Storage: configured via `UPLOAD_DIR` environment variable (default: `./uploads`)
- Files are stored with UUID-based names to prevent path traversal
- Original filename is stored in the database for display/download

---

## Running Tests

```cmd
cd backend\smart-job-portal
mvn test
```

Tests use H2 in-memory database — no MySQL required for tests.

---

## Common Errors and Solutions

| Error | Solution |
|-------|----------|
| `mvn` not recognized | Install Maven and add to PATH (see above) |
| `node` not recognized | Install Node.js from nodejs.org |
| MySQL connection refused | Start MySQL service: `net start MySQL80` |
| Port 8080 in use | Change `server.port` in application.properties |
| Port 5173 in use | Vite will auto-select next available port |
| CORS error | Ensure `CORS_ORIGIN=http://localhost:5173` matches frontend URL |
| JWT error | Ensure `JWT_SECRET` is at least 32 characters |

---

## Security Notes

- JWT tokens are stored in localStorage (XSS risk — acceptable for portfolio projects)
- Passwords are hashed with BCrypt (strength 10)
- JWT logout is client-side only (stateless — token remains valid until expiry)
- Admin accounts cannot be created via public registration
- Resume access is restricted to owner, relevant recruiter, or admin
- File uploads are validated by content type and extension

---

## Known Limitations

- No email verification on registration
- No password reset flow
- JWT revocation not implemented (stateless)
- No real-time notifications
- Resume preview (in-browser) not implemented — download only
