-- ============================================================
-- ELEVATE PLATFORM — MySQL Database Schema DDL
-- GH Raisoni College of Engineering
-- ============================================================

CREATE DATABASE IF NOT EXISTS elevate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elevate_db;

-- 1. Students Profile Table
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  dept VARCHAR(100) DEFAULT '',
  branch VARCHAR(100) DEFAULT '',
  semester VARCHAR(50) DEFAULT '',
  passingYear INT DEFAULT 2028,
  cgpa FLOAT DEFAULT 0,
  readiness INT DEFAULT 0,
  rank_val VARCHAR(50) DEFAULT '--',
  targetCompany VARCHAR(150) DEFAULT '--',
  resumeVerified VARCHAR(50) DEFAULT 'Pending',
  resumeText TEXT,
  coursesCompleted INT DEFAULT 0,
  todayHours FLOAT DEFAULT 0,
  mockTestsCompleted INT DEFAULT 0,
  weakSkills JSON,
  appliedJobs JSON,
  interviewHistory JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. T&P Officers Accounts Table
CREATE TABLE IF NOT EXISTS tnp_officers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  college VARCHAR(150) DEFAULT 'Raisoni College',
  role VARCHAR(50) DEFAULT 'tnp',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Accounts Table (Credentials & Authentication)
CREATE TABLE IF NOT EXISTS student_accounts (
  prn VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  dob VARCHAR(50),
  passingYear VARCHAR(50),
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  firstLogin BOOLEAN DEFAULT TRUE,
  importedBy VARCHAR(50) DEFAULT 'system',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastLogin DATETIME NULL
);

-- 4. Company Accounts Table (Recruiter Authentication)
CREATE TABLE IF NOT EXISTS company_accounts (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  industry VARCHAR(150) DEFAULT '',
  contactPerson VARCHAR(150) DEFAULT '',
  role VARCHAR(50) DEFAULT 'company',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(50) PRIMARY KEY,
  company VARCHAR(150) NOT NULL,
  logo VARCHAR(50) DEFAULT 'COMP',
  role VARCHAR(150) NOT NULL,
  type VARCHAR(50) DEFAULT 'Full Time',
  ctc VARCHAR(50) NOT NULL,
  location VARCHAR(150) DEFAULT '',
  description TEXT,
  eligibility JSON,
  applicants JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Campus Drives Table
CREATE TABLE IF NOT EXISTS drives (
  id VARCHAR(50) PRIMARY KEY,
  company VARCHAR(150) NOT NULL,
  date VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  dept VARCHAR(100) DEFAULT 'Engineering',
  minCgpa FLOAT DEFAULT 6.0,
  role VARCHAR(150) DEFAULT '',
  ctc VARCHAR(50) DEFAULT '',
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Partner Companies Directory Table
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  industry VARCHAR(150) DEFAULT '',
  contact VARCHAR(150) DEFAULT '',
  status VARCHAR(50) DEFAULT 'Pending',
  avatar VARCHAR(50) DEFAULT 'CO',
  previousVisits INT DEFAULT 0,
  connectionDate VARCHAR(50) NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Startups Table (Innovation Hub)
CREATE TABLE IF NOT EXISTS startups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  tagline TEXT,
  category VARCHAR(100) DEFAULT 'General',
  problem TEXT,
  solution TEXT,
  upvotes INT DEFAULT 0,
  comments INT DEFAULT 0,
  team JSON,
  gradient VARCHAR(255) DEFAULT '',
  trending BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. HR Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
  id VARCHAR(50) PRIMARY KEY,
  company VARCHAR(150) NOT NULL,
  companyId VARCHAR(50),
  type VARCHAR(100) DEFAULT 'Meeting',
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) DEFAULT '10:00',
  mode VARCHAR(50) DEFAULT 'online',
  link VARCHAR(255) DEFAULT '',
  venue VARCHAR(255) DEFAULT '',
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  questions INT DEFAULT 20,
  duration INT DEFAULT 45,
  createdBy VARCHAR(150) DEFAULT 'College T&P',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
