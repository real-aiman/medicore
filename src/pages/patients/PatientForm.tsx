import React, { useState } from "react";
import { Field, TextInput, Select, Btn } from "../../components/ui";
import { DEPARTMENTS_BASE, DOCTORS, BLOOD_GROUPS, ALLERGY_OPTIONS, CONDITION_OPTIONS, INSURANCE } from "../../data/seed";
import type { Patient, Gender } from "../../types";

export const emptyPatientForm = {
  firstName: "", lastName: "", dob: "", gender: "Female" as Gender, bloodGroup: "O+", phone: "", email: "", address: "",
  emergencyContact: "", emergencyRelation: "Spouse", emergencyPhone: "", allergies: "None known", conditions: "None", insurance: INSURANCE[0],
  department: DEPARTMENTS_BASE[0].name, doctorId: DOCTORS[0].id,
};
export type PatientFormValues = typeof emptyPatientForm;

interface PatientFormProps {
  initial?: Patient;
  onCancel: () => void;
  onSave: (form: PatientFormValues) => void;
}
export default function PatientForm({ initial, onCancel, onSave }: PatientFormProps) {
  const [form, setForm] = useState<PatientFormValues>(initial || emptyPatientForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof PatientFormValues, v: string) => setForm((f) => ({ ...f, [k]: v } as PatientFormValues));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.emergencyContact.trim()) e.emergencyContact = "Emergency contact is required";
    if (!form.emergencyPhone.trim()) e.emergencyPhone = "Emergency phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <div className="mb-2.5 mt-0.5 text-xs font-bold uppercase tracking-wide text-text-soft">Personal information</div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name" required error={errors.firstName}><TextInput value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="e.g. Amara" /></Field>
        <Field label="Last Name" required error={errors.lastName}><TextInput value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="e.g. Whitfield" /></Field>
        <Field label="Date of Birth" required error={errors.dob}><TextInput type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} /></Field>
        <Field label="Gender"><Select value={form.gender} onChange={(e) => set("gender", e.target.value)}><option>Female</option><option>Male</option><option>Other</option></Select></Field>
        <Field label="Blood Group"><Select value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>{BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}</Select></Field>
        <Field label="Phone" required error={errors.phone}><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" /></Field>
        <Field label="Email" error={errors.email}><TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@mail.com" /></Field>
        <Field label="Address" span={2}><TextInput value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" /></Field>
      </div>

      <div className="mb-2.5 mt-4.5 text-xs font-bold uppercase tracking-wide text-text-soft">Emergency contact</div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Emergency Contact" required error={errors.emergencyContact}><TextInput value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} /></Field>
        <Field label="Relationship"><Select value={form.emergencyRelation} onChange={(e) => set("emergencyRelation", e.target.value)}>{["Spouse", "Parent", "Sibling", "Friend", "Other"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
        <Field label="Emergency Phone" required error={errors.emergencyPhone} span={2}><TextInput value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} /></Field>
      </div>

      <div className="mb-2.5 mt-4.5 text-xs font-bold uppercase tracking-wide text-text-soft">Medical</div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Allergies"><Select value={form.allergies} onChange={(e) => set("allergies", e.target.value)}>{ALLERGY_OPTIONS.map((a) => <option key={a}>{a}</option>)}</Select></Field>
        <Field label="Existing Conditions"><Select value={form.conditions} onChange={(e) => set("conditions", e.target.value)}>{CONDITION_OPTIONS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Insurance Provider"><Select value={form.insurance} onChange={(e) => set("insurance", e.target.value)}>{INSURANCE.map((i) => <option key={i}>{i}</option>)}</Select></Field>
        <Field label="Department"><Select value={form.department} onChange={(e) => set("department", e.target.value)}>{DEPARTMENTS_BASE.map((d) => <option key={d.name}>{d.name}</option>)}</Select></Field>
        <Field label="Assigned Doctor" span={2}>
          <Select value={form.doctorId} onChange={(e) => set("doctorId", e.target.value)}>
            {DOCTORS.map((d) => <option key={d.id} value={d.id}>{d.name} \u2014 {d.specialty}</option>)}
          </Select>
        </Field>
      </div>

      <div className="mt-5.5 flex justify-end gap-2.5">
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => { if (validate()) onSave(form); }}>Save Patient</Btn>
      </div>
    </div>
  );
}
