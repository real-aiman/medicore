import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice, Patient, HospitalSettings } from "../types";
import { fmtDate, fmtMoney } from "./helpers";

const NAVY: [number, number, number] = [15, 42, 67];
const SLATE: [number, number, number] = [91, 107, 124];
const BORDER: [number, number, number] = [228, 233, 238];

/**
 * Builds a proper A4 invoice PDF from structured data (header, billed-to
 * block, line-item table, totals) rather than rasterizing the on-screen
 * modal, so the output stays crisp and text-selectable at any zoom level.
 */
export function downloadInvoicePdf(invoice: Invoice, patient: Patient | undefined, settings: HospitalSettings) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text(settings.hospitalName, margin, 64);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(settings.address, margin, 80);
  doc.text(`${settings.phone} \u00b7 ${settings.email}`, margin, 93);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text("INVOICE", pageWidth - margin, 64, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(invoice.id, pageWidth - margin, 80, { align: "right" });
  doc.text(fmtDate(invoice.date), pageWidth - margin, 93, { align: "right" });

  doc.setDrawColor(...BORDER);
  doc.line(margin, 110, pageWidth - margin, 110);

  // Billed-to block
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  doc.text("BILLED TO", margin, 132);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 30, 40);
  doc.text(patient ? `${patient.firstName} ${patient.lastName}` : "\u2014", margin, 148);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(`${patient?.mrn ?? ""} \u00b7 ${patient?.phone ?? ""}`, margin, 161);

  doc.line(margin, 176, pageWidth - margin, 176);

  // Line items table
  autoTable(doc, {
    startY: 192,
    margin: { left: margin, right: margin },
    head: [["Service", "Amount"]],
    body: invoice.items.map((it) => [it.label, fmtMoney(it.amount)]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 10, textColor: [22, 35, 47], cellPadding: { top: 6, bottom: 6, left: 0, right: 0 } },
    headStyles: { fontStyle: "bold", textColor: SLATE, fontSize: 8.5 },
    columnStyles: { 1: { halign: "right" } },
    didParseCell: (data) => {
      if (data.section === "head") data.cell.styles.fillColor = false as unknown as [number, number, number];
    },
  });

  // @ts-expect-error - lastAutoTable is added at runtime by jspdf-autotable
  const afterTableY: number = doc.lastAutoTable?.finalY ?? 220;
  let y = afterTableY + 20;
  const totalsX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setTextColor(...SLATE);
  doc.text("Subtotal", totalsX - 140, y);
  doc.setTextColor(20, 30, 40);
  doc.text(fmtMoney(invoice.subtotal), totalsX, y, { align: "right" });
  y += 16;

  doc.setTextColor(...SLATE);
  doc.text("Tax", totalsX - 140, y);
  doc.text(fmtMoney(invoice.tax), totalsX, y, { align: "right" });
  y += 6;

  doc.setDrawColor(...BORDER);
  doc.line(totalsX - 140, y + 6, totalsX, y + 6);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  doc.text("Total", totalsX - 140, y);
  doc.text(fmtMoney(invoice.total), totalsX, y, { align: "right" });

  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(`Status: ${invoice.status} \u00b7 Paid via ${invoice.method}`, margin, y);

  doc.save(`${invoice.id}.pdf`);
}

/**
 * One-page PDF summary of a patient's record: demographics, care team,
 * allergies/conditions, and a short visit/appointment history table.
 */
export function downloadPatientSummaryPdf(
  patient: Patient,
  doctorName: string,
  appointments: { date: string; type: string; status: string }[]
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text("Patient Summary", margin, 64);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(`Generated ${fmtDate(new Date())}`, pageWidth - margin, 64, { align: "right" });

  doc.setDrawColor(...BORDER);
  doc.line(margin, 80, pageWidth - margin, 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 30, 40);
  doc.text(`${patient.firstName} ${patient.lastName}`, margin, 104);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(`${patient.mrn} \u00b7 ${patient.gender} \u00b7 Blood group ${patient.bloodGroup}`, margin, 118);

  autoTable(doc, {
    startY: 138,
    margin: { left: margin, right: margin },
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 4 },
    body: [
      ["Phone", patient.phone], ["Email", patient.email || "\u2014"], ["Address", patient.address || "\u2014"],
      ["Department", patient.department], ["Primary Doctor", doctorName],
      ["Allergies", patient.allergies], ["Conditions", patient.conditions], ["Insurance", patient.insurance],
    ],
    columnStyles: { 0: { fontStyle: "bold", textColor: SLATE, cellWidth: 130 }, 1: { textColor: [20, 30, 40] } },
  });

  // @ts-expect-error - lastAutoTable is added at runtime by jspdf-autotable
  const afterInfoY: number = doc.lastAutoTable?.finalY ?? 260;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("Recent Appointments", margin, afterInfoY + 28);

  autoTable(doc, {
    startY: afterInfoY + 40,
    margin: { left: margin, right: margin },
    head: [["Date", "Type", "Status"]],
    body: appointments.slice(0, 10).map((a) => [fmtDate(a.date), a.type, a.status]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 5 },
    headStyles: { fontStyle: "bold", textColor: SLATE, fontSize: 8.5 },
  });

  doc.save(`${patient.mrn}-summary.pdf`);
}
