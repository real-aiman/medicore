import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { Field, Select, TextInput, Btn } from "../../components/ui";
import { fmtMoney } from "../../utils/helpers";
import type { InvoiceLineItem } from "../../types";

interface InvoiceFormResult {
  patientId: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  method: string;
}
interface InvoiceFormProps {
  onCancel: () => void;
  onSave: (form: InvoiceFormResult) => void;
}
export default function InvoiceForm({ onCancel, onSave }: InvoiceFormProps) {
  const { state } = useStore();
  const [patientId, setPatientId] = useState(state.patients[0]?.id ?? "");
  const [method, setMethod] = useState("Credit Card");
  const [items, setItems] = useState<InvoiceLineItem[]>([{ label: "Consultation Fee", amount: 150 }]);
  const updateItem = (i: number, k: keyof InvoiceLineItem, v: string | number) => setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const subtotal = items.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const tax = Math.round(subtotal * 0.07);

  return (
    <div>
      <Field label="Patient">
        <Select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          {state.patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </Select>
      </Field>
      <div className="mt-3.5">
        <div className="mb-1.5 text-[12.5px] font-semibold text-text-soft">Services</div>
        {items.map((it, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <TextInput value={it.label} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Service" />
            <TextInput type="number" value={it.amount} onChange={(e) => updateItem(i, "amount", Number(e.target.value))} className="w-[110px]" />
            {items.length > 1 && (
              <Btn variant="ghost" size="sm" onClick={() => setItems((arr) => arr.filter((_, idx) => idx !== i))}><X size={14} /></Btn>
            )}
          </div>
        ))}
        <Btn variant="secondary" size="sm" icon={Plus} onClick={() => setItems((arr) => [...arr, { label: "", amount: 0 }])}>Add line item</Btn>
      </div>
      <Field label="Payment Method" span={2} className="mt-3.5">
        <Select value={method} onChange={(e) => setMethod(e.target.value)}>{["Credit Card", "Insurance", "Cash", "Bank Transfer"].map((m) => <option key={m}>{m}</option>)}</Select>
      </Field>
      <div className="mt-4 flex justify-between border-t border-border pt-3 text-[13.5px]">
        <span>Subtotal</span><span>{fmtMoney(subtotal)}</span>
      </div>
      <div className="flex justify-between text-[13.5px] text-text-soft"><span>Tax (7%)</span><span>{fmtMoney(tax)}</span></div>
      <div className="mt-1 flex justify-between text-[15px] font-extrabold"><span>Total</span><span>{fmtMoney(subtotal + tax)}</span></div>
      <div className="mt-5 flex justify-end gap-2.5">
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={() => onSave({ patientId, items, subtotal, tax, total: subtotal + tax, method })}>Create Invoice</Btn>
      </div>
    </div>
  );
}
