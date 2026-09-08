# MediCore — Hospital Management Dashboard

<p align="center">
  <strong>A polished, responsive hospital administration dashboard built with React, TypeScript and Vite.</strong>
</p>

<p align="center">
  <a href="https://real-aiman.github.io/medicore/">Live Demo</a> ·
  <a href="https://github.com/real-aiman/medicore">Repository</a>
</p>

## ✨ Overview

MediCore is a frontend-focused hospital management dashboard designed to demonstrate production-style UI architecture, typed domain models, persistent state, responsive layouts, data visualization, client-side routing and document export.

The demo uses realistic seed data and persists changes in the browser with Zustand, so it can be explored without a backend or external database.

> **Demo note:** MediCore is a portfolio/demo application. It is not intended for real patient data, clinical decision-making, or production healthcare use.

## 🚀 Highlights

- 📊 Executive dashboard with operational KPIs and charts
- 👥 Patient management with searchable profiles and patient summaries
- 👨‍⚕️ Doctor and department management
- 📅 Appointment scheduling workflows
- 💊 Prescription and pharmacy management
- 🧪 Laboratory test tracking
- 🛏️ Bed and occupancy management
- 💳 Billing and invoice workflows
- 📄 A4 PDF invoice and patient-summary exports
- 🔔 Toast notifications and confirmation dialogs
- 🌙 Theme support through centralized design tokens
- 📱 Responsive sidebar, tables, forms and mobile navigation
- 🧭 URL-based navigation with React Router
- 💾 Persistent demo state with Zustand + localStorage
- ✨ Smooth, restrained page and interaction animations with Framer Motion

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + CSS design tokens |
| Routing | React Router 6 |
| State | Zustand 4 + persist middleware |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Documents | jsPDF + AutoTable |
| Utilities | clsx |

## 🗂️ Project Structure

```text
src/
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── QuickAddMenu.tsx
│   └── ui.tsx
├── data/
│   └── seed.ts
├── pages/
│   ├── patients/
│   ├── appointments/
│   ├── prescriptions/
│   ├── laboratory/
│   ├── billing/
│   ├── Dashboard.tsx
│   ├── Doctors.tsx
│   ├── DoctorProfile.tsx
│   ├── Departments.tsx
│   ├── Beds.tsx
│   ├── Pharmacy.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── store/
│   ├── hospitalStore.tsx
│   └── uiStore.tsx
├── styles/
│   └── tokens.css
├── types/
│   └── index.ts
├── utils/
│   ├── helpers.ts
│   └── pdf.ts
├── App.tsx
└── main.tsx
```

## 🛠️ Run Locally

### Requirements

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/real-aiman/medicore.git
cd medicore
npm install
```

### Development

```bash
npm run dev
```

Then open the local URL printed by Vite.

### Production build

```bash
npm run typecheck
npm run build
npm run preview
```

## 🧪 Quality Checks

The repository includes automated GitHub Actions checks for the two most important baseline gates:

```bash
npm run typecheck
npm run build
```

These checks run on pushes and pull requests so broken TypeScript or production builds are caught before merging.

## 💾 Data & Privacy

MediCore intentionally runs without a backend. Demo changes are stored locally in the browser under the `medicore:v2` Zustand persistence key and can be reset by clearing the site's local storage.

**Do not enter real patient information into this demo.** No claim of HIPAA compliance, clinical safety, or production security is made by this project.

## 🌐 Deployment

The project is compatible with static hosting because it is a Vite SPA. For GitHub Pages, client-side routes should be configured with an SPA fallback strategy if deep links are expected to be opened directly.

## 🎯 Portfolio Focus

This project demonstrates:

- Component-driven React architecture
- TypeScript domain modeling
- State management and persistence
- Responsive dashboard UX
- Reusable UI primitives
- Data visualization
- PDF document generation
- Client-side routing
- Accessibility-minded controls and feedback
- Production build verification and CI

## 🤝 Contributing

Contributions, bug reports and UI suggestions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## 🔐 Security

Please do not report security-sensitive information publicly. See [SECURITY.md](SECURITY.md) for the reporting policy.

## 📄 License

MediCore is released under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">Built with React, TypeScript and a healthcare-first UI mindset.</p>
