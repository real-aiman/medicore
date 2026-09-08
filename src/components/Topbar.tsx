import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, Plus, Menu, X, LogOut, User, AlertTriangle, Info, Settings as SettingsIcon } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { Avatar, IconBtn, Btn } from "./ui";
import { PAGE_TITLES } from "./Sidebar";

interface TopbarProps {
  page: string;
  setPage: (p: string) => void;
  setMobileOpen: (v: boolean) => void;
  onQuickAdd: () => void;
  onLogout: () => void;
}
export default function Topbar({ page, setPage, setMobileOpen, onQuickAdd, onLogout }: TopbarProps) {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowResults(false); setShowNotif(false); setShowUser(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    if (query.trim().length < 2) return null;
    const q = query.toLowerCase();
    const patients = state.patients.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q)).slice(0, 4);
    const doctors = state.doctors.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)).slice(0, 4);
    const appointments = state.appointments.filter((a) => {
      const p = state.patients.find((pt) => pt.id === a.patientId);
      return p && `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
    }).slice(0, 4);
    const departments = state.departments.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 4);
    return { patients, doctors, appointments, departments } as Record<string, any[]>;
  }, [query, state]);

  const unread = state.notifications.filter((n) => !n.read).length;
  const [title] = PAGE_TITLES[page] || [""];

  return (
    <header className="no-print sticky top-0 z-[15] flex h-[60px] items-center justify-between gap-3 border-b border-border bg-surface px-4.5">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="mc-focus hidden text-text" id="mc-menu-btn">
          <Menu size={20} />
        </button>
        <div className="text-[15.5px] font-bold leading-tight">{title}</div>
      </div>

      <div ref={boxRef} className="flex items-center gap-2">
        <div className="relative" id="mc-search-wrap">
          <div className="flex w-[230px] items-center gap-1.5 rounded-md border border-border bg-slate-100 px-2.5 py-1.5">
            <Search size={15} className="text-text-soft" />
            <input
              value={query} onChange={(e) => { setQuery(e.target.value); setShowResults(true); }} onFocus={() => setShowResults(true)}
              placeholder="Search patients, doctors..." aria-label="Global search"
              className="w-full border-none bg-transparent text-[13px] text-text outline-none"
            />
          </div>
          {showResults && results && (
            <div className="mc-pop mc-scroll absolute right-0 top-[42px] max-h-[380px] w-80 overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-md">
              {["patients", "doctors", "appointments", "departments"].map((group) => {
                const list = results[group];
                if (!list || !list.length) return null;
                return (
                  <div key={group} className="mb-1.5">
                    <div className="px-2 pb-0.5 pt-1.5 text-[10.5px] font-bold uppercase text-text-soft">
                      {group} ({list.length})
                    </div>
                    {list.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setPage(group === "appointments" ? "appointments" : group); setShowResults(false); setQuery(""); }}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-slate-100"
                      >
                        {group === "patients" && `${item.firstName} ${item.lastName} \u00b7 ${item.mrn}`}
                        {group === "doctors" && `${item.name} \u00b7 ${item.specialty}`}
                        {group === "appointments" && `${state.patients.find((p) => p.id === item.patientId)?.firstName || ""} ${state.patients.find((p) => p.id === item.patientId)?.lastName || ""} \u2014 ${item.date}`}
                        {group === "departments" && item.name}
                      </button>
                    ))}
                  </div>
                );
              })}
              {!results.patients.length && !results.doctors.length && !results.appointments.length && !results.departments.length && (
                <div className="p-3.5 text-center text-xs text-text-soft">No matches for "{query}"</div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <IconBtn icon={Bell} label="Notifications" badge={unread} active={showNotif} onClick={() => { setShowNotif((s) => !s); setShowUser(false); }} />
          {showNotif && (
            <div className="mc-pop absolute right-0 top-[42px] w-80 rounded-lg border border-border bg-surface shadow-md">
              <div className="flex items-center justify-between border-b border-border px-3.5 py-3">
                <span className="text-[13.5px] font-bold">Notifications</span>
                <button onClick={() => dispatch({ type: "MARK_ALL_READ" })} className="text-xs text-blue">
                  Mark all read
                </button>
              </div>
              <div className="mc-scroll max-h-80 overflow-y-auto">
                {state.notifications.length === 0 && (
                  <div className="p-5 text-center text-xs text-text-soft">You're all caught up.</div>
                )}
                {state.notifications.map((n) => (
                  <div key={n.id} className={clsxNotif(n.read)}>
                    <div className="mt-0.5">
                      {n.type === "critical" ? <AlertTriangle size={14} className="text-red" /> : n.type === "warning" ? <AlertTriangle size={14} className="text-amber" /> : <Info size={14} className="text-blue" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12.5px] leading-snug">{n.message}</div>
                      <div className="mt-0.5 text-[10.5px] text-text-soft">{Math.round((Date.now() - n.createdAt) / 60000)}m ago</div>
                    </div>
                    <button onClick={() => dispatch({ type: "DISMISS_NOTIF", payload: n.id })} aria-label="Dismiss" className="self-start text-text-soft">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Btn variant="secondary" size="sm" icon={Plus} onClick={onQuickAdd}><span id="mc-quickadd-label">Quick Add</span></Btn>

        <div className="relative">
          <button onClick={() => { setShowUser((s) => !s); setShowNotif(false); }} className="mc-focus flex items-center gap-1.5">
            <Avatar name="Aiman Shafiq" size={30} />
          </button>
          {showUser && (
            <div className="mc-pop absolute right-0 top-[42px] w-[200px] overflow-hidden rounded-lg border border-border bg-surface shadow-md">
              <div className="border-b border-border px-3.5 py-3">
                <div className="text-[13px] font-bold">Aiman Shafiq</div>
                <div className="text-[11.5px] text-text-soft">Hospital Administrator</div>
              </div>
              {[
                { icon: User, label: "Profile" },
                { icon: SettingsIcon, label: "Settings", action: () => setPage("settings") },
                { icon: LogOut, label: "Log out", action: onLogout },
              ].map((it) => (
                <button
                  key={it.label} onClick={() => { it.action && it.action(); setShowUser(false); }}
                  className="flex min-h-10 w-full touch-manipulation items-center gap-2 px-3.5 py-2 text-[13px] text-text hover:bg-slate-100 active:bg-slate-200"
                >
                  <it.icon size={14} /> {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function clsxNotif(read: boolean) {
  return `flex gap-2 border-b border-border px-3.5 py-2.5 ${read ? "bg-transparent" : "bg-blue-light"}`;
}
