import React from "react";
import clsx from "clsx";
import {
  LayoutDashboard, Users, Stethoscope, CalendarClock, Building2, BedDouble,
  Pill, FlaskConical, Package, Receipt, BarChart3, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, X, Activity,
} from "lucide-react";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "patients", label: "Patients", icon: Users },
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "appointments", label: "Appointments", icon: CalendarClock },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "beds", label: "Beds", icon: BedDouble },
  { key: "prescriptions", label: "Prescriptions", icon: Pill },
  { key: "laboratory", label: "Laboratory", icon: FlaskConical },
  { key: "pharmacy", label: "Pharmacy", icon: Package },
  { key: "billing", label: "Billing", icon: Receipt },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

interface NavListProps {
  page: string;
  setPage: (p: string) => void;
  collapsed: boolean;
  setMobileOpen: (v: boolean) => void;
}
function NavList({ page, setPage, collapsed, setMobileOpen }: NavListProps) {
  return (
    <nav className="flex flex-col gap-0.5 p-2.5">
      {NAV_ITEMS.map((item) => {
        const active = page === item.key;
        return (
          <button
            key={item.key}
            onClick={() => { setPage(item.key); setMobileOpen(false); }}
            title={collapsed ? item.label : undefined}
            className={clsx(
              "mc-focus flex items-center gap-2.5 rounded-md text-[13.4px] font-medium transition-colors",
              collapsed ? "justify-center p-2.5" : "justify-start px-2.5 py-2",
              active ? "bg-navy-700 text-white" : "text-[#B9C7D6] hover:bg-white/[.06]"
            )}
          >
            <item.icon size={17} strokeWidth={2} className="flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  page: string;
  setPage: (p: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}
export default function Sidebar({ page, setPage, collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      <aside
        className={clsx(
          "no-print sticky top-0 z-20 flex h-screen flex-col bg-navy text-white transition-[width] duration-200",
          collapsed ? "w-[68px] min-w-[68px]" : "w-56 min-w-56"
        )}
      >
        <div className={clsx("flex items-center gap-2.5", collapsed ? "justify-center py-4.5" : "justify-start px-4 py-4.5")}>
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563A8] to-[#0E8F82]">
            <Activity size={16} color="#fff" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div>
              <div className="text-[15.5px] font-extrabold tracking-tight">MediCore</div>
              <div className="-mt-0.5 text-[10.5px] text-[#8CA3B8]">Hospital Management</div>
            </div>
          )}
        </div>
        <div className="mc-scroll flex-1 overflow-y-auto">
          <NavList page={page} setPage={setPage} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        </div>
        <button
          className="mc-focus m-2.5 flex items-center justify-center gap-2 rounded-md bg-white/5 p-2.5 text-xs text-[#B9C7D6]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Collapse</span></>}
        </button>
      </aside>

      {mobileOpen && (
        <div className="no-print fixed inset-0 z-[90] bg-[rgba(10,20,32,0.5)]" onClick={() => setMobileOpen(false)}>
          <aside className="animate-slide-in flex h-full w-60 flex-col bg-navy text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563A8] to-[#0E8F82]">
                  <Activity size={15} color="#fff" />
                </div>
                <span className="text-[15px] font-extrabold">MediCore</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavList page={page} setPage={setPage} collapsed={false} setMobileOpen={setMobileOpen} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export const PAGE_TITLES: Record<string, [string, string]> = {
  dashboard: ["Dashboard", "Hospital overview"], patients: ["Patients", "Manage patient records"],
  doctors: ["Doctors", "Medical staff directory"], appointments: ["Appointments", "Scheduling & calendar"],
  departments: ["Departments", "Department capacity & staffing"], beds: ["Bed Management", "Live ward occupancy"],
  prescriptions: ["Prescriptions", "Active & past medication orders"], laboratory: ["Laboratory", "Test orders & results"],
  pharmacy: ["Pharmacy", "Medicine inventory"], billing: ["Billing", "Invoices & payments"],
  reports: ["Reports", "Analytics across the hospital"], settings: ["Settings", "Hospital & account preferences"],
};
