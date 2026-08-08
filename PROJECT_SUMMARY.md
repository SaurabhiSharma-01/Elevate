# Elevate — AI Training & Placement Intelligence Portal
> **Comprehensive Project Summary & Architecture Guide**

---

## 📌 Executive Summary

**Elevate** is a state-of-the-art, full-stack **AI-Powered Career & Placement Intelligence Ecosystem** built for **GH Raisoni College**. It bridges the gap between students, college Training & Placement (T&P) officers, and corporate recruiters through data-driven skill gap assessments, placement readiness scoring, mock interviews, hackathon tracking, and automated recruiter matching.

---

## 🏗️ System Architecture & Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3, Tailwind CSS (Utility classes), Chart.js (Interactive visual analytics).
- **Backend / Web Server**: Node.js + Express (`server.js` running on `http://localhost:5000`).
- **Storage Layer**: Dual-mode storage adapter (`db.js`) supporting Express REST API endpoints (`/api/db`) with automatic browser `localStorage` fallback for offline / standalone preview.
- **Portals Architecture**: Single-Page Application (SPA) routing model with zero-reload section switching.

---

## 👥 Multi-Role Portal Capabilities

### 1. 🎓 Student Portal (`/student/`)
- **Interactive Dashboard**:
  - **AI Readiness Score**: Real-time percentage indicator and animated progress circle.
  - **Today's Tasks Card**: Interactive daily learning checklist with task completion bonuses and bottom arrow + dot-indicator (`‹ ● ○ ›`) pagination.
  - **Weak Skills Focus Card**: Visual progress bars highlighting skill gaps (DSA, System Design, Operating Systems, DBMS) with 4-item slide pagination (`‹ ● ○ ›`).
  - **Learning Analytics**: Today's learning hours tracker, completed courses counter, and mock test attempt log.
- **Sidebar & User Navigation**:
  - Top **Brand Header** (`ELEVATE University`).
  - Integrated **User Profile Card** displaying student initials (`PS`), student name (`Priya Sharma`), and a hover-expand dropdown (`My Profile`, `Settings`, `Sign Out`).
  - Collapsible **Hover-Accordion Navigation**: Collapsed by default (60px mini bar) that expands to 260px on mouse enter, with auto-collapsing section boxes (Main, Learning, Startups, Hackathons, Account).
  - Bottom **Need Support Button** launching the Help & Support modal with direct T&P cell contacts and query submission.
- **Core Modules**:
  - **Skill Report & Assessment**: Dynamic AI Skill Gap analyzer and quiz engine.
  - **Learning Roadmap & Hub**: Curated study tracks, video lessons, and core subject drills.
  - **Mock Tests & Company Papers**: Practice tests with score breakdowns (TCS, Infosys, Microsoft, Amazon).
  - **Campus Hackathons & Badges**: Achievement timeline, leaderboards, and XP verification system.
  - **Startup Pitching**: Innovation hub for student startup ideas and mentor connections.

### 2. 🏛️ Institute / T&P Portal (`/institute/`)
- **Placement Dashboard**: College-wide placement metrics, department-wise readiness distribution, and placement target tracking.
- **Student Monitoring**: Comprehensive student database filtering by CGPA, branch, readiness score, and resume verification status.
- **Drive Management**: Drive scheduling, company outreach tracking, and eligibility filtering.

### 3. 🏢 Industry / Recruiter Portal (`/industry/`)
- **Recruiter Dashboard**: Job opening post manager, applicant pipeline tracking, and candidate ATS matching scores.
- **Candidate Scouting**: In-depth candidate insights, resume text analysis, and direct interview scheduling.

### 4. 🔑 Central Authentication (`/login`)
- Unified multi-tab login portal for **Students (PRN)**, **T&P Officers (@raisoni.net)**, and **Corporate Recruiters**.
- Token-based session management (`sessionStorage`) with automatic demo student fallback (`Priya Sharma`, `GHRCE2024047`) for seamless developer previews.

---

## 🛠️ Recent Technical & UI/UX Enhancements

1. **Card Size Capping & Dot-Dot Slider Pagination**:
   - Fixed vertical card stretching on the main dashboard by limiting items to 4 per page.
   - Added a bottom pagination bar with small circular arrows (`‹` / `›`) and interactive dot indicators (`● ○`) to easily slide between pages.

2. **Sidebar Hover & Accordion Mechanics**:
   - Set sidebar to start collapsed by default (`60px`), expanding on hover to `260px`.
   - Section box dropdowns stay closed by default upon opening, expanding smoothly only when hovering over a specific section.
   - Added direct hover trigger for the top user profile card dropdown.

3. **Session & Routing Stability Fixes**:
   - Fixed absolute asset paths (`/student/styles.css` → `styles.css`) for offline compatibility.
   - Resolved token check behavior by calling `setAppRole('student')` and `enterApp()` synchronously on load to prevent any blank screen flashes.
   - Fixed null safety checks on sidebar elements to ensure error-free JS execution.

---

## 📁 Repository Directory Overview

```text
Elevate/
├── server.js               # Main Express backend server (Port 5000)
├── login.html              # Central authentication SPA page
├── PROJECT_SUMMARY.md      # Platform documentation & summary
├── student/
│   ├── index.html          # Student Portal SPA markup
│   ├── styles.css          # Student Portal theme styles & responsive rules
│   ├── app.js              # Student Portal application logic & SPA router
│   └── db.js               # Data access layer & local storage fallback
├── institute/
│   ├── index.html          # Institute T&P Portal markup
│   ├── styles.css          # T&P Portal styles
│   ├── app.js              # T&P Portal application logic
│   └── db.js               # T&P data model
└── industry/
    ├── index.html          # Industry Recruiter Portal markup
    ├── styles.css          # Recruiter Portal styles
    ├── app.js              # Recruiter Portal application logic
    └── db.js               # Recruiter data model
```
