import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Users, CalendarClock, BedDouble, Stethoscope, Receipt } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { Card, SectionHeader, StatCard, Skeleton, EmptyState, ResponsiveTable, StatusBadge, Btn, Avatar } from "../components/ui";
import { fmtDate, fmtMoney, todayISO, addDays, randInt } from "../utils/helpers";
import type { Appointment } from "../types";

interface DashboardProps {
  setPage: (p: string) => void;
  openPatient: (id: string) => void;
}
export default function Dashboard({ setPage, openPatient }: DashboardProps) {
  const { state } = useStore();
  const [range, setRange] = useState("30D");
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const today = todayISO();
  const todaysAppts = state.appointments.filter((a) => a.date === today);
  const availableBeds = state.beds.filter((b) => b.status === "Available").length;
  const doctorsOnDuty = state.doctors.filter((d) => d.availability === "Available").length;
  const revenue = state.invoices.filter((i) => i.status === "Paid").reduce((a, b) => a + b.total, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const trendData = useMemo(() => {
    const points = range === "7D" ? 7 : range === "30D" ? 30 : range === "6M" ? 6 : 12;
    const unit = range === "6M" || range === "1Y" ? "month" : "day";
    return Array.from({ length: points }, (_, i) => {
      const base = 20 + Math.sin(i / 2) * 6;
      return {
        label: unit === "month" ? fmtDate(addDays(new Date(), -(points - i) * 30), { month: "short" }) : fmtDate(addDays(new Date(), -(points - i)), { day: "numeric", month: "short" }),
        New: Math.max(2, Math.round(base + randInt(-4, 6))),
        Returning: Math.max(2, Math.round(base * 1.4 + randInt(-4, 6))),
      };
    });
  }, [range]);

  const deptData = state.departments.map((d) => ({ name: d.name, value: d.patients || 1, color: d.color }));
  const apptStatusData = ["Completed", "Upcoming", "Cancelled", "No-show"].map((s, i) => {
    const count = s === "Completed" ? state.appointments.filter((a) => a.status === "Completed").length
      : s === "Cancelled" ? state.appointments.filter((a) => a.status === "Cancelled").length
      : s === "Upcoming" ? state.appointments.filter((a) => ["Scheduled", "Confirmed", "Waiting", "In Consultation"].includes(a.status)).length
      : randInt(2, 8);
    return { name: s, value: count, color: ["var(--green)", "var(--blue)", "var(--red)", "var(--amber)"][i] };
  });

  const patientOf = (id: string) => state.patients.find((p) => p.id === id);
  const doctorOf = (id: string) => state.doctors.find((d) => d.id === id);

  return (
    <div className="mc-fade-in animate-fade-in">
      <div className="mb-5">
        <h1 className="m-0 text-xl font-extrabold tracking-tight">{greeting}, Aiman</h1>
        <p className="mt-1 text-[13px] text-text-soft">
          Here's what's happening across your hospital today \u2014 {fmtDate(new Date(), { weekday: "long", month: "long", day: "numeric" })}.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
        <StatCard label="Total Patients" value={state.patients.length.toLocaleString()} delta="+8.4% this month" icon={Users} tone="blue" loading={loading} />
        <StatCard label="Today's Appointments" value={todaysAppts.length} delta="+12 vs yesterday" icon={CalendarClock} tone="teal" loading={loading} />
        <StatCard label="Available Beds" value={availableBeds} delta={`${state.beds.length} total`} icon={BedDouble} tone="green" loading={loading} />
        <StatCard label="Doctors On Duty" value={doctorsOnDuty} delta={`of ${state.doctors.length} staff`} icon={Stethoscope} tone="navy" loading={loading} />
        <StatCard label="Revenue (paid)" value={fmtMoney(revenue)} delta="+5.1% this month" icon={Receipt} tone="amber" loading={loading} />
      </div>

      <div className="mc-grid-2col mb-3.5 grid grid-cols-[1.6fr_1fr] gap-3.5">
        <Card className="p-4.5">
          <SectionHeader
            title="Patient Statistics" subtitle="New vs. returning patients"
            action={
              <div className="flex gap-1 rounded-md bg-slate-100 p-0.5">
                {["7D", "30D", "6M", "1Y"].map((r) => (
                  <button
                    key={r} onClick={() => setRange(r)}
                    className={clsx(
                      "rounded px-2.5 py-1 text-[11.5px] font-bold",
                      range === r ? "bg-surface text-text shadow-sm" : "bg-transparent text-text-soft"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            }
          />
          {loading ? <Skeleton h={220} r={8} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ left: -18, top: 4 }}>
                <defs>
                  <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--blue)" stopOpacity={0.28} /><stop offset="95%" stopColor="var(--blue)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gRet" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--teal)" stopOpacity={0.22} /><stop offset="95%" stopColor="var(--teal)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="New" stroke="var(--blue)" fill="url(#gNew)" strokeWidth={2} />
                <Area type="monotone" dataKey="Returning" stroke="var(--teal)" fill="url(#gRet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-4.5">
          <SectionHeader title="Department Distribution" subtitle="Active patients by department" />
          {loading ? <Skeleton h={220} r={8} /> : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={deptData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">
                    {deptData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap gap-2">
                {deptData.slice(0, 6).map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} /> {d.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="mc-grid-2col grid grid-cols-[1.6fr_1fr] gap-3.5">
        <Card className="p-4.5">
          <SectionHeader title="Today's Appointments" subtitle={`${todaysAppts.length} scheduled for today`} action={<Btn variant="secondary" size="sm" onClick={() => setPage("appointments")}>View all</Btn>} />
          {loading ? (
            <div className="flex flex-col gap-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={38} r={7} />)}</div>
          ) : (
            <ResponsiveTable<Appointment>
              columns={[
                { key: "patient", header: "Patient", render: (r) => { const p = patientOf(r.patientId); return p ? <div className="flex items-center gap-2"><Avatar name={`${p.firstName} ${p.lastName}`} size={26} /><span>{p.firstName} {p.lastName}</span></div> : "\u2014"; } },
                { key: "doctor", header: "Doctor", render: (r) => doctorOf(r.doctorId)?.name || "\u2014" },
                { key: "time", header: "Time" },
                { key: "type", header: "Type" },
                { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              ]}
              rows={todaysAppts.slice(0, 6)}
              onRowClick={(r) => { const p = patientOf(r.patientId); if (p) openPatient(p.id); }}
              empty={<EmptyState icon={CalendarClock} title="No appointments today" subtitle="There are no scheduled appointments for today." action={<Btn size="sm" onClick={() => setPage("appointments")} className="mt-1.5">Create appointment</Btn>} />}
            />
          )}
        </Card>

        <Card className="p-4.5">
          <SectionHeader title="Appointment Status" subtitle="Overview across all records" />
          {loading ? <Skeleton h={180} r={8} /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={apptStatusData} layout="vertical" margin={{ left: 6 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={78} tick={{ fontSize: 11.5, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {apptStatusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
