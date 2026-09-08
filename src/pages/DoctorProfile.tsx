import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, CalendarClock, Phone, Mail } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { Card, SectionHeader, Btn, Avatar, StatusBadge, Badge, InfoRow, ResponsiveTable, EmptyState } from "../components/ui";
import { todayISO, randInt } from "../utils/helpers";
import type { Appointment } from "../types";

interface DoctorProfileProps {
  doctorId: string;
  onBack: () => void;
  setPage: (p: string) => void;
}
export default function DoctorProfile({ doctorId, onBack, setPage }: DoctorProfileProps) {
  const { state } = useStore();
  const doctor = state.doctors.find((d) => d.id === doctorId);
  if (!doctor) return <EmptyState title="Doctor not found" action={<Btn size="sm" onClick={onBack} className="mt-2">Back</Btn>} />;
  const today = todayISO();
  const todaysAppts = state.appointments.filter((a) => a.doctorId === doctorId && a.date === today);
  const patientOf = (id: string) => state.patients.find((p) => p.id === id);
  const statData = [
    { name: "Mon", v: randInt(8, 18) }, { name: "Tue", v: randInt(8, 18) }, { name: "Wed", v: randInt(8, 18) },
    { name: "Thu", v: randInt(8, 18) }, { name: "Fri", v: randInt(8, 18) },
  ];

  return (
    <div className="mc-fade-in animate-fade-in">
      <button onClick={onBack} className="mc-focus mb-3 flex items-center gap-1.5 border-none bg-transparent p-0 text-xs text-text-soft">
        <ChevronLeft size={14} /> Back to doctors
      </button>
      <Card className="mb-3.5 p-4.5">
        <div className="flex flex-wrap justify-between gap-3.5">
          <div className="flex gap-3.5">
            <Avatar name={doctor.name} size={56} />
            <div>
              <h2 className="m-0 text-lg font-extrabold">{doctor.name}</h2>
              <div className="mt-1 text-[12.5px] text-text-soft">{doctor.specialty} \u00b7 {doctor.department}</div>
              <div className="mt-2 flex gap-2">
                <StatusBadge status={doctor.availability} />
                <Badge tone="slate">{doctor.experience} yrs experience</Badge>
              </div>
            </div>
          </div>
          <Btn icon={CalendarClock} size="sm" onClick={() => setPage("appointments")}>Book Appointment</Btn>
        </div>
      </Card>
      <div className="mc-grid-2col grid grid-cols-2 gap-3.5">
        <Card className="p-4.5">
          <SectionHeader title="Contact & Schedule" />
          <InfoRow icon={Phone} label="Phone" value={doctor.phone} />
          <InfoRow icon={Mail} label="Email" value={doctor.email} />
          <InfoRow label="Rating" value={`\u2605 ${doctor.rating} / 5.0`} />
          <InfoRow label="Total Patients" value={doctor.patients} />
        </Card>
        <Card className="p-4.5">
          <SectionHeader title="Patient Load \u2014 this week" />
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={statData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="v" fill="var(--blue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="mt-3.5 p-1.5">
        <div className="px-3 pt-3"><SectionHeader title="Today's Appointments" /></div>
        <ResponsiveTable<Appointment>
          columns={[
            { key: "patient", header: "Patient", render: (a) => { const p = patientOf(a.patientId); return p ? `${p.firstName} ${p.lastName}` : "\u2014"; } },
            { key: "time", header: "Time" }, { key: "type", header: "Type" }, { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
          ]}
          rows={todaysAppts}
          empty={<EmptyState icon={CalendarClock} title="No appointments today" subtitle="This doctor has a clear schedule for today." />}
        />
      </Card>
    </div>
  );
}
