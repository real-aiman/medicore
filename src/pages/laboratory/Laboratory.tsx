import React, { useState } from "react";
import { Plus, FlaskConical } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { useToast } from "../../store/uiStore";
import { Card, SectionHeader, Btn, Badge, ResponsiveTable, StatusBadge, Modal, EmptyState, InfoRow } from "../../components/ui";
import { fmtDate, uid } from "../../utils/helpers";
import LabForm from "./LabForm";
import type { LabTest } from "../../types";

export default function Laboratory() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [detail, setDetail] = useState<LabTest | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const patientOf = (id: string) => state.patients.find((p) => p.id === id);
  const doctorOf = (id: string) => state.doctors.find((d) => d.id === id);
  const pending = state.labs.filter((l) => l.status !== "Completed");
  const completed = state.labs.filter((l) => l.status === "Completed");

  const cols = [
    { key: "id", header: "Test ID" },
    { key: "patient", header: "Patient", render: (l: LabTest) => { const p = patientOf(l.patientId); return p ? `${p.firstName} ${p.lastName}` : "\u2014"; } },
    { key: "test", header: "Test" }, { key: "doctor", header: "Doctor", render: (l: LabTest) => doctorOf(l.doctorId)?.name },
    { key: "date", header: "Date", render: (l: LabTest) => fmtDate(l.date) },
    { key: "status", header: "Status", render: (l: LabTest) => <StatusBadge status={l.status} /> },
  ];

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader title="Laboratory" subtitle="Test orders and results" action={<Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)}>Add Lab Test</Btn>} />
      <div className="mb-5">
        <div className="mb-2 text-sm font-bold">Pending Tests <Badge tone="amber">{pending.length}</Badge></div>
        <Card className="p-1.5">
          <ResponsiveTable<LabTest> columns={cols} rows={pending} onRowClick={setDetail} empty={<EmptyState icon={FlaskConical} title="No pending tests" subtitle="All caught up \u2014 new orders will appear here." />} />
        </Card>
      </div>
      <div>
        <div className="mb-2 text-sm font-bold">Completed Tests <Badge tone="green">{completed.length}</Badge></div>
        <Card className="p-1.5">
          <ResponsiveTable<LabTest> columns={cols} rows={completed} onRowClick={setDetail} empty={<EmptyState icon={FlaskConical} title="No completed tests yet" />} />
        </Card>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Lab Result" width={480}>
        {detail && (() => {
          const p = patientOf(detail.patientId); const d = doctorOf(detail.doctorId);
          return (
            <div>
              <div className="mb-1 rounded-lg border border-border p-3.5">
                <InfoRow label="Patient" value={p ? `${p.firstName} ${p.lastName} (${p.mrn})` : "\u2014"} />
                <InfoRow label="Doctor" value={d?.name} /><InfoRow label="Test" value={detail.test} />
                <InfoRow label="Date" value={fmtDate(detail.date)} /><InfoRow label="Reference Range" value={detail.referenceRange} />
                <InfoRow label="Status" value={<StatusBadge status={detail.status} />} />
                <InfoRow label="Result" value={detail.result || "Awaiting processing"} />
              </div>
              {detail.status !== "Completed" && (
                <div className="mt-3 flex gap-2">
                  {detail.status === "Pending" && (
                    <Btn variant="secondary" size="sm" onClick={() => { dispatch({ type: "UPDATE_LAB", payload: { id: detail.id, status: "Processing" } }); setDetail((x) => (x ? { ...x, status: "Processing" } : x)); toast("Test moved to processing"); }}>
                      Start Processing
                    </Btn>
                  )}
                  <Btn size="sm" onClick={() => { dispatch({ type: "UPDATE_LAB", payload: { id: detail.id, status: "Completed", result: "Within normal limits" } }); setDetail((x) => (x ? { ...x, status: "Completed", result: "Within normal limits" } : x)); toast("Result recorded"); }}>
                    Mark Completed
                  </Btn>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Order Lab Test" width={520}>
        <LabForm
          onCancel={() => setShowAdd(false)}
          onSave={(form) => { dispatch({ type: "ADD_LAB", payload: { ...form, id: uid("lab"), status: "Pending", result: "" } }); setShowAdd(false); toast("Lab test ordered"); }}
        />
      </Modal>
    </div>
  );
}
