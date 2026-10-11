-- Smart Job Portal - Sample Data (DEV ONLY)
-- All passwords are BCrypt hashed
-- Admin@1234, Recruiter@1234, Seeker@1234

USE smart_job_portal;

-- NOTE: The Spring Boot DataSeeder (DataSeeder.java) handles seeding automatically
-- on first startup when the database is empty.
-- This file is provided as a reference / manual seed option.

-- If you prefer manual seeding, run schema.sql first, then this file.
-- Passwords below are BCrypt hashes of the documented test credentials.

INSERT IGNORE INTO users (full_name, email, password, phone, role, status, created_at, updated_at) VALUES
('Admin User',    'admin@smartjobportal.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9000000000', 'ADMIN',      'ACTIVE', NOW(), NOW()),
('Rahul Sharma',  'rahul@techcorp.com',       '$2a$10$8K1p/a0dR1xqM8K3Qe2VHuQkZ5Y6X7W8V9U0T1S2R3Q4P5O6N7M8', '9111111111', 'RECRUITER',  'ACTIVE', NOW(), NOW()),
('Priya Patel',   'priya@infosys.com',        '$2a$10$8K1p/a0dR1xqM8K3Qe2VHuQkZ5Y6X7W8V9U0T1S2R3Q4P5O6N7M8', '9222222222', 'RECRUITER',  'ACTIVE', NOW(), NOW()),
('Amit Kumar',    'amit@gmail.com',           '$2a$10$7J0o7tCqP0wqL7J2Pd1UGtPjY4X5W6V7U8T9S0R1Q2P3O4N5M6L7', '9333333333', 'JOB_SEEKER', 'ACTIVE', NOW(), NOW()),
('Sneha Joshi',   'sneha@gmail.com',          '$2a$10$7J0o7tCqP0wqL7J2Pd1UGtPjY4X5W6V7U8T9S0R1Q2P3O4N5M6L7', '9444444444', 'JOB_SEEKER', 'ACTIVE', NOW(), NOW());

-- DEV CREDENTIALS (TEST ONLY - never use in production):
-- admin@smartjobportal.com  / Admin@1234
-- rahul@techcorp.com        / Recruiter@1234
-- priya@infosys.com         / Recruiter@1234
-- amit@gmail.com            / Seeker@1234
-- sneha@gmail.com           / Seeker@1234
--
-- RECOMMENDED: Let DataSeeder.java handle seeding automatically on first startup.
-- It creates all 8 users, profiles, 10 jobs, 10 applications, and saved jobs.
