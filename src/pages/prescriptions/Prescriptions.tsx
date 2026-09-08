import React, { useState } from "react";
import { Plus, Trash2, Pill } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { useToast } from "../../store/uiStore";
import { Card, SectionHeader, Btn, Select, ResponsiveTable, StatusBadge, Modal, ConfirmDialog, EmptyState, IconBtn } from "../../components/ui";
import { fmtDate, uid, todayISO, isoOf, addDays } from "../../utils/helpers";
import PrescriptionForm from "./PrescriptionForm";
import type { Prescription } from "../../types";

export default function Prescriptions() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Prescription | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const patientOf = (id: string) => state.patients.find((p) => p.id === id);
  const doctorOf = (id: string) => state.doctors.find((d) => d.id === id);
  const rows = state.prescriptions.filter((r) => statusFilter === "All" || r.status === statusFilter);

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader
        title="Prescriptions" subtitle={`${rows.length} medication orders`}
        action={
          <div className="flex gap-2">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[150px]">
              <option>All</option><option>Active</option><option>Completed</option><option>Expired</option>
            </Select>
            <Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)}>New Prescription</Btn>
          </div>
        }
      />
      <Card className="p-1.5">
        <ResponsiveTable<Prescription>
          columns={[
            { key: "id", header: "Rx ID" },
            { key: "patient", header: "Patient", render: (r) => { const p = patientOf(r.patientId); return p ? `${p.firstName} ${p.lastName}` : "\u2014"; } },
            { key: "doctor", header: "Doctor", render: (r) => doctorOf(r.doctorId)?.name },
            { key: "medication", header: "Medication" }, { key: "dosage", header: "Dosage" }, { key: "frequency", header: "Frequency" },
            { key: "startDate", header: "Start", render: (r) => fmtDate(r.startDate) }, { key: "endDate", header: "End", render: (r) => fmtDate(r.endDate) },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "actions", header: "", align: "right", render: (r) => <IconBtn icon={Trash2} label="Delete prescription" onClick={() => setConfirmDelete(r)} /> },
          ]}
          rows={rows}
          mobileCard={(r) => {
            const p = patientOf(r.patientId);
            return (
              <Card className="p-3">
                <div className="flex justify-between">
                  <div><div className="text-[13px] font-bold">{r.medication}</div><div className="text-[11.5px] text-text-soft">{p?.firstName} {p?.lastName}</div></div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-1.5 text-xs text-text-soft">{r.dosage} \u00b7 {r.frequency}</div>
              </Card>
            );
          }}
          empty={<EmptyState icon={Pill} title="No prescriptions" subtitle="Create a prescription to get started." action={<Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)} className="mt-2">New Prescription</Btn>} />}
        />
      </Card>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Prescription" width={620}>
        <PrescriptionForm
          onCancel={() => setShowAdd(false)}
          onSave={(form) => {
            const start = todayISO(); const end = isoOf(addDays(new Date(), Number(form.duration) || 7));
            const prescription: Prescription = { ...form, id: uid("rx"), startDate: start, endDate: end, status: "Active" };
            dispatch({ type: "ADD_PRESCRIPTION", payload: prescription });
            setShowAdd(false); toast("Prescription created");
          }}
        />
      </Modal>
      <ConfirmDialog
        open={!!confirmDelete} onCancel={() => setConfirmDelete(null)} title="Delete prescription?" message="This will permanently remove this prescription from the patient's record."
        onConfirm={() => { if (confirmDelete) { dispatch({ type: "DELETE_PRESCRIPTION", payload: confirmDelete.id }); toast("Prescription deleted", "warning"); setConfirmDelete(null); } }}
      />
    </div>
  );
}
