import React from "react";
import { StatusBadge } from "../../components/ui";
import { fmtDate, fmtMoney } from "../../utils/helpers";
import type { Invoice, Patient, HospitalSettings } from "../../types";

interface InvoiceDocumentProps {
  invoice: Invoice;
  patient?: Patient;
  settings: HospitalSettings;
}
export default function InvoiceDocument({ invoice, patient, settings }: InvoiceDocumentProps) {
  return (
    <div className="p-6 text-[13px]">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="text-[17px] font-extrabold">{settings.hospitalName}</div>
          <div className="mt-0.5 text-xs text-text-soft">{settings.address}</div>
          <div className="text-xs text-text-soft">{settings.phone} \u00b7 {settings.email}</div>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-extrabold">INVOICE</div>
          <div className="text-xs text-text-soft">{invoice.id}</div>
          <div className="text-xs text-text-soft">{fmtDate(invoice.date)}</div>
        </div>
      </div>
      <div className="mb-4 border-y border-border py-2.5">
        <div className="text-[11.5px] text-text-soft">Billed to</div>
        <div className="font-bold">{patient?.firstName} {patient?.lastName}</div>
        <div className="text-xs text-text-soft">{patient?.mrn} \u00b7 {patient?.phone}</div>
      </div>
      <table className="mb-3.5 w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-border py-1.5 text-left text-[11.5px] text-text-soft">Service</th>
            <th className="border-b border-border py-1.5 text-right text-[11.5px] text-text-soft">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it, i) => (
            <tr key={i}><td className="py-1.5">{it.label}</td><td className="py-1.5 text-right">{fmtMoney(it.amount)}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto w-[200px]">
        <div className="flex justify-between text-[12.5px]"><span>Subtotal</span><span>{fmtMoney(invoice.subtotal)}</span></div>
        <div className="flex justify-between text-[12.5px] text-text-soft"><span>Tax</span><span>{fmtMoney(invoice.tax)}</span></div>
        <div className="mt-1.5 flex justify-between border-t border-border pt-1.5 text-[15px] font-extrabold">
          <span>Total</span><span>{fmtMoney(invoice.total)}</span>
        </div>
      </div>
      <div className="mt-5">
        <StatusBadge status={invoice.status} /> <span className="ml-2 text-xs text-text-soft">Paid via {invoice.method}</span>
      </div>
    </div>
  );
}
