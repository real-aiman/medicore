import React from "react";
import { Users, CalendarClock, Pill, FlaskConical, Receipt } from "lucide-react";
import { Modal } from "./ui";

const OPTIONS = [
  { key: "patient", label: "Add Patient", icon: Users },
  { key: "appointment", label: "Book Appointment", icon: CalendarClock },
  { key: "prescription", label: "Add Prescription", icon: Pill },
  { key: "lab", label: "Add Lab Test", icon: FlaskConical },
  { key: "invoice", label: "Create Invoice", icon: Receipt },
];

export default function QuickAddMenu({ onSelect }: { onSelect: (key: string | null) => void }) {
  return (
    <Modal open onClose={() => onSelect(null)} title="Quick Add" width={380}>
      <div className="flex flex-col gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.key} onClick={() => onSelect(o.key)}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-surface p-3 text-[13.5px] font-semibold text-text hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-light">
              <o.icon size={15} className="text-blue" />
            </div>
            {o.label}
          </button>
        ))}
      </div>
    </Modal>
  );
}
