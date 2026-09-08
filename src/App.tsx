import React, { useEffect, useState } from "react";
import {
  BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useStore } from "./store/hospitalStore";
import { ToastProvider } from "./store/uiStore";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import QuickAddMenu from "./components/QuickAddMenu";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/patients/Patients";
import PatientProfile from "./pages/patients/PatientProfile";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Appointments from "./pages/appointments/Appointments";
import Departments from "./pages/Departments";
import Beds from "./pages/Beds";
import Prescriptions from "./pages/prescriptions/Prescriptions";
import Laboratory from "./pages/laboratory/Laboratory";
import Pharmacy from "./pages/Pharmacy";
import Billing from "./pages/billing/Billing";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

/** Small route wrappers so the page components themselves stay
 *  router-agnostic (they just take `patientId`/`doctorId` + callbacks). */
function PatientProfileRoute({ setPage }: { setPage: (p: string) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return <PatientProfile patientId={id!} onBack={() => navigate("/patients")} setPage={setPage} />;
}
function DoctorProfileRoute({ setPage }: { setPage: (p: string) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DoctorProfile doctorId={id!} onBack={() => navigate("/doctors")} setPage={setPage} />;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FA] p-5">
      <div className="w-full max-w-[390px] rounded-2xl border border-border bg-surface p-7 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold">M</div>
          <h1 className="m-0 text-2xl font-extrabold tracking-tight text-text">MediCore</h1>
          <p className="mt-1 text-sm text-text-soft">Hospital Administration</p>
        </div>
        <div className="mb-5 rounded-xl border border-border bg-[#F8FAFC] p-4">
          <div className="text-[14px] font-bold text-text">Aiman Shafiq</div>
          <div className="mt-1 text-[12px] text-text-soft">Hospital Administrator</div>
        </div>
        <button
          type="button"
          onClick={onLogin}
          onPointerUp={(e) => { if (e.pointerType === "touch") onLogin(); }}
          className="flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition active:scale-[0.98] hover:bg-blue-700 touch-manipulation"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

function Shell() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("medicore_authenticated") !== "false");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const [pendingModal, setPendingModal] = useState<string | null>(null);
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // First path segment drives active-nav highlighting and the topbar title,
  // e.g. "/patients/pt-123" -> "patients".
  const page = location.pathname.split("/")[1] || "dashboard";

  const openPatient = (id: string) => navigate(`/patients/${id}`);
  const openDoctor = (id: string) => navigate(`/doctors/${id}`);
  const navTo = (p: string) => navigate(`/${p}`);

  const handleQuickAdd = (key: string | null) => {
    setQuickAdd(false);
    if (!key) return;
    if (key === "patient") navTo("patients");
    if (key === "appointment") { navTo("appointments"); setPendingModal("appointment"); }
    if (key === "prescription") navTo("prescriptions");
    if (key === "lab") navTo("laboratory");
    if (key === "invoice") navTo("billing");
  };

  useEffect(() => {
    localStorage.setItem("medicore_authenticated", authenticated ? "true" : "false");
  }, [authenticated]);

  if (!state.hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <div className="flex flex-col items-center gap-2.5">
          <Loader2 size={22} className="mc-spin" color="#2563A8" />
          <span className="text-[13px] text-[#5B6B7C]">Loading MediCore...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  const handleLogout = () => {
    localStorage.setItem("medicore_authenticated", "false");
    setAuthenticated(false);
  };

  return (
    <div className={"mc-root flex min-h-screen" + (dark ? " dark" : "")}>
      <div className="mc-desktop-sidebar flex">
        <Sidebar page={page} setPage={navTo} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>
      {mobileOpen && <Sidebar page={page} setPage={navTo} collapsed={false} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar page={page} setPage={navTo} setMobileOpen={setMobileOpen} onQuickAdd={() => setQuickAdd(true)} onLogout={handleLogout} />
        <main className="mc-scroll flex-1 p-5">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard setPage={navTo} openPatient={openPatient} />} />
              <Route path="/patients" element={<Patients openPatient={openPatient} />} />
              <Route path="/patients/:id" element={<PatientProfileRoute setPage={navTo} />} />
              <Route path="/doctors" element={<Doctors openDoctor={openDoctor} />} />
              <Route path="/doctors/:id" element={<DoctorProfileRoute setPage={navTo} />} />
              <Route
                path="/appointments"
                element={<Appointments openPatient={openPatient} initialOpen={pendingModal === "appointment"} clearInitialOpen={() => setPendingModal(null)} />}
              />
              <Route path="/departments" element={<Departments />} />
              <Route path="/beds" element={<Beds />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/laboratory" element={<Laboratory />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings dark={dark} setDark={setDark} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PageTransition>
        </main>
      </div>
      {quickAdd && <QuickAddMenu onSelect={handleQuickAdd} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </BrowserRouter>
  );
}
