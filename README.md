# 🎓 VIT STUDENT PORTAL — REGISTRATION & ROLL VERIFICATION SYSTEM
### Vellore Institute of Technology // Official Student Onboarding Ecosystem

A futuristic, premium dark-mode student registration and roll number verification web application built with **HTML5, CSS3, JavaScript, Firebase Authentication & Firestore, Firebase Cloud Functions, GSAP, GSAP ScrollTrigger, and Lenis Smooth Scroll**.

🌐 **Live Application Preview:** [Launch VIT Student Portal](https://antigravity.luch.dev/site/9ae2b0d4-cfdb-4773-85be-b254ec499038/22129fd0984a773f71a6dcb1/)

---

## 🚀 Key Modules & Capabilities

### 1. 🔍 Roll Number Verification Center (`verify.html`)
- **Direct Clearance Check**: Enter any 10-character VIT Roll Number (e.g., `21BCE1024`, `22MIS0142`) to check verification status in real-time.
- **Privacy-Preserving Dossier**: Displays candidate program, campus allocation, and batch without exposing sensitive personal emails, passwords, or contact records.
- **Three Verification Outcomes**:
  - `Valid & Available`: Pre-approved roll number ready for immediate single-click registration.
  - `Valid & Registered`: Active enrolled student with cryptographic signature hash.
  - `Invalid`: Rejection notice for numbers not listed in the Deanery approval roster.

### 2. 📝 Student Onboarding & Atomic Registration (`register.html`)
- **Live Debounce Verification**: Real-time validation check against the Deanery whitelist as the student types.
- **Password Strength Analyzer**: 4-level visual security meter (length, lowercase, uppercase, numbers, symbols).
- **Single-Claim Cryptographic Lock**: Guarantees zero duplicate registrations via atomic database transactions.
- **Confetti Celebration Modal**: Triggers smooth celebratory visual burst upon successful onboarding with immediate access to the Student Dashboard.

### 3. 💳 3D Holographic Digital Student ID Card (`dashboard.html`)
- **Interactive Mouse/Gyro Tilt**: True 3D perspective card rotation with dynamic holographic sheen and gold security microchip.
- **Dynamic QR Code**: Generates encrypted QR credentials scannable by campus turnstiles, library gates, and exam halls.
- **Download / Print**: Generates high-resolution official student credential slips.

### 4. 🛡️ Deanery Administrator Console (`admin.html`)
- **Real-Time Analytics KPIs**: Total Approved Roll Numbers, Registered Students, Unclaimed Slots, and Onboarding Percentage.
- **Interactive Roster Table**: Instant multi-parameter search (Name, Roll, Department, Campus) and status filters.
- **Single Roll Number Authorizer**: Add approved candidates with customized branch allocations.
- **Bulk CSV Ingest**: Automated CSV parser for bulk importing thousands of candidate roll numbers.
- **CSV Data Export**: One-click download of the active student roster.
- **Real-Time Audit Trail**: Activity log tracking registrations, verifications, and deletions.

---

## 🔑 Demo Evaluation Credentials

Use these pre-seeded accounts to explore the portal immediately:

| Role | Email / Identifier | Password | Access / Notes |
| :--- | :--- | :--- | :--- |
| **Deanery Admin** | `admin@vit.ac.in` | `VitAdmin#2026!` | Accesses `admin.html` with full roster privileges |
| **Enrolled Student** | `priya.nair2022@vitstudent.ac.in` | `Student@123` | Roll: `22BCE1530` • 3D Holographic ID Card |
| **Approved Roll (Unregistered)** | `21BCE1024` | *N/A (Ready to claim)* | Candidate: *Vigneshwaran S.* (CSE, Vellore) |
| **Approved Roll (Unregistered)** | `24BCE1102` | *N/A (Ready to claim)* | Candidate: *Tanvi Joshi* (AIML, Chennai) |

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, Modern CSS3 (Glassmorphism, CSS Variables, Grids, 3D Transforms)
- **Animations**: GSAP 3.12, GSAP ScrollTrigger, Lenis Smooth Scroll, Canvas Confetti
- **Identity & Database**: Firebase Authentication, Cloud Firestore, Hybrid Persistent Engine
- **Cloud Functions**: Node.js 18 server-side callable functions with atomic Firestore transactions
- **Security**: Firestore Security Rules (`firestore.rules`), custom claims, input sanitization

---

## 🏫 Supported Campuses

- **VIT Vellore (HQ)** — Flagship computing, engineering, and research campus
- **VIT Chennai** — AI, Robotics, and Advanced Computing Hub
- **VIT-AP (Amaravati)** — Software engineering & cyber security campus
- **VIT Bhopal** — Cloud computing and aerospace technologies
