import React from "react";
import { useStore } from "../store/hospitalStore";
import { Card, SectionHeader, StatusBadge, MiniStat } from "../components/ui";

export default function Departments() {
  const { state } = useStore();
  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader title="Departments" subtitle={`${state.departments.length} clinical departments`} />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
        {state.departments.map((d) => (
          <Card key={d.name} className="animate-fade-in p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="text-[14.5px] font-bold">{d.name}</span>
              </div>
              <StatusBadge status={d.status} />
            </div>
            <div className="my-2 text-xs text-text-soft">Head: {d.headDoctor}</div>
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2.5">
              <MiniStat label="Doctors" value={d.doctors} /><MiniStat label="Patients" value={d.patients} />
              <MiniStat label="Available Beds" value={d.availableBeds} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
