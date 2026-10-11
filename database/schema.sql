-- Smart Job Portal System - Database Schema
-- Run this on a fresh MySQL 8+ installation

CREATE DATABASE IF NOT EXISTS smart_job_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_job_portal;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('JOB_SEEKER','RECRUITER','ADMIN') NOT NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(6),
  updated_at DATETIME(6),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
);

CREATE TABLE IF NOT EXISTS job_seeker_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  date_of_birth DATE,
  skills TEXT,
  education TEXT,
  experience TEXT,
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  resume_file_name VARCHAR(255),
  resume_storage_name VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  company_name VARCHAR(200),
  company_description TEXT,
  company_website VARCHAR(500),
  company_location VARCHAR(200),
  linkedin_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  recruiter_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  job_type ENUM('FULL_TIME','PART_TIME','INTERNSHIP','CONTRACT','REMOTE'),
  salary VARCHAR(100),
  experience_required VARCHAR(100),
  skills TEXT,
  description TEXT,
  responsibilities TEXT,
  qualifications TEXT,
  application_deadline DATE,
  status ENUM('ACTIVE','INACTIVE','CLOSED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(6),
  updated_at DATETIME(6),
  FOREIGN KEY (recruiter_id) REFERENCES users(id),
  INDEX idx_jobs_status (status),
  INDEX idx_jobs_recruiter (recruiter_id),
  INDEX idx_jobs_created (created_at)
);

CREATE TABLE IF NOT EXISTS applications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id BIGINT NOT NULL,
  applicant_id BIGINT NOT NULL,
  resume_storage_name VARCHAR(255),
  resume_file_name VARCHAR(255),
  status ENUM('APPLIED','UNDER_REVIEW','SHORTLISTED','INTERVIEW','SELECTED','REJECTED') NOT NULL DEFAULT 'APPLIED',
  applied_at DATETIME(6),
  updated_at DATETIME(6),
  UNIQUE KEY uq_application (job_id, applicant_id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (applicant_id) REFERENCES users(id),
  INDEX idx_applications_applicant (applicant_id),
  INDEX idx_applications_status (status)
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  job_id BIGINT NOT NULL,
  saved_at DATETIME(6),
  UNIQUE KEY uq_saved_job (user_id, job_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
