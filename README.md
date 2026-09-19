# Holiday Travelers Travel and Tours Inc — Capstone Tour Operations System

A full-stack Tour Operations and Customer Booking Application featuring 7 integrated submodules, built with **React 18 + Vite + TypeScript + Tailwind CSS**, along with **Laravel + Sanctum + PostgreSQL** backend integration specifications.

## 🚀 Quick Start in VS Code (VSC)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Running the Application in VS Code
1. **Open the Correct Folder in VS Code**:
   - Make sure you open the folder where `package.json` is located (e.g., `File > Open Folder...`).
2. **Open Terminal in VS Code** (`Ctrl + ~` or `Terminal > New Terminal`).
3. **If Windows PowerShell blocks scripts**, run this command first:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Start Development Server**:
   ```bash
   npm run dev
   ```
6. **Open Browser**:
   Navigate to `http://localhost:3000`

---

## 🛠️ Submodules Included

1. **Tour Package Management Catalog**: Create, publish, edit, duplicate, and manage tour packages with saved high-resolution destination photos.
2. **Customer Booking Manifest**: Register tourist bookings, auto-calculate pax totals, generate reference codes (`TT-YYYY-XXXX`), and track statuses.
3. **Itinerary & Tour Guide Schedule**: Day-by-day activity timelines, tour guide assignment, and printable schedule sheets.
4. **Hotel & Transport Reservations**: Issue hotel stay vouchers and vehicle/driver dispatch allocations with printable pass views.
5. **Billing & Invoice Management**: Record deposit payments, track remaining balances, and issue official PDF-style invoices.
6. **Customer Feedback & CSAT Ratings**: Post-tour review forms, 5-star multi-criteria ratings (guide, hotel, transport, value), and CSAT analytics.
7. **Agency Branding & UI Settings**: Customize company name, DOT accreditation numbers, contact hotlines, theme accent colors, and export JSON backups.
8. **Laravel + Sanctum + PostgreSQL Integration Hub**: Full PHP controllers, Blade layouts, Sanctum REST API endpoints, and Render deployment scripts.

---

## 🎨 Features & UI Highlights
- **Company Branding Customization**: Easily configure accreditation numbers, logo details, contact info, and themes.
- **Skeleton Shimmer Loading**: Smooth skeleton loading screens instead of blank screens when navigating or loading images.
- **Photo Persistence & Downloader**: High-resolution destination photo cards with local fallbacks and a 1-click **"Download / Save Photo"** feature.
- **Dual View Modes**: Switch seamlessly between **Customer View** (for travelers) and **Operator Admin View** (for agency staff).
- **VS Code Ready**: Pre-configured `.vscode` settings, tasks, and launch scripts for single-click debugging.
