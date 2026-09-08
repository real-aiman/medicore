import React, { useState } from "react";
import { useStore } from "../../store/hospitalStore";
import { Field, TextInput, Select, Btn } from "../../components/ui";
import { LAB_TESTS } from "../../data/seed";
import { todayISO } from "../../utils/helpers";

interface LabFormValues {
  patientId: string;
  doctorId: string;
  test: string;
  referenceRange: string;
  date: string;
}
interface LabFormProps {
  onCancel: () => void;
  onSave: (form: LabFormValues) => void;
}
export default function LabForm({ onCancel, onSave }: LabFormProps) {
  const { state } = useStore();
  const [form, setForm] = useState<LabFormValues>({ patientId: state.patients[0]?.id ?? "", doctorId: state.doctors[0]?.id ?? "", test: LAB_TESTS[0].name, referenceRange: LAB_TESTS[0].range, date: todayISO() });
  const set = (k: keyof LabFormValues, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Patient" span={2}>
          <Select value={form.patientId} onChange={(e) => set("patientId", e.target.value)}>
            {state.patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </Select>
        </Field>
        <Field label="Ordering Doctor" span={2}>
          <Select value={form.doctorId} onChange={(e) => set("doctorId", e.target.value)}>
            {state.doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Test" span={2}>
          <Select value={form.test} onChange={(e) => { const t = LAB_TESTS.find((t) => t.name === e.target.value); set("test", e.target.value); set("referenceRange", t?.range ?? ""); }}>
            {LAB_TESTS.map((t) => <option key={t.name}>{t.name}</option>)}
          </Select>
        </Field>
        <Field label="Date"><TextInput type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => onSave(form)}>Order Test</Btn>
      </div>
    </div>
  );
}
