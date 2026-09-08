import React, { useState } from "react";
import { useStore } from "../../store/hospitalStore";
import { Field, TextInput, Select, TextArea, Btn } from "../../components/ui";

interface PrescriptionFormValues {
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormProps {
  onCancel: () => void;
  onSave: (form: PrescriptionFormValues) => void;
}
export default function PrescriptionForm({ onCancel, onSave }: PrescriptionFormProps) {
  const { state } = useStore();
  const [form, setForm] = useState<PrescriptionFormValues>({
    patientId: state.patients[0]?.id ?? "", doctorId: state.doctors[0]?.id ?? "",
    medication: "", dosage: "", frequency: "", duration: "7", instructions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof PrescriptionFormValues, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.medication.trim()) e.medication = "Medication name is required";
    if (!form.dosage.trim()) e.dosage = "Dosage is required";
    if (!form.frequency.trim()) e.frequency = "Frequency is required";
    setErrors(e);
    return !Object.keys(e).length;
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Patient" span={2}>
          <Select value={form.patientId} onChange={(e) => set("patientId", e.target.value)}>
            {state.patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} \u2014 {p.mrn}</option>)}
          </Select>
        </Field>
        <Field label="Prescribing Doctor" span={2}>
          <Select value={form.doctorId} onChange={(e) => set("doctorId", e.target.value)}>
            {state.doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Medication" required error={errors.medication}><TextInput value={form.medication} onChange={(e) => set("medication", e.target.value)} placeholder="e.g. Amoxicillin" /></Field>
        <Field label="Dosage" required error={errors.dosage}><TextInput value={form.dosage} onChange={(e) => set("dosage", e.target.value)} placeholder="e.g. 500 mg" /></Field>
        <Field label="Frequency" required error={errors.frequency}><TextInput value={form.frequency} onChange={(e) => set("frequency", e.target.value)} placeholder="e.g. 3 times daily" /></Field>
        <Field label="Duration (days)"><TextInput type="number" min="1" value={form.duration} onChange={(e) => set("duration", e.target.value)} /></Field>
        <Field label="Instructions" span={2}><TextArea value={form.instructions} onChange={(e) => set("instructions", e.target.value)} placeholder="e.g. Take with food. Sample instructions for demonstration." /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => { if (validate()) onSave(form); }}>Save Prescription</Btn>
      </div>
    </div>
  );
}
