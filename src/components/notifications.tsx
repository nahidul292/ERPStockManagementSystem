import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastTone = "info" | "success" | "warn";
interface Toast {
  id: number;
  title: string;
  body?: string;
  tone: ToastTone;
}

interface ToastApi {
  notify: (t: { title: string; body?: string; tone?: ToastTone }) => void;
}

const ToastCtx = createContext<ToastApi>({ notify: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback<ToastApi["notify"]>((t) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tone: "info", ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass pointer-events-auto w-full max-w-sm rounded-2xl px-4 py-3"
            style={{ animation: "var(--animate-toast-in)" }}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  t.tone === "success" ? "bg-positive" : t.tone === "warn" ? "bg-warn" : "bg-oud"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{t.title}</p>
                {t.body && <p className="mt-0.5 text-xs text-ink-soft">{t.body}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export interface Alert {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: ToastTone;
}

export function NotificationBell({ alerts }: { alerts: Alert[] }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const unread = seen ? 0 : alerts.length;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          setSeen(true);
        }}
        className="press glass-soft relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-ink"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="glass absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl"
            style={{ animation: "var(--animate-scale-in)", transformOrigin: "top right" }}
          >
            <div className="border-b border-line/60 px-4 py-3">
              <p className="font-serif text-base text-ink">Notifications</p>
              <p className="text-xs text-ink-faint">{alerts.length} active alerts</p>
            </div>
            <div className="max-h-80 divide-y divide-line/50 overflow-y-auto">
              {alerts.map((a) => (
                <div key={a.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-surface-sunken/40">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      a.tone === "success" ? "bg-positive" : a.tone === "warn" ? "bg-warn" : "bg-oud"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-ink-soft">{a.detail}</p>
                    <p className="mt-0.5 text-[11px] text-ink-faint">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
