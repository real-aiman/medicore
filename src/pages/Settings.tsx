import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Sun, Moon } from "lucide-react";
import { useStore } from "../store/hospitalStore";
import { useToast } from "../store/uiStore";
import { Card, SectionHeader, Field, TextInput, Select, Btn } from "../components/ui";
import type { HospitalSettings } from "../types";

interface SettingsProps {
  dark: boolean;
  setDark: (v: boolean) => void;
}
export default function Settings({ dark, setDark }: SettingsProps) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [form, setForm] = useState<HospitalSettings>(state.settings);
  useEffect(() => setForm(state.settings), [state.settings]);
  const set = (k: keyof HospitalSettings, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => { dispatch({ type: "UPDATE_SETTINGS", payload: form }); toast("Settings saved"); };

  return (
    <div className="mc-fade-in animate-fade-in max-w-[720px]">
      <SectionHeader title="Settings" subtitle="Manage hospital and account preferences" />
      <Card className="mb-3.5 p-4.5">
        <SectionHeader title="Hospital" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hospital Name" span={2}><TextInput value={form.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} /></Field>
          <Field label="Address" span={2}><TextInput value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="Phone"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Email"><TextInput value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        </div>
      </Card>
      <Card className="mb-3.5 p-4.5">
        <SectionHeader title="Appearance" />
        <div className="flex flex-wrap gap-5">
          <Field label="Theme">
            <div className="flex gap-1 rounded-md bg-slate-100 p-0.5">
              <button
                onClick={() => setDark(false)}
                className={clsx("flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-bold", !dark ? "bg-surface text-text shadow-sm" : "bg-transparent text-text-soft")}
              >
                <Sun size={13} /> Light
              </button>
              <button
                onClick={() => setDark(true)}
                className={clsx("flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-bold", dark ? "bg-surface text-text shadow-sm" : "bg-transparent text-text-soft")}
              >
                <Moon size={13} /> Dark
              </button>
            </div>
          </Field>
          <Field label="Accent Color">
            <div className="flex gap-2">
              {[{ k: "blue", c: "#2563A8" }, { k: "teal", c: "#0E8F82" }, { k: "navy", c: "#0F2A43" }].map((a) => (
                <button
                  key={a.k} onClick={() => set("accent", a.k)} aria-label={a.k}
                  className={clsx("h-6.5 w-6.5 rounded-full border-2", form.accent === a.k ? "border-text" : "border-transparent")}
                  style={{ background: a.c }}
                />
              ))}
            </div>
          </Field>
        </div>
      </Card>
      <Card className="mb-3.5 p-4.5">
        <SectionHeader title="Notifications" />
        {[{ k: "apptNotifications", label: "Appointment notifications" }, { k: "lowStockAlerts", label: "Low-stock alerts" }, { k: "billingAlerts", label: "Billing alerts" }].map((n) => (
          <label key={n.k} className="flex cursor-pointer items-center justify-between border-b border-border py-2.5 text-[13.5px]">
            {n.label}
            <input
              type="checkbox" checked={Boolean(form[n.k as keyof HospitalSettings])}
              onChange={(e) => set(n.k as keyof HospitalSettings, e.target.checked)} className="h-4 w-4"
            />
          </label>
        ))}
      </Card>
      <Card className="mb-3.5 p-4.5">
        <SectionHeader title="Preferences" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date Format">
            <Select value={form.dateFormat} onChange={(e) => set("dateFormat", e.target.value)}>
              <option>MMM D, YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option>
            </Select>
          </Field>
          <Field label="Time Format">
            <Select value={form.timeFormat} onChange={(e) => set("timeFormat", e.target.value)}>
              <option value="12h">12-hour</option><option value="24h">24-hour</option>
            </Select>
          </Field>
        </div>
      </Card>
      <div className="flex justify-end"><Btn onClick={save}>Save Settings</Btn></div>
    </div>
  );
}
