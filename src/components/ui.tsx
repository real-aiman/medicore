import React, { ReactNode, useEffect, useMemo, useState, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, AlertTriangle, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { initials } from "../utils/helpers";
import clsx from "clsx";

/* ---------------- Badge / status ---------------- */
export type Tone = "green" | "amber" | "red" | "blue" | "slate";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-bg text-green",
  amber: "bg-amber-bg text-amber",
  red: "bg-red-bg text-red",
  blue: "bg-blue-light text-blue",
  slate: "bg-slate-100 text-text-soft",
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}
export function Badge({ tone = "slate", children }: BadgeProps) {
  return (
    <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", TONE_CLASSES[tone])}>
      {children}
    </span>
  );
}

export const STATUS_TONE: Record<string, Tone> = {
  Active: "green", Available: "green", "In Stock": "green", Paid: "green", Completed: "green", Confirmed: "green", Operational: "green",
  Waiting: "amber", Pending: "amber", "Low Stock": "amber", Reserved: "amber", Cleaning: "amber", Processing: "amber", Scheduled: "blue", "In Consultation": "blue",
  Cancelled: "red", Overdue: "red", Expired: "red", "Out of Stock": "red", Occupied: "red", Inactive: "slate", Maintenance: "slate", "On Leave": "amber", "Off Duty": "slate",
};
export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] || "slate"}>{status}</Badge>;
}

/* ---------------- Avatar ---------------- */
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const hue = useMemo(() => {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
    return h;
  }, [name]);
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: `hsl(${hue} 42% 92%)`, color: `hsl(${hue} 45% 32%)`, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
}

/* ---------------- Buttons ---------------- */
export type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "subtleDanger";
export type BtnSize = "sm" | "md";

const BTN_SIZE_CLASSES: Record<BtnSize, string> = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2.5 text-sm" };
const BTN_VARIANT_CLASSES: Record<BtnVariant, string> = {
  primary: "bg-navy text-white border border-navy",
  secondary: "bg-surface text-text border border-border",
  ghost: "bg-transparent text-text-soft border border-transparent",
  danger: "bg-red text-white border border-red",
  subtleDanger: "bg-red-bg text-red border border-transparent",
};

interface BtnProps {
  children?: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}
export function Btn({ children, variant = "primary", size = "md", icon: Icon, onClick, type = "button", disabled = false, className }: BtnProps) {
  return (
    <motion.button
      type={type} disabled={disabled} onClick={onClick} whileTap={{ scale: 0.98 }}
      className={clsx(
        "mc-focus inline-flex items-center gap-1.5 whitespace-nowrap rounded-md font-semibold",
        BTN_SIZE_CLASSES[size], BTN_VARIANT_CLASSES[variant],
        disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
        className
      )}
    >
      {Icon && <Icon size={15} />}
      {children}
    </motion.button>
  );
}

interface IconBtnProps {
  icon: LucideIcon;
  onClick?: () => void;
  label: string;
  badge?: number;
  active?: boolean;
}
export function IconBtn({ icon: Icon, onClick, label, badge = 0, active = false }: IconBtnProps) {
  return (
    <button
      aria-label={label} onClick={onClick}
      className={clsx(
        "mc-focus relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-md border text-text-soft",
        active ? "border-border bg-slate-100" : "border-transparent bg-transparent"
      )}
    >
      <Icon size={17} />
      {badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

/* ---------------- Form fields ---------------- */
interface FieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  span?: number;
  className?: string;
}
export function Field({ label, children, required, error, hint, span, className }: FieldProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", span === 2 && "col-span-2", className)}>
      <label className="text-xs font-semibold text-text-soft">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      {children}
      {hint && !error && <span className="text-[11.5px] text-text-soft">{hint}</span>}
      {error && <span className="text-[11.5px] text-red">{error}</span>}
    </div>
  );
}

const fieldBase = "mc-focus w-full rounded-md border bg-surface px-2.5 py-2 font-sans text-[13.5px] text-text";
const fieldBorder = (error?: boolean | string) => (error ? "border-red" : "border-border");

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> { error?: string }
export function TextInput({ error, className, ...rest }: TextInputProps) {
  return <input {...rest} className={clsx(fieldBase, fieldBorder(error), className)} />;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { error?: string }
export function Select({ error, children, className, ...rest }: SelectProps) {
  return <select {...rest} className={clsx(fieldBase, fieldBorder(error), className)}>{children}</select>;
}
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { error?: string }
export function TextArea({ error, className, ...rest }: TextAreaProps) {
  return <textarea {...rest} className={clsx(fieldBase, fieldBorder(error), "min-h-[70px] resize-y", className)} />;
}

/* ---------------- Layout primitives ---------------- */
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
export function Card({ children, className, onClick }: CardProps) {
  return (
    <div onClick={onClick} className={clsx("rounded-lg border border-border bg-surface shadow-sm", className)}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="m-0 text-base font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-text-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}
export function EmptyState({ icon: Icon = Info, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-5 py-12 text-center">
      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-slate-100">
        <Icon size={19} className="text-text-soft" />
      </div>
      <div className="text-sm font-bold">{title}</div>
      {subtitle && <div className="max-w-xs text-xs text-text-soft">{subtitle}</div>}
      {action}
    </div>
  );
}

export function Skeleton({ w = "100%", h = 14, r = 5 }: { w?: number | string; h?: number; r?: number }) {
  return (
    <div
      className="animate-shimmer bg-[length:400%_100%]"
      style={{
        width: w, height: h, borderRadius: r,
        backgroundImage: "linear-gradient(90deg, var(--slate-100) 25%, var(--slate-200) 37%, var(--slate-100) 63%)",
      }}
    />
  );
}

/* ---------------- Modal / dialogs (Framer Motion) ---------------- */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
  footer?: ReactNode;
}
export function Modal({ open, onClose, title, children, width = 560, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[rgba(10,20,32,0.45)] px-4 py-[5vh]"
          role="dialog" aria-modal="true" aria-label={title}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="w-full rounded-xl border border-border bg-surface shadow-md"
            style={{ maxWidth: width }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="m-0 text-[15px] font-bold">{title}</h3>
              <button onClick={onClose} aria-label="Close dialog" className="mc-focus p-1 text-text-soft">
                <X size={18} />
              </button>
            </div>
            <div className="mc-scroll max-h-[65vh] overflow-y-auto p-5">{children}</div>
            {footer && <div className="flex flex-wrap justify-end gap-2.5 border-t border-border px-5 py-3.5">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}
export function ConfirmDialog({ open, onCancel, onConfirm, title, message, confirmLabel = "Delete", danger = true }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(10,20,32,0.45)] p-4"
          role="alertdialog" aria-modal="true"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.18 }}
            className="w-full max-w-[400px] rounded-xl border border-border bg-surface p-5 shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className={clsx("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full", danger ? "bg-red-bg" : "bg-amber-bg")}>
                <AlertTriangle size={17} className={danger ? "text-red" : "text-amber"} />
              </div>
              <div>
                <div className="text-[14.5px] font-bold">{title}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-text-soft">{message}</div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
              <Btn variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Pagination ---------------- */
interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}
export function Pagination({ page, total, pageSize, onChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 py-3">
      <span className="text-xs text-text-soft">Page {page} of {pages} \u00b7 {total} results</span>
      <div className="flex gap-1.5">
        <Btn variant="secondary" size="sm" icon={ChevronLeft} disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</Btn>
        <Btn variant="secondary" size="sm" disabled={page === pages} onClick={() => onChange(page + 1)}>Next<ChevronRight size={14} /></Btn>
      </div>
    </div>
  );
}

/* ---------------- Responsive table (cards on mobile) ---------------- */
export interface TableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
}
interface ResponsiveTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
  rows: T[];
  keyField?: string;
  onRowClick?: (row: T) => void;
  mobileCard?: (row: T) => ReactNode;
  empty?: ReactNode;
}
const ALIGN_CLASSES = { left: "text-left", right: "text-right", center: "text-center" };

export function ResponsiveTable<T extends Record<string, any>>({ columns, rows, keyField = "id", onRowClick, mobileCard, empty }: ResponsiveTableProps<T>) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 720);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  if (!rows.length) return <>{empty || <EmptyState title="No records found" subtitle="Try adjusting your filters or search terms." />}</>;
  if (isMobile && mobileCard) {
    return <div className="flex flex-col gap-2">{rows.map((r) => <div key={r[keyField]}>{mobileCard(r)}</div>)}</div>;
  }
  return (
    <div className="mc-scroll overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={clsx("whitespace-nowrap border-b border-border px-3 py-2.5 text-[11.5px] font-normal uppercase tracking-wide text-text-soft", ALIGN_CLASSES[c.align || "left"])}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r[keyField]}
              className={clsx("animate-row-in hover:bg-slate-100", onRowClick ? "cursor-pointer" : "cursor-default")}
              style={{ animationDelay: `${Math.min(i, 12) * 15}ms` }}
              onClick={() => onRowClick && onRowClick(r)}
            >
              {columns.map((c) => (
                <td key={c.key} className={clsx("border-b border-border px-3 py-2.5 align-middle", ALIGN_CLASSES[c.align || "left"])}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Stat / KPI card ---------------- */
const STAT_TONE_CLASSES = { blue: "text-blue", green: "text-green", amber: "text-amber", teal: "text-teal", navy: "text-navy" };

interface StatCardProps {
  label: string;
  value: ReactNode;
  delta?: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "teal" | "navy";
  loading?: boolean;
}
export function StatCard({ label, value, delta, icon: Icon, tone = "blue", loading = false }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-soft">{label}</span>
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-slate-100">
            <Icon size={15} className={STAT_TONE_CLASSES[tone]} />
          </div>
        </div>
        {loading ? (
          <div className="mt-3"><Skeleton w={90} h={24} /></div>
        ) : (
          <div className="mt-2 text-[25px] font-extrabold tracking-tight">{value}</div>
        )}
        {!loading && delta && (
          <div className={clsx("mt-1.5 flex items-center gap-1 text-xs font-semibold", delta.startsWith("-") ? "text-red" : "text-green")}>
            {delta.startsWith("-") ? "\u2193" : "\u2191"} {delta}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

/* ---------------- Shared display row ---------------- */
interface InfoRowProps {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
}
export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2.5 border-b border-border py-1.5">
      {Icon && <Icon size={14} className="mt-0.5 text-text-soft" />}
      <div className="flex-1">
        <span className="block text-[11.5px] text-text-soft">{label}</span>
        <span className="text-[13px]">{value}</span>
      </div>
    </div>
  );
}

export function MiniStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-[11.5px] text-text-soft">{label}</div>
      <div className="text-[15px] font-bold">{value}</div>
    </div>
  );
}
