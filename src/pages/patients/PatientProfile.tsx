import React, { useState } from "react";
import clsx from "clsx";
import { ChevronLeft, Edit2, CalendarClock, ClipboardList, Phone, Mail, MapPin, Droplet, ShieldAlert, Activity, Pill, FlaskConical, Receipt, FileDown } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { useToast } from "../../store/uiStore";
import { Card, SectionHeader, Btn, StatusBadge, InfoRow, ResponsiveTable, EmptyState, Avatar, Modal } from "../../components/ui";
import { fmtDate, fmtMoney } from "../../utils/helpers";
import { downloadPatientSummaryPdf } from "../../utils/pdf";
import PatientForm from "./PatientForm";
import type { Appointment, Prescription, LabTest, Invoice } from "../../types";

const TABS = [
  { key: "overview", label: "Overview" }, { key: "appointments", label: "Appointments" }, { key: "history", label: "Medical History" },
  { key: "prescriptions", label: "Prescriptions" }, { key: "labs", label: "Lab Results" }, { key: "billing", label: "Billing" },
];

interface PatientProfileProps {
  patientId: string;
  onBack: () => void;
  setPage: (p: string) => void;
}
export default function PatientProfile({ patientId, onBack, setPage }: PatientProfileProps) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const patient = state.patients.find((p) => p.id === patientId);
  if (!patient) return <EmptyState title="Patient not found" subtitle="This patient record may have been removed." action={<Btn size="sm" onClick={onBack} className="mt-2">Back to patients</Btn>} />;

  const doctor = state.doctors.find((d) => d.id === patient.doctorId);
  const age = Math.floor((Date.now() - new Date(patient.dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  const appts = state.appointments.filter((a) => a.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const rx = state.prescriptions.filter((r) => r.patientId === patientId);
  const labs = state.labs.filter((l) => l.patientId === patientId);
  const invoices = state.invoices.filter((i) => i.patientId === patientId);

  const timeline = [
    ...appts.map((a) => ({ date: a.date, title: `${a.type} \u2014 ${a.department}`, sub: state.doctors.find((d) => d.id === a.doctorId)?.name })),
    ...labs.map((l) => ({ date: l.date, title: l.test, sub: "Laboratory" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mc-fade-in animate-fade-in">
      <button onClick={onBack} className="mc-focus mb-3 flex items-center gap-1.5 border-none bg-transparent p-0 text-xs text-text-soft">
        <ChevronLeft size={14} /> Back to patients
      </button>

      <Card className="mb-3.5 p-4.5">
        <div className="flex flex-wrap justify-between gap-3.5">
          <div className="flex gap-3.5">
            <Avatar name={`${patient.firstName} ${patient.lastName}`} size={54} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="m-0 text-lg font-extrabold">{patient.firstName} {patient.lastName}</h2>
                <StatusBadge status={patient.status} />
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-[12.5px] text-text-soft">
                <span>{patient.mrn}</span><span>{age} yrs \u00b7 {patient.gender}</span>
                <span className="flex items-center gap-1"><Droplet size={12} /> {patient.bloodGroup}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <Btn variant="secondary" size="sm" icon={Edit2} onClick={() => setShowEdit(true)}>Edit</Btn>
            <Btn variant="secondary" size="sm" icon={CalendarClock} onClick={() => setPage("appointments")}>New Appointment</Btn>
            <Btn variant="secondary" size="sm" icon={FileDown} onClick={() => downloadPatientSummaryPdf(patient, doctor?.name ?? "\u2014", appts)}>Export PDF</Btn>
            <Btn size="sm" icon={ClipboardList} onClick={() => setPage("prescriptions")}>Add Medical Record</Btn>
          </div>
        </div>
      </Card>

      <div className="mc-scroll mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={clsx(
              "mc-focus whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13px]",
              tab === t.key ? "border-blue font-bold text-text" : "border-transparent font-medium text-text-soft"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mc-grid-2col grid grid-cols-2 gap-3.5">
          <Card className="p-4.5">
            <SectionHeader title="Contact Information" />
            <InfoRow icon={Phone} label="Phone" value={patient.phone} />
            <InfoRow icon={Mail} label="Email" value={patient.email || "\u2014"} />
            <InfoRow icon={MapPin} label="Address" value={patient.address || "\u2014"} />
            <div className="h-2.5" />
            <SectionHeader title="Emergency Contact" />
            <InfoRow label="Name" value={patient.emergencyContact} />
            <InfoRow label="Relationship" value={patient.emergencyRelation} />
            <InfoRow icon={Phone} label="Phone" value={patient.emergencyPhone} />
          </Card>
          <Card className="p-4.5">
            <SectionHeader title="Medical Summary" />
            <InfoRow icon={ShieldAlert} label="Allergies" value={patient.allergies} />
            <InfoRow icon={Activity} label="Conditions" value={patient.conditions} />
            <InfoRow label="Insurance" value={patient.insurance} />
            <div className="h-2.5" />
            <SectionHeader title="Care Team" />
            <InfoRow label="Department" value={patient.department} />
            <InfoRow label="Primary Doctor" value={doctor?.name || "\u2014"} />
            <InfoRow label="Last Visit" value={fmtDate(patient.lastVisit)} />
            <InfoRow label="Next Appointment" value={patient.nextAppointment ? fmtDate(patient.nextAppointment) : "Not scheduled"} />
          </Card>
        </div>
      )}

      {tab === "appointments" && (
        <Card className="p-1.5">
          <ResponsiveTable<Appointment>
            columns={[
              { key: "date", header: "Date", render: (a) => fmtDate(a.date) }, { key: "time", header: "Time" },
              { key: "doctor", header: "Doctor", render: (a) => state.doctors.find((d) => d.id === a.doctorId)?.name },
              { key: "department", header: "Department" }, { key: "type", header: "Type" },
              { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
            ]}
            rows={appts}
            empty={<EmptyState icon={CalendarClock} title="No appointments yet" subtitle="This patient has no appointment history." />}
          />
        </Card>
      )}

      {tab === "history" && (
        <Card className="p-5">
          {timeline.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No medical history" subtitle="Records will appear here as care is provided." />
          ) : (
            <div className="relative pl-5">
              <div className="absolute bottom-1 left-[5px] top-1 w-[1.5px] bg-border" />
              {timeline.map((t, i) => (
                <div key={i} className="relative pb-5">
                  <div className="absolute -left-5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-blue" />
                  <div className="text-[11.5px] font-semibold text-text-soft">{fmtDate(t.date)}</div>
                  <div className="mt-0.5 text-[13.5px] font-bold">{t.title}</div>
                  {t.sub && <div className="text-xs text-text-soft">{t.sub}</div>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "prescriptions" && (
        <Card className="p-1.5">
          <ResponsiveTable<Prescription>
            columns={[
              { key: "medication", header: "Medication" }, { key: "dosage", header: "Dosage" }, { key: "frequency", header: "Frequency" },
              { key: "startDate", header: "Start", render: (r) => fmtDate(r.startDate) }, { key: "endDate", header: "End", render: (r) => fmtDate(r.endDate) },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={rx}
            empty={<EmptyState icon={Pill} title="No prescriptions" subtitle="No medication has been prescribed yet." />}
          />
        </Card>
      )}

      {tab === "labs" && (
        <Card className="p-1.5">
          <ResponsiveTable<LabTest>
            columns={[
              { key: "test", header: "Test" }, { key: "date", header: "Date", render: (l) => fmtDate(l.date) },
              { key: "status", header: "Status", render: (l) => <StatusBadge status={l.status} /> }, { key: "result", header: "Result", render: (l) => l.result || "Pending" },
            ]}
            rows={labs}
            empty={<EmptyState icon={FlaskConical} title="No lab results" subtitle="No lab tests on file for this patient." />}
          />
        </Card>
      )}

      {tab === "billing" && (
        <Card className="p-1.5">
          <ResponsiveTable<Invoice>
            columns={[
              { key: "id", header: "Invoice" }, { key: "date", header: "Date", render: (i) => fmtDate(i.date) },
              { key: "total", header: "Amount", render: (i) => fmtMoney(i.total) }, { key: "method", header: "Method" },
              { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
            ]}
            rows={invoices}
            empty={<EmptyState icon={Receipt} title="No invoices" subtitle="No billing records for this patient." />}
          />
        </Card>
      )}

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Patient" width={680}>
        <PatientForm
          initial={patient} onCancel={() => setShowEdit(false)}
          onSave={(form) => { dispatch({ type: "UPDATE_PATIENT", payload: { ...patient, ...form } }); setShowEdit(false); toast("Patient details updated"); }}
        />
      </Modal>
    </div>
  );
}
