# MediCore \u2014 Hospital Management Dashboard

A component-based **React + TypeScript + Vite** hospital administration UI.

## Run it

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build (verified clean)
npm run typecheck # tsc --noEmit (verified clean, 0 errors)
```

Data persists to `localStorage` (key `medicore:v2`, via Zustand's
`persist` middleware) and reseeds with realistic sample data the first
time you open it.

## Stack

- **React 18 + TypeScript** \u2014 every source file is `.tsx`/`.ts`, with
  real data-model interfaces in `src/types/index.ts` (Patient, Doctor,
  Appointment, Prescription, Invoice, LabTest, Bed, Department,
  Notification, HospitalSettings). `tsconfig.json` runs with
  `strict: false` / `noImplicitAny: false` so the migration didn't
  require annotating every internal callback \u2014 the public
  component/store boundaries are properly typed, which is where type
  safety actually pays off. `npm run typecheck` passes with 0 errors.
- **Zustand** (`src/store/hospitalStore.tsx`) with the `persist`
  middleware for localStorage-backed state. A thin `useStore()`
  compatibility hook keeps the `{ state, dispatch({ type, payload }) }`
  call shape used throughout the page components.
- **react-router-dom** \u2014 real URLs (`/patients`, `/patients/:id`,
  `/doctors/:id`, etc.) instead of internal page-state. Note: since
  routing is client-side, a static host needs an SPA fallback rule
  (serve `index.html` for unmatched paths) \u2014 Vite's dev server and
  `vite preview` already do this for you.
- **Framer Motion** \u2014 used in `Modal`, `ConfirmDialog`, `StatCard`,
  buttons (tap feedback), and page transitions in `App.tsx`.
- **jsPDF + jspdf-autotable** (`src/utils/pdf.ts`) \u2014 real, structured
  PDF generation (not a screenshot): `downloadInvoicePdf()` builds an
  A4 invoice with header/line-items/totals, and
  `downloadPatientSummaryPdf()` builds a one-page patient record
  summary. Both are wired to real buttons (Billing \u2192 Download PDF;
  Patient Profile \u2192 Export PDF).
- **Recharts** for all charts, **lucide-react** for icons.
- **Tailwind CSS 3** for all styling. Components use real utility
  classes (`className="flex items-center gap-2 rounded-lg ..."`),
  not inline `style` objects \u2014 the only remaining inline `style` props
  are for genuinely dynamic/runtime values Tailwind can't express as a
  static class (a data-driven hex color, a computed animation delay,
  an avatar's generated hue). `tailwind.config.js` maps the design
  tokens as theme colors (`bg-navy`, `text-blue`, `bg-slate-100`,
  `bg-green-bg`, etc.) by pointing them at the CSS custom properties
  in `src/styles/tokens.css` \u2014 that's also how dark mode keeps working
  with plain utility classes: toggling `.dark` on the root flips the
  underlying CSS variables, so `bg-surface` etc. repaint automatically
  without needing `dark:` variants everywhere. Recharts' SVG
  fill/stroke props still take the CSS variables directly (`var(--blue)`)
  since chart libraries need literal color strings, not classes.

## Structure

```
src/
  types/index.ts     data-model interfaces (Patient, Doctor, Appointment, ...)
  components/
    ui.tsx            typed UI primitives: Badge, Btn, Card, Modal, ConfirmDialog,
                       ResponsiveTable<T>, StatCard, Pagination, etc.
    Sidebar.tsx        collapsible desktop sidebar + mobile drawer
    Topbar.tsx         global search, notifications, quick add, user menu
    QuickAddMenu.tsx
  pages/
    Dashboard.tsx
    patients/          Patients.tsx, PatientProfile.tsx, PatientForm.tsx
    appointments/       Appointments.tsx, AppointmentForm.tsx
    prescriptions/       Prescriptions.tsx, PrescriptionForm.tsx
    laboratory/          Laboratory.tsx, LabForm.tsx
    billing/              Billing.tsx, InvoiceForm.tsx, InvoiceDocument.tsx
    Doctors.tsx, DoctorProfile.tsx
    Departments.tsx, Beds.tsx, Pharmacy.tsx, Reports.tsx, Settings.tsx
  store/
    hospitalStore.tsx   Zustand store + persist middleware
    uiStore.tsx          toast notifications
  data/seed.ts          typed sample-data generators
  utils/
    helpers.ts           date/money formatting, id generation, random helpers
    pdf.ts                jsPDF invoice + patient-summary generators
  styles/tokens.css       design tokens (CSS variables) + shared animations
  App.tsx                 router + shell (sidebar/topbar layout, page transitions)
  main.tsx                Vite/React entry point
tailwind.config.js         theme colors mapped to CSS variables, custom spacing/animation keyframes
postcss.config.js          Tailwind + autoprefixer
```

## What's verified

- `npm run typecheck` \u2014 0 errors
- `npm run build` \u2014 clean production build
- `vite preview` \u2014 serves and responds 200 on both `index.html` and the
  built JS bundle
- Every relative import in `src/` resolves to an existing file (checked
  programmatically, not just by eye)
