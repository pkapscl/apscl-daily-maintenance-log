# APSCL Daily Maintenance Log System

> **Mechanical (GT, HRSG & AUX.) · North · Zone-B**  
> **Ashuganj Power Station Company Limited (APSCL)**  
> Ashuganj, Brahmanbaria-3402

A production-ready fullstack web application for logging, tracking, and archiving daily mechanical maintenance works, equipment history, KKS coding, pending trouble jobs, and generating official APSCL weekly maintenance reports.

Built to be fully compatible with **Supabase**, **Vercel**, and **GitHub**.

---

## 🌟 Core Features

1. **Daily Log Entry (`Daily log`)**:
   - Fast date, area, TR No., work time, remarks, and description input.
   - **Real-time Equipment Autocomplete**: As you type, automatically suggests power plant equipment (e.g. Coalescer Filter, SSV, BFWP Min Recr Valve, Rotor) and **auto-fills the standard KKS code** (`20MBL30AT003`, `20LAB11AA081`, etc.).
   - **Interactive Suggestions While You Type**:
     - Automatically scans historical maintenance records and shows past jobs with a 1-click **"Use this text"** button to copy technical descriptions.
     - Document Center cross-referencing.
   - **Historical Records Archive**: Real-time multi-column search, filtering by plant area, date filtering, editing, and deletion.

2. **Pending Works Tracker (`Pending works`)**:
   - Dedicated dashboard for active, incomplete, or trouble-inspection tasks.
   - One-click **"Mark Completed"** action that moves resolved jobs into the completed daily archive.

3. **Official Weekly Maintenance Report (`Weekly report`)**:
   - Generates the standard APSCL formatted Weekly Maintenance Record.
   - Select Week Number (e.g. Week 14) and Year (e.g. 2026) to automatically aggregate and compute date ranges.
   - Clean, professional `@media print` styling for paper printouts and PDF generation.
   - One-click **Export to CSV**.

4. **Document Center (`Document center`)**:
   - Master reference directory categorized by:
     - All documents
     - Equipment list
     - KKS numbers
     - Equipment + KKS list
     - Maintenance general tools
     - TR register
     - Other documents / SOPs
   - Searchable document registry and live asset preview.

5. **Universal Compatibility & Fallback Mode**:
   - **Supabase Cloud**: Direct PostgreSQL integration via `@supabase/supabase-js`.
   - **Vercel Serverless Functions**: Full REST API under `/api/` (`/api/records`, `/api/equipment`, `/api/weekly-report`, `/api/documents`).
   - **Local Storage / Offline Mode**: Works out of the box with realistic power plant sample data even before connecting your Supabase database keys!

---

## 📁 Project Structure

```text
Daily Maintenance (pkapscl)/
├── index.html                   # Main production frontend application
├── vercel.json                  # Vercel deployment & security headers config
├── package.json                 # Node.js dependencies & scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Standard Git ignore rules
├── css/
│   └── app.css                  # Custom industrial design system stylesheet
├── js/
│   ├── app.js                   # Application controller & view switcher
│   ├── supabase.js              # Supabase client & fallback storage layer
│   ├── daily-log.js             # Form logic, autocomplete & records table
│   ├── pending.js               # In-progress maintenance job tracker
│   ├── weekly.js                # Official APSCL weekly report generator
│   ├── documents.js             # Document center & reference master
│   └── mock-data.js             # Preloaded APSCL equipment & historical logs
├── api/
│   ├── _supabase.js             # Serverless helper with in-memory fallback
│   ├── records.js               # GET, POST, PUT, DELETE /api/records
│   ├── equipment.js             # GET, POST /api/equipment (autocomplete)
│   ├── weekly-report.js         # GET /api/weekly-report
│   └── documents.js             # GET, POST /api/documents
└── supabase/
    ├── schema.sql               # PostgreSQL tables, triggers, indexes & RLS
    └── seed.sql                 # Preloaded power plant equipment & mock logs
```

---

## 🗄️ Supabase Database Setup

### Step 1: Execute SQL Schema
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run [`supabase/schema.sql`](file:///d:/Antigravity/Daily%20Maintenance%20(pkapscl)/supabase/schema.sql).
   - Creates `maintenance_records`, `equipment_master`, and `maintenance_documents` tables.
   - Creates performance indexes and the automatic `updated_at` trigger.
   - Configures secure Row Level Security (RLS) policies.

### Step 2: Seed Initial Data
1. Open a new query in the Supabase SQL Editor.
2. Copy and run [`supabase/seed.sql`](file:///d:/Antigravity/Daily%20Maintenance%20(pkapscl)/supabase/seed.sql).
   - Populates the 15 power plant equipment assets and KKS numbers.
   - Populates 27 realistic historical maintenance logs (March to November 2026).
   - Populates the Document Center reference catalogs.

### Step 3: Connect Credentials
You can connect in two ways:
- **In the Web App**: Click the **Supabase** status pill in the top header and paste your Project URL and Anon Key.
- **Via Environment Variables**: Copy `.env.example` to `.env` or set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel.

---

## 🚀 Deployment to Vercel

### Option A: Using Vercel CLI
```powershell
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy directly to Vercel production
vercel --prod
```

During deployment:
- Link to your existing Vercel project or create a new one.
- Add environment variables in Vercel Project Settings:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

### Option B: Push to GitHub & Connect to Vercel
1. Push this repository to GitHub (see instructions below).
2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
3. Under **Environment Variables**, add `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Click **Deploy**. Vercel will automatically build the static assets and deploy the serverless functions in `/api/`.

---

## 🐙 Push to GitHub

Initialize the repository and push to GitHub using the GitHub CLI (`gh`):

```powershell
# 1. Initialize git
git init
git branch -M main

# 2. Stage and commit files
git add .
git commit -m "feat: complete fullstack daily maintenance log system for APSCL"

# 3. Create repository on GitHub and push (replace <repo-name> with your preferred name)
gh repo create apscl-daily-maintenance-log --public --source=. --remote=origin --push
```

---

## 💻 Local Development

To run the application locally on your machine:

```powershell
# Using npx serve (no installation required)
npx serve -l 3000 .
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📄 License
Internal software developed for Ashuganj Power Station Company Limited (APSCL) Mechanical Maintenance Division.
