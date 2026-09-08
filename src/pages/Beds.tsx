import React, { useMemo, useState } from "react";
import { BedDouble } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { useToast } from "../store/uiStore";
import { Card, SectionHeader, Select, Modal, Field, StatusBadge, InfoRow, Avatar } from "../components/ui";
import { WARDS } from "../data/seed";
import { fmtDate } from "../utils/helpers";
import type { Bed, BedStatus } from "../types";

const BED_COLORS: Record<BedStatus, { bg: string; fg: string }> = {
  Available: { bg: "var(--green-bg)", fg: "var(--green)" },
  Occupied: { bg: "var(--red-bg)", fg: "var(--red)" },
  Reserved: { bg: "var(--amber-bg)", fg: "var(--amber)" },
  Cleaning: { bg: "var(--blue-light)", fg: "var(--blue)" },
  Maintenance: { bg: "var(--slate-100)", fg: "var(--text-soft)" },
};

export default function Beds() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [detail, setDetail] = useState<Bed | null>(null);
  const [wardFilter, setWardFilter] = useState("All");
  const summary = useMemo(() => {
    const s: Record<BedStatus, number> = { Available: 0, Occupied: 0, Reserved: 0, Cleaning: 0, Maintenance: 0 };
    state.beds.forEach((b) => s[b.status]++);
    return s;
  }, [state.beds]);
  const wards = wardFilter === "All" ? WARDS : [wardFilter];
  const patientOf = (id: string) => state.patients.find((p) => p.id === id);

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader
        title="Bed Management" subtitle={`${state.beds.length} total beds across ${WARDS.length} wards`}
        action={<Select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} className="w-[170px]"><option>All</option>{WARDS.map((w) => <option key={w}>{w}</option>)}</Select>}
      />

      <div className="mb-4.5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
        {(Object.entries(summary) as [BedStatus, number][]).map(([status, count]) => (
          <Card key={status} className="flex items-center gap-2.5 p-3">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: BED_COLORS[status].fg }} />
            <div><div className="text-[17px] font-extrabold">{count}</div><div className="text-[11px] text-text-soft">{status}</div></div>
          </Card>
        ))}
      </div>

      {wards.map((ward) => (
        <div key={ward} className="mb-5.5">
          <div className="mb-2.5 text-sm font-bold">
            {ward} <span className="text-xs font-medium text-text-soft">({state.beds.filter((b) => b.ward === ward).length} beds)</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
            {state.beds.filter((b) => b.ward === ward).map((b) => {
              const c = BED_COLORS[b.status];
              return (
                <button
                  key={b.id} onClick={() => setDetail(b)}
                  className="mc-focus flex flex-col items-center gap-0.5 rounded-lg border border-transparent px-1.5 py-2.5 transition-transform hover:-translate-y-0.5"
                  style={{ background: c.bg, color: c.fg }}
                >
                  <BedDouble size={16} />
                  <span className="text-[11.5px] font-bold">{b.number}</span>
                  <span className="text-[9.5px] font-semibold">{b.status}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Bed ${detail.number}` : ""} width={420}>
        {detail && (
          <div>
            <InfoRow label="Ward" value={detail.ward} />
            <InfoRow label="Status" value={<StatusBadge status={detail.status} />} />
            {detail.status === "Occupied" && detail.patientId && (() => {
              const p = patientOf(detail.patientId);
              return p ? (
                <>
                  <div className="h-2" />
                  <div className="flex items-center gap-2.5 py-2">
                    <Avatar name={`${p.firstName} ${p.lastName}`} />
                    <div><div className="text-[13.5px] font-bold">{p.firstName} {p.lastName}</div><div className="text-[11.5px] text-text-soft">{p.mrn}</div></div>
                  </div>
                  <InfoRow label="Department" value={p.department} /><InfoRow label="Admitted" value={fmtDate(p.lastVisit)} />
                </>
              ) : null;
            })()}
            <div className="mt-4">
              <Field label="Update Status">
                <Select
                  value={detail.status}
                  onChange={(e) => {
                    const status = e.target.value as Bed["status"];
                    dispatch({ type: "UPDATE_BED", payload: { id: detail.id, status, patientId: status === "Occupied" ? detail.patientId : null } });
                    setDetail((d: Bed | null) => (d ? { ...d, status } : d));
                    toast("Bed status updated");
                  }}
                >
                  {Object.keys(BED_COLORS).map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
