import React, { useState } from "react";
import { useStore } from "../../store/hospitalStore";
import { Field, TextInput, Select, TextArea, Btn } from "../../components/ui";
import { APPT_TYPES } from "../../data/seed";
import { todayISO } from "../../utils/helpers";

export interface AppointmentFormValues {
  patientId: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  type: string;
  notes: string;
}

interface AppointmentFormProps {
  onCancel: () => void;
  onSave: (form: AppointmentFormValues) => void;
  initial?: AppointmentFormValues;
}
export default function AppointmentForm({ onCancel, onSave, initial }: AppointmentFormProps) {
  const { state } = useStore();
  const [form, setForm] = useState<AppointmentFormValues>(
    initial || {
      patientId: state.patients[0]?.id ?? "", doctorId: state.doctors[0]?.id ?? "",
      department: state.doctors[0]?.department ?? "", date: todayISO(), time: "09:00", type: "Consultation", notes: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof AppointmentFormValues, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientId) e.patientId = "Select a patient";
    if (!form.doctorId) e.doctorId = "Select a doctor";
    if (!form.date) e.date = "Select a date";
    if (!form.time) e.time = "Select a time";
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Patient" required error={errors.patientId} span={2}>
          <Select value={form.patientId} onChange={(e) => set("patientId", e.target.value)}>
            {state.patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} \u2014 {p.mrn}</option>)}
          </Select>
        </Field>
        <Field label="Doctor" required error={errors.doctorId}>
          <Select
            value={form.doctorId}
            onChange={(e) => { const doc = state.doctors.find((d) => d.id === e.target.value); set("doctorId", e.target.value); set("department", doc?.department ?? ""); }}
          >
            {state.doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Department"><TextInput value={form.department} disabled /></Field>
        <Field label="Date" required error={errors.date}><TextInput type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Time" required error={errors.time}><TextInput type="time" value={form.time} onChange={(e) => set("time", e.target.value)} /></Field>
        <Field label="Appointment Type"><Select value={form.type} onChange={(e) => set("type", e.target.value)}>{APPT_TYPES.map((t) => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Notes" span={2}><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional notes for the care team..." /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => { if (validate()) onSave(form); }}>Schedule Appointment</Btn>
      </div>
    </div>
  );
}
