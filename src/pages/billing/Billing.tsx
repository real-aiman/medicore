import React, { useState } from "react";
import { Plus, TrendingUp, Clock, CheckCircle2, AlertTriangle, Printer, FileDown, Receipt } from "lucide-react";
import { useStore } from "../../store/hospitalStore";
import { useToast } from "../../store/uiStore";
import { Card, SectionHeader, Btn, Select, StatCard, ResponsiveTable, StatusBadge, Modal, EmptyState } from "../../components/ui";
import { fmtDate, fmtMoney, todayISO, randInt } from "../../utils/helpers";
import { downloadInvoicePdf } from "../../utils/pdf";
import InvoiceForm from "./InvoiceForm";
import InvoiceDocument from "./InvoiceDocument";
import type { Invoice } from "../../types";

export default function Billing() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const patientOf = (id: string) => state.patients.find((p) => p.id === id);
  const today = todayISO();
  const todayRevenue = state.invoices.filter((i) => i.date === today && i.status === "Paid").reduce((a, b) => a + b.total, 0);
  const pending = state.invoices.filter((i) => i.status === "Pending").reduce((a, b) => a + b.total, 0);
  const paidCount = state.invoices.filter((i) => i.status === "Paid").length;
  const outstanding = state.invoices.filter((i) => i.status === "Overdue").reduce((a, b) => a + b.total, 0);
  const rows = state.invoices.filter((i) => statusFilter === "All" || i.status === statusFilter);

  return (
    <div className="mc-fade-in animate-fade-in">
      <SectionHeader title="Billing" subtitle={`${state.invoices.length} invoices`} action={<Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)}>Create Invoice</Btn>} />
      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <StatCard label="Today's Revenue" value={fmtMoney(todayRevenue)} icon={TrendingUp} tone="green" />
        <StatCard label="Pending Payments" value={fmtMoney(pending)} icon={Clock} tone="amber" />
        <StatCard label="Paid Invoices" value={paidCount} icon={CheckCircle2} tone="blue" />
        <StatCard label="Outstanding" value={fmtMoney(outstanding)} icon={AlertTriangle} tone="navy" />
      </div>
      <Card className="mb-3.5 p-3.5">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option>All</option><option>Paid</option><option>Pending</option><option>Overdue</option>
        </Select>
      </Card>
      <Card className="p-1.5">
        <ResponsiveTable<Invoice>
          columns={[
            { key: "id", header: "Invoice ID" }, { key: "patient", header: "Patient", render: (i) => { const p = patientOf(i.patientId); return p ? `${p.firstName} ${p.lastName}` : "\u2014"; } },
            { key: "date", header: "Date", render: (i) => fmtDate(i.date) }, { key: "total", header: "Amount", render: (i) => fmtMoney(i.total) },
            { key: "method", header: "Method" }, { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
          ]}
          rows={rows} onRowClick={setDetail}
          mobileCard={(i) => {
            const p = patientOf(i.patientId);
            return (
              <Card className="p-3" onClick={() => setDetail(i)}>
                <div className="flex justify-between">
                  <div><div className="text-[13px] font-bold">{i.id}</div><div className="text-[11.5px] text-text-soft">{p?.firstName} {p?.lastName}</div></div>
                  <StatusBadge status={i.status} />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-text-soft">
                  <span>{fmtDate(i.date)}</span><span className="font-bold text-text">{fmtMoney(i.total)}</span>
                </div>
              </Card>
            );
          }}
          empty={<EmptyState icon={Receipt} title="No invoices found" subtitle="Create an invoice to start billing." action={<Btn size="sm" icon={Plus} onClick={() => setShowAdd(true)} className="mt-2">Create Invoice</Btn>} />}
        />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Invoice" width={560}>
        <InvoiceForm
          onCancel={() => setShowAdd(false)}
          onSave={(form) => {
            const invoice: Invoice = { ...form, id: `INV-${2200 + state.invoices.length + randInt(1, 90)}`, date: todayISO(), status: "Pending" };
            dispatch({ type: "ADD_INVOICE", payload: invoice });
            setShowAdd(false); toast("Invoice created");
          }}
        />
      </Modal>

      <Modal
        open={!!detail} onClose={() => setDetail(null)} title="Invoice" width={560}
        footer={detail && (
          <>
            {detail.status !== "Paid" && (
              <Btn variant="secondary" size="sm" onClick={() => { dispatch({ type: "UPDATE_INVOICE", payload: { id: detail.id, status: "Paid" } }); toast("Invoice marked as paid"); setDetail((d) => (d ? { ...d, status: "Paid" } : d)); }}>
                Mark as Paid
              </Btn>
            )}
            <Btn variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>Print Invoice</Btn>
            <Btn
              size="sm" icon={FileDown}
              onClick={() => { downloadInvoicePdf(detail, patientOf(detail.patientId), state.settings); toast("Invoice PDF downloaded"); }}
            >
              Download PDF
            </Btn>
          </>
        )}
      >
        {detail && <InvoiceDocument invoice={detail} patient={patientOf(detail.patientId)} settings={state.settings} />}
      </Modal>
    </div>
  );
}
