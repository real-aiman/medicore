import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { uid } from "../utils/helpers";

export type ToastTone = "success" | "warning" | "error";
interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

type PushToast = (message: string, tone?: ToastTone) => void;
const ToastCtx = createContext<PushToast | null>(null);

const BORDER_TONE: Record<ToastTone, string> = {
  error: "border-l-red",
  warning: "border-l-amber",
  success: "border-l-green",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback<PushToast>((message, tone = "success") => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="no-print fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "mc-pop flex min-w-[260px] max-w-[340px] items-center gap-2.5 rounded-lg border border-border border-l-[3px] bg-surface px-4 py-3 text-[13.5px] text-text shadow-md",
              BORDER_TONE[t.tone]
            )}
          >
            {t.tone === "error" ? (
              <XCircle size={16} className="text-red" />
            ) : t.tone === "warning" ? (
              <AlertTriangle size={16} className="text-amber" />
            ) : (
              <CheckCircle2 size={16} className="text-green" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx) as PushToast;
