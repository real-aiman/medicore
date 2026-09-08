import React, { useEffect, useMemo, useState } from "react";
import { Search, Download, Plus, Edit2, Trash2, Users } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { useToast } from "../../store/uiStore";
import { Card, SectionHeader, Btn, Select, ResponsiveTable, Pagination, Avatar, StatusBadge, Modal, ConfirmDialog, EmptyState, IconBtn } from "../../components/ui";
import { DEPARTMENTS_BASE } from "../../data/seed";
import { fmtDate, uid, todayISO, randInt } from "../../utils/helpers";
import PatientForm from "./PatientForm";
import type { Patient } from "../../types";

export default function Patients({ openPatient }: { openPatient: (id: string) => void }) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Patient | null>(null);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return state.patients.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q) || p.phone.includes(q);
      const matchesDept = deptFilter === "All" || p.department === deptFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [state.patients, search, deptFilter, statusFilter]);

  useEffect(() => { setPage(1); }, [search, deptFilter, statusFilter]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const doctorOf = (id: string) => state.doctors.find((d) => d.id === id);
  const age = (dob: string) => { const d = new Date(dob); const diff = Date.now() - d.getTime(); return Math.floor(diff / (365.25 * 24 * 3600 * 1000)); };

  const handleExport = () => {
    const rows = filtered.map((p) => ({ MRN: p.mrn, Name: `${p.firstName} ${p.lastName}`, Age: age(p.dob), Gender: p.gender, Department: p.department, Doctor: doctorOf(p.doctorId)?.name, LastVisit: p.lastVisit, Status: p.status }));
    if (!rows.length) { toast("Nothing to export", "warning"); return; }
    const csv = [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "patients-export.csv"; a.click(); URL.revokeObjectURL(url);
    toast("Patient list exported as CSV");
  };

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader
        title="Patients" subtitle={`${filtered.length} patient record${filtered.length !== 1 ? "s" : ""}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Btn variant="secondary" size="sm" icon={Download} onClick={handleExport}>Export</Btn>
            <Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)}>Add Patient</Btn>
          </div>
        }
      />

      <Card className="mb-3.5 p-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-1 basis-[220px] items-center gap-1.5 rounded-md border border-border bg-slate-100 px-2.5 py-1.5">
            <Search size={15} className="text-text-soft" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, MRN, or phone..." className="w-full border-none bg-transparent text-[13px] text-text outline-none" />
          </div>
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-[180px]">
            <option>All</option>{DEPARTMENTS_BASE.map((d) => <option key={d.name}>{d.name}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36">
            <option>All</option><option>Active</option><option>Inactive</option>
          </Select>
        </div>
      </Card>

      <Card className="p-1.5">
        <ResponsiveTable<Patient>
          columns={[
            { key: "mrn", header: "Patient ID" },
            { key: "patient", header: "Patient", render: (p) => <div className="flex items-center gap-2.5"><Avatar name={`${p.firstName} ${p.lastName}`} /><div><div className="font-semibold">{p.firstName} {p.lastName}</div><div className="text-[11px] text-text-soft">{p.email}</div></div></div> },
            { key: "age", header: "Age", render: (p) => age(p.dob) },
            { key: "gender", header: "Gender" },
            { key: "department", header: "Department" },
            { key: "doctor", header: "Doctor", render: (p) => doctorOf(p.doctorId)?.name || "\u2014" },
            { key: "lastVisit", header: "Last Visit", render: (p) => fmtDate(p.lastVisit) },
            { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
            {
              key: "actions", header: "", align: "right", render: (p) => (
                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <IconBtn icon={Edit2} label="Edit patient" onClick={() => setEditPatient(p)} />
                  <IconBtn icon={Trash2} label="Delete patient" onClick={() => setConfirmDelete(p)} />
                </div>
              ),
            },
          ]}
          rows={paged}
          onRowClick={(p) => openPatient(p.id)}
          mobileCard={(p) => (
            <Card className="animate-row-in p-3">
              <div className="flex items-start justify-between" onClick={() => openPatient(p.id)}>
                <div className="flex gap-2.5">
                  <Avatar name={`${p.firstName} ${p.lastName}`} />
                  <div><div className="text-[13.5px] font-bold">{p.firstName} {p.lastName}</div><div className="text-[11.5px] text-text-soft">{p.mrn} \u00b7 {age(p.dob)}y \u00b7 {p.gender}</div></div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-2.5 flex justify-between text-xs text-text-soft">
                <span>{p.department}</span><span>{fmtDate(p.lastVisit)}</span>
              </div>
              <div className="mt-2.5 flex gap-2">
                <Btn variant="secondary" size="sm" icon={Edit2} onClick={() => setEditPatient(p)} className="flex-1 justify-center">Edit</Btn>
                <Btn variant="subtleDanger" size="sm" icon={Trash2} onClick={() => setConfirmDelete(p)} className="flex-1 justify-center">Delete</Btn>
              </div>
            </Card>
          )}
          empty={<EmptyState icon={Users} title="No patients found" subtitle="Try a different search term or filter, or add a new patient." action={<Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)} className="mt-2">Add Patient</Btn>} />}
        />
        <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Patient" width={680}>
        <PatientForm
          onCancel={() => setShowAdd(false)}
          onSave={(form) => {
            const patient: Patient = { ...form, id: uid("pt"), mrn: `MC-${10240 + state.patients.length + randInt(1, 90)}`, lastVisit: todayISO(), nextAppointment: null, status: "Active", createdAt: todayISO() };
            dispatch({ type: "ADD_PATIENT", payload: patient });
            setShowAdd(false);
            toast("Patient added successfully");
          }}
        />
      </Modal>

      <Modal open={!!editPatient} onClose={() => setEditPatient(null)} title="Edit Patient" width={680}>
        {editPatient && (
          <PatientForm
            initial={editPatient}
            onCancel={() => setEditPatient(null)}
            onSave={(form) => {
              dispatch({ type: "UPDATE_PATIENT", payload: { ...editPatient, ...form } });
              setEditPatient(null);
              toast("Patient details updated");
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete} onCancel={() => setConfirmDelete(null)}
        title="Delete patient?" message={`This will remove ${confirmDelete?.firstName} ${confirmDelete?.lastName} from the current hospital records. This action cannot be undone.`}
        onConfirm={() => { if (confirmDelete) { dispatch({ type: "DELETE_PATIENT", payload: confirmDelete.id }); toast("Patient removed", "warning"); setConfirmDelete(null); } }}
      />
    </div>
  );
}
