import { useMemo, useState } from "react";
import Dashboard from "./views/Dashboard";
import Purchasing from "./views/Purchasing";
import Inventory from "./views/Inventory";
import Expenses from "./views/Expenses";
import Financials from "./views/Financials";
import { NotificationBell, ToastProvider, type Alert } from "./components/notifications";
import { products, purchaseOrders, suppliers } from "./data/sampleData";
import { isLowStock, profitAndLoss, taka } from "./lib/finance";

type View = "dashboard" | "purchasing" | "inventory" | "expenses" | "financials";

const nav: { id: View; label: string; icon: string; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10", group: "Overview" },
  { id: "purchasing", label: "Purchasing", icon: "M6 6h15l-1.5 9h-12zM6 6L5 3H2m4 3l1 12m11-3a2 2 0 100 4 2 2 0 000-4zM9 20a2 2 0 100 4 2 2 0 000-4z", group: "Operations" },
  { id: "inventory", label: "Inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4", group: "Operations" },
  { id: "expenses", label: "Expenses", icon: "M12 8v8m-3-5h6M4 4h16v16H4z", group: "Finance" },
  { id: "financials", label: "Profit & Loss", icon: "M4 20V4m0 16h16M8 16l3-4 3 2 4-6", group: "Finance" },
];

const viewMeta: Record<View, { title: string; sub: string }> = {
  dashboard: { title: "Dashboard", sub: "Business overview" },
  purchasing: { title: "Purchasing", sub: "Orders & landed cost" },
  inventory: { title: "Inventory", sub: "Stock & valuation" },
  expenses: { title: "Expenses", sub: "Operating costs" },
  financials: { title: "Profit & Loss", sub: "Financial summary" },
};

function buildAlerts(): Alert[] {
  const alerts: Alert[] = [];
  for (const p of products.filter(isLowStock)) {
    alerts.push({
      id: "low-" + p.id,
      title: `Low stock: ${p.name}`,
      detail: `${p.stockQty} left · reorder at ${p.reorderLevel}`,
      time: "Today",
      tone: "warn",
    });
  }
  for (const po of purchaseOrders.filter((p) => p.status !== "Received")) {
    const s = suppliers.find((x) => x.id === po.supplierId)?.name ?? "";
    alerts.push({
      id: "po-" + po.id,
      title: `${po.id} ${po.status.toLowerCase()}`,
      detail: `${s} · placed ${po.date}`,
      time: po.date,
      tone: po.status === "In Transit" ? "info" : "success",
    });
  }
  const pl = profitAndLoss();
  alerts.push({
    id: "pl",
    title: "Net profit updated",
    detail: `${taka(pl.netProfit)} this period · ${pl.netMarginPct.toFixed(1)}% margin`,
    time: "Today",
    tone: "success",
  });
  return alerts;
}

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const alerts = useMemo(buildAlerts, []);
  const groups = [...new Set(nav.map((n) => n.group))];
  const meta = viewMeta[view];

  return (
    <ToastProvider>
      <div className="relative min-h-screen overflow-x-hidden text-ink">
        {/* Ambient background blooms */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-paper">
          <div className="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-amber-soft/40 blur-3xl" style={{ animation: "float-slow 18s ease-in-out infinite" }} />
          <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-oud/15 blur-3xl" style={{ animation: "float-slow 22s ease-in-out infinite reverse" }} />
          <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-oud-soft/15 blur-3xl" style={{ animation: "float-slow 26s ease-in-out infinite" }} />
        </div>

        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="glass-soft sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-b-0 border-l-0 border-t-0 md:flex">
            <div className="flex items-center gap-3 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-oud font-serif text-lg text-surface shadow-lg shadow-oud/30">
                A
              </div>
              <div>
                <p className="font-serif text-lg leading-none text-ink">Ateliér</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-faint">Fragrance ERP</p>
              </div>
            </div>

            <nav className="flex-1 space-y-6 px-3 py-4">
              {groups.map((group) => (
                <div key={group}>
                  <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">{group}</p>
                  <div className="space-y-1">
                    {nav.filter((n) => n.group === group).map((item) => {
                      const active = view === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setView(item.id)}
                          className={`press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                            active ? "glass font-medium text-oud shadow-sm" : "text-ink-soft hover:bg-surface-sunken/50"
                          }`}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d={item.icon} />
                          </svg>
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="px-6 py-4">
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs text-ink-soft">Fiscal period</p>
                <p className="text-sm font-medium text-ink">September 2026</p>
                <p className="mt-1 text-[11px] text-ink-faint">Demo data · BDT (৳)</p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top bar */}
            <header className="glass-soft sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 md:px-8">
              <div className="min-w-0">
                <h2 className="truncate font-serif text-xl text-ink md:text-2xl">{meta.title}</h2>
                <p className="truncate text-xs text-ink-faint">{meta.sub}</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="glass-soft hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm text-ink-faint lg:flex">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                  <span>Search orders, products…</span>
                </div>
                <NotificationBell alerts={alerts} />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-oud-soft font-medium text-surface">FM</div>
              </div>
            </header>

            <main className="flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10">
              <div key={view} className="mx-auto max-w-6xl" style={{ animation: "var(--animate-fade-up)" }}>
                {view === "dashboard" && <Dashboard />}
                {view === "purchasing" && <Purchasing />}
                {view === "inventory" && <Inventory />}
                {view === "expenses" && <Expenses />}
                {view === "financials" && <Financials />}
              </div>
            </main>
          </div>
        </div>

        {/* iPhone-style bottom tab bar */}
        <nav className="glass fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-3xl px-2 py-2 md:hidden" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
          {nav.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`press flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] ${
                  active ? "text-oud" : "text-ink-faint"
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${active ? "bg-oud/12" : ""}`}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </span>
                {item.label === "Profit & Loss" ? "P&L" : item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
