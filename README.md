# MediCore — Hospital Management Dashboard

<p align="center">
  <strong>Modern, responsive hospital administration dashboard built with React, TypeScript and Vite.</strong>
</p>

<p align="center">
  <a href="https://medicore-two-brown.vercel.app/">Live Demo</a> ·
  <a href="https://github.com/real-aiman/medicore">GitHub</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Zustand-4-443E38" alt="Zustand" />
  <img src="https://img.shields.io/badge/Responsive-Yes-success" alt="Responsive" />
</p>

## ✨ Overview

MediCore is a frontend-focused hospital management dashboard built as a portfolio-quality application. It demonstrates production-style React architecture, TypeScript domain modeling, persistent client state, responsive dashboard UX, data visualization, client-side routing and PDF document generation.

The application runs without a backend and uses realistic demo seed data. Changes are persisted in the browser through Zustand, making the project easy to explore locally or through the live deployment.

> **Demo & privacy:** MediCore is a portfolio/demo application. Do not enter real patient information. It is not a clinical system and makes no claim of HIPAA compliance, medical safety or production security.

## 🚀 Features

- 📊 Executive dashboard with operational KPIs and analytics
- 👥 Patient management and patient profiles
- 👨‍⚕️ Doctor and department management
- 📅 Appointment scheduling workflows
- 💊 Prescription and pharmacy management
- 🧪 Laboratory test tracking
- 🛏️ Bed and occupancy management
- 💳 Billing and invoice workflows
- 📄 A4 PDF invoice and patient-summary exports
- 🔔 Toast notifications and confirmation dialogs
- 🌙 Theme support with centralized design tokens
- 📱 Responsive sidebar, tables, forms and mobile navigation
- 🧭 Client-side routing with React Router
- 💾 Persistent demo state with Zustand + localStorage
- ✨ Smooth UI transitions with Framer Motion

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

## 🗂️ Architecture

```text
src/
├── components/       # Reusable layout and UI components
├── data/             # Demo/seed data
├── pages/            # Feature-level screens and workflows
├── store/            # Zustand application + UI state
├── styles/           # Global design tokens
├── types/            # Shared TypeScript domain types
├── utils/            # Formatting and PDF helpers
├── App.tsx           # Application routes/layout
└── main.tsx          # React entry point
```

The project follows a feature-oriented approach: reusable UI stays in `components`, screens stay in `pages`, shared domain contracts stay in `types`, and cross-screen state is centralized in the stores.

## 🛠️ Getting Started

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/real-aiman/medicore.git
cd medicore
npm install
```

### Development

```bash
npm run dev
```

### Production verification

```bash
npm run typecheck
npm run build
npm run preview
```

## 🧪 Quality & CI

The repository uses GitHub Actions to validate the application on pushes and pull requests. The baseline CI gates are:

```bash
npm run typecheck
npm run build
```

This keeps TypeScript errors and broken production builds from silently reaching deployment.

## 💾 Data & Privacy

MediCore intentionally runs without a backend. Demo changes are stored locally in the browser using Zustand persistence. This is useful for a portfolio demo but is **not** a substitute for secure healthcare infrastructure.

Never enter real patient records, credentials, payment details or other sensitive information into the public demo.

## 🌐 Deployment

**Production deployment:** [medicore-two-brown.vercel.app](https://medicore-two-brown.vercel.app/)

MediCore is a Vite SPA and is suitable for modern static hosting and Vercel deployments.

## 🎯 What This Project Demonstrates

- Component-driven React development
- Strong TypeScript typing and reusable domain models
- Global state management with persistence
- Responsive healthcare dashboard UX
- Reusable UI primitives and design tokens
- Interactive data visualization
- PDF document generation
- Client-side routing
- User feedback and confirmation patterns
- Production build verification and CI

## 🤝 Contributing

Contributions, bug reports and UI suggestions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## 🔐 Security

Please do not publish sensitive information in issues. See [SECURITY.md](SECURITY.md) for the reporting policy.

## 📄 License

MediCore is released under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center"><strong>MediCore</strong> · Built with React, TypeScript & a healthcare-first UI mindset.</p>
