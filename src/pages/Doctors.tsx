import React, { useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { Card, SectionHeader, Select, Avatar, StatusBadge, EmptyState } from "../components/ui";

export default function Doctors({ openDoctor }: { openDoctor: (id: string) => void }) {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const specs = ["All", ...new Set(state.doctors.map((d) => d.specialty))];
  const filtered = state.doctors.filter((d) => (specFilter === "All" || d.specialty === specFilter) && (!search || d.name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader title="Doctors" subtitle={`${filtered.length} medical staff`} />
      <Card className="mb-3.5 p-3.5">
        <div className="flex flex-wrap gap-2.5">
          <div className="flex flex-1 basis-[220px] items-center gap-1.5 rounded-md border border-border bg-slate-100 px-2.5 py-1.5">
            <Search size={15} className="text-text-soft" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors..." className="w-full border-none bg-transparent text-[13px] text-text outline-none" />
          </div>
          <Select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="w-[200px]">{specs.map((s) => <option key={s}>{s}</option>)}</Select>
        </div>
      </Card>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {filtered.map((d) => (
          <Card key={d.id} className="animate-fade-in cursor-pointer p-4" onClick={() => openDoctor(d.id)}>
            <div className="flex items-start justify-between">
              <Avatar name={d.name} size={44} />
              <StatusBadge status={d.availability} />
            </div>
            <div className="mt-2.5 text-[14.5px] font-bold">{d.name}</div>
            <div className="text-[12.5px] text-text-soft">{d.specialty} \u00b7 {d.department}</div>
            <div className="mt-3 flex justify-between border-t border-border pt-2.5 text-xs text-text-soft">
              <span>{d.experience} yrs exp.</span><span>{d.patients} patients</span><span>\u2605 {d.rating}</span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <EmptyState title="No doctors found" subtitle="Try a different search or specialty filter." />}
      </div>
    </div>
  );
}
