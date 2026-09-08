import React, { useMemo, useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useStore } from "../store/hospitalStore";
import { Card, SectionHeader, Select } from "../components/ui";
import { DEPARTMENTS_BASE, WARDS } from "../data/seed";
import { fmtDate, fmtMoney, addDays, randInt } from "../utils/helpers";

export default function Reports() {
  const { state } = useStore();
  const [dept, setDept] = useState("All");
  const [doc, setDoc] = useState("All");
  const [range, setRange] = useState("30");

  const growthData = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ name: `Wk ${i + 1}`, patients: randInt(40, 120) + (dept !== "All" ? -20 : 0) })), [dept, range]);
  const apptTrend = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ name: `Wk ${i + 1}`, appts: randInt(60, 200) + (doc !== "All" ? -40 : 0) })), [doc, range]);
  const deptPerf = state.departments.filter((d) => dept === "All" || d.name === dept).map((d) => ({ name: d.name, patients: d.patients, beds: d.availableBeds }));
  const revenueData = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ name: fmtDate(addDays(new Date(), -(6 - i) * 30), { month: "short" }), revenue: randInt(80, 220) * 1000 })), [range]);
  const occupancyData = WARDS.map((w) => {
    const wardBeds = state.beds.filter((b) => b.ward === w);
    const occ = wardBeds.filter((b) => b.status === "Occupied").length;
    return { name: w, occupancy: Math.round((occ / wardBeds.length) * 100) };
  });

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader title="Reports" subtitle="Analytics across the hospital" />
      <Card className="mb-4 p-3.5">
        <div className="flex flex-wrap gap-2.5">
          <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-40">
            <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last quarter</option><option value="365">Last year</option>
          </Select>
          <Select value={dept} onChange={(e) => setDept(e.target.value)} className="w-[180px]">
            <option>All</option>{DEPARTMENTS_BASE.map((d) => <option key={d.name}>{d.name}</option>)}
          </Select>
          <Select value={doc} onChange={(e) => setDoc(e.target.value)} className="w-[180px]">
            <option value="All">All Doctors</option>{state.doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </div>
      </Card>

      <div className="mc-grid-2col mb-3.5 grid grid-cols-2 gap-3.5">
        <Card className="p-4.5">
          <SectionHeader title="Patient Growth" subtitle={`Filtered by ${dept}`} />
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={growthData}>
              <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--blue)" stopOpacity={0.28} /><stop offset="95%" stopColor="var(--blue)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="patients" stroke="var(--blue)" fill="url(#gg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4.5">
          <SectionHeader title="Appointment Trends" subtitle={doc === "All" ? "All doctors" : state.doctors.find((d) => d.id === doc)?.name} />
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={apptTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="appts" stroke="var(--teal)" strokeWidth={2.4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="mc-grid-2col mb-3.5 grid grid-cols-2 gap-3.5">
        <Card className="p-4.5">
          <SectionHeader title="Department Performance" subtitle="Patients vs. available beds" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="patients" fill="var(--blue)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="beds" fill="var(--teal)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4.5">
          <SectionHeader title="Revenue" subtitle="Monthly, paid invoices" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: any) => fmtMoney(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="var(--amber)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-4.5">
        <SectionHeader title="Bed Occupancy" subtitle="Percent occupied by ward" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={occupancyData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} unit="%" />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11.5, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="occupancy" fill="var(--navy)" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
