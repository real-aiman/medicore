import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Plus, ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { useToast } from "../../store/uiStore";
import { Card, SectionHeader, Btn, Select, TextInput, ResponsiveTable, StatusBadge, Avatar, Modal, EmptyState, InfoRow, STATUS_TONE } from "../../components/ui";
import { DEPARTMENTS_BASE, APPT_STATUSES } from "../../data/seed";
import { fmtDate, todayISO, isoOf, uid } from "../../utils/helpers";
import AppointmentForm from "./AppointmentForm";
import type { Appointment } from "../../types";

interface AppointmentsProps {
  openPatient: (id: string) => void;
  initialOpen: boolean;
  clearInitialOpen: () => void;
}
export default function Appointments({ openPatient, initialOpen, clearInitialOpen }: AppointmentsProps) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [view, setView] = useState("list");
  const [showAdd, setShowAdd] = useState(!!initialOpen);
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [docFilter, setDocFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [calMonth, setCalMonth] = useState(new Date());

  useEffect(() => { if (initialOpen) { setShowAdd(true); clearInitialOpen(); } }, [initialOpen]);

  const patientOf = (id: string) => state.patients.find((p) => p.id === id);
  const doctorOf = (id: string) => state.doctors.find((d) => d.id === id);

  const filtered = state.appointments.filter((a) =>
    (docFilter === "All" || a.doctorId === docFilter) &&
    (deptFilter === "All" || a.department === deptFilter) &&
    (statusFilter === "All" || a.status === statusFilter) &&
    (!dateFilter || a.date === dateFilter)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const monthDays = useMemo(() => {
    const year = calMonth.getFullYear(), month = calMonth.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [calMonth]);

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader
        title="Appointments" subtitle={`${filtered.length} matching records`}
        action={
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 rounded-md bg-slate-100 p-0.5">
              {[["list", "List"], ["calendar", "Calendar"]].map(([k, l]) => (
                <button
                  key={k} onClick={() => setView(k)}
                  className={clsx("rounded px-2.5 py-1.5 text-xs font-bold", view === k ? "bg-surface text-text shadow-sm" : "bg-transparent text-text-soft")}
                >
                  {l}
                </button>
              ))}
            </div>
            <Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)}>New Appointment</Btn>
          </div>
        }
      />

      <Card className="mb-3.5 p-3.5">
        <div className="flex flex-wrap gap-2.5">
          <Select value={docFilter} onChange={(e) => setDocFilter(e.target.value)} className="w-[180px]">
            <option value="All">All Doctors</option>{state.doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-[170px]">
            <option>All</option>{DEPARTMENTS_BASE.map((d) => <option key={d.name}>{d.name}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[170px]">
            <option>All</option>{APPT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <TextInput type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-[150px]" />
          {(docFilter !== "All" || deptFilter !== "All" || statusFilter !== "All" || dateFilter) && (
            <Btn variant="ghost" size="sm" onClick={() => { setDocFilter("All"); setDeptFilter("All"); setStatusFilter("All"); setDateFilter(""); }}>Clear filters</Btn>
          )}
        </div>
      </Card>

      {view === "list" ? (
        <Card className="p-1.5">
          <ResponsiveTable<Appointment>
            columns={[
              { key: "patient", header: "Patient", render: (a) => { const p = patientOf(a.patientId); return p ? <div className="flex items-center gap-2"><Avatar name={`${p.firstName} ${p.lastName}`} size={26} /><span>{p.firstName} {p.lastName}</span></div> : "\u2014"; } },
              { key: "doctor", header: "Doctor", render: (a) => doctorOf(a.doctorId)?.name }, { key: "department", header: "Department" },
              { key: "date", header: "Date", render: (a) => fmtDate(a.date) }, { key: "time", header: "Time" }, { key: "type", header: "Type" },
              { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
            ]}
            rows={filtered} onRowClick={setDetail}
            mobileCard={(a) => {
              const p = patientOf(a.patientId);
              return (
                <Card className="p-3" onClick={() => setDetail(a)}>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Avatar name={p ? `${p.firstName} ${p.lastName}` : "?"} size={28} />
                      <div><div className="text-[13px] font-bold">{p?.firstName} {p?.lastName}</div><div className="text-[11.5px] text-text-soft">{doctorOf(a.doctorId)?.name}</div></div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-text-soft">
                    <span>{fmtDate(a.date)} \u00b7 {a.time}</span><span>{a.type}</span>
                  </div>
                </Card>
              );
            }}
            empty={<EmptyState icon={CalendarClock} title="No appointments found" subtitle="Adjust filters or create a new appointment." action={<Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)} className="mt-2">New Appointment</Btn>} />}
          />
        </Card>
      ) : (
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Btn variant="ghost" size="sm" icon={ChevronLeft} onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))} />
            <div className="text-sm font-bold">{calMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
            <Btn variant="ghost" size="sm" icon={ChevronRight} onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))} />
          </div>
          <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-text-soft">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {monthDays.map((d, i) => {
              const iso = d ? isoOf(d) : null;
              const dayAppts = d ? filtered.filter((a) => a.date === iso) : [];
              const isToday = iso === todayISO();
              return (
                <div key={i} className={clsx("min-h-[74px] rounded-md border border-border p-1.5", isToday ? "bg-blue-light" : "bg-surface")}>
                  {d && <div className={clsx("mb-1 text-[11px]", isToday ? "font-extrabold text-blue" : "font-semibold text-text-soft")}>{d.getDate()}</div>}
                  <div className="flex flex-col gap-0.5">
                    {dayAppts.slice(0, 2).map((a) => {
                      const tone = STATUS_TONE[a.status];
                      return (
                        <button
                          key={a.id} onClick={() => setDetail(a)}
                          className={clsx(
                            "overflow-hidden text-ellipsis whitespace-nowrap rounded px-1 py-0.5 text-left text-[9.5px]",
                            tone === "red" ? "bg-red-bg text-red" : tone === "green" ? "bg-green-bg text-green" : "bg-blue-light text-blue"
                          )}
                        >
                          {a.time} {patientOf(a.patientId)?.lastName}
                        </button>
                      );
                    })}
                    {dayAppts.length > 2 && <span className="text-[9.5px] text-text-soft">+{dayAppts.length - 2} more</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Appointment" width={620}>
        <AppointmentForm
          onCancel={() => setShowAdd(false)}
          onSave={(form) => {
            dispatch({ type: "ADD_APPOINTMENT", payload: { ...form, id: uid("apt"), status: "Scheduled", type: form.type } as Appointment });
            setShowAdd(false); toast("Appointment scheduled");
          }}
        />
      </Modal>

      <Modal
        open={!!detail} onClose={() => setDetail(null)} title="Appointment Details" width={480}
        footer={detail && (
          <>
            <Btn variant="subtleDanger" size="sm" onClick={() => { dispatch({ type: "UPDATE_APPOINTMENT", payload: { id: detail.id, status: "Cancelled" } }); toast("Appointment cancelled", "warning"); setDetail(null); }}>Cancel Appointment</Btn>
            <Btn size="sm" onClick={() => { dispatch({ type: "UPDATE_APPOINTMENT", payload: { id: detail.id, status: "Completed" } }); toast("Appointment marked completed"); setDetail(null); }}>Mark Completed</Btn>
          </>
        )}
      >
        {detail && (() => {
          const p = patientOf(detail.patientId); const d = doctorOf(detail.doctorId);
          return (
            <div>
              <div className="mb-3.5 flex items-center gap-2.5">
                <Avatar name={p ? `${p.firstName} ${p.lastName}` : "?"} size={40} />
                <div><div className="font-bold">{p?.firstName} {p?.lastName}</div><div className="text-xs text-text-soft">{p?.mrn}</div></div>
              </div>
              <InfoRow label="Doctor" value={d?.name} /><InfoRow label="Department" value={detail.department} />
              <InfoRow label="Date" value={fmtDate(detail.date)} /><InfoRow label="Time" value={detail.time} />
              <InfoRow label="Type" value={detail.type} /><InfoRow label="Status" value={<StatusBadge status={detail.status} />} />
              {detail.notes && <InfoRow label="Notes" value={detail.notes} />}
              <Btn variant="ghost" size="sm" onClick={() => { setDetail(null); openPatient(detail.patientId); }} className="mt-2.5">View patient profile \u2192</Btn>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
