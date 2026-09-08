import React, { useState } from "react";
import { Search, Package } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { Card, SectionHeader, Select, ResponsiveTable, StatusBadge, EmptyState } from "../components/ui";
import { fmtDate } from "../utils/helpers";
import type { MedicineInventoryItem } from "../types";

export default function Pharmacy() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const rows = state.pharmacy.filter((m) => (statusFilter === "All" || m.status === statusFilter) && (!search || m.name.toLowerCase().includes(search.toLowerCase())));
  const lowStock = state.pharmacy.filter((m) => m.status === "Low Stock" || m.status === "Out of Stock").length;

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader title="Pharmacy" subtitle={`${state.pharmacy.length} items in inventory \u00b7 ${lowStock} need attention`} />
      <Card className="mb-3.5 p-3.5">
        <div className="flex flex-wrap gap-2.5">
          <div className="flex flex-1 basis-[220px] items-center gap-1.5 rounded-md border border-border bg-slate-100 px-2.5 py-1.5">
            <Search size={15} className="text-text-soft" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicine..." className="w-full border-none bg-transparent text-[13px] text-text outline-none" />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
            <option>All</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option><option>Expired</option>
          </Select>
        </div>
      </Card>
      <Card className="p-1.5">
        <ResponsiveTable<MedicineInventoryItem>
          columns={[
            { key: "name", header: "Medicine" }, { key: "category", header: "Category" }, { key: "stock", header: "Stock", render: (m) => `${m.stock} units` },
            { key: "expiry", header: "Expiry", render: (m) => fmtDate(m.expiry) }, { key: "supplier", header: "Supplier" },
            { key: "status", header: "Status", render: (m) => <StatusBadge status={m.status} /> },
          ]}
          rows={rows}
          mobileCard={(m) => (
            <Card className="p-3">
              <div className="flex justify-between"><div className="text-[13px] font-bold">{m.name}</div><StatusBadge status={m.status} /></div>
              <div className="mt-1.5 text-xs text-text-soft">{m.category} \u00b7 {m.stock} units \u00b7 exp. {fmtDate(m.expiry)}</div>
            </Card>
          )}
          empty={<EmptyState icon={Package} title="No matching medicines" subtitle="Try a different search term or status filter." />}
        />
      </Card>
    </div>
  );
}
