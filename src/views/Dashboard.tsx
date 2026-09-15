import { SectionCard, CardHeader, StatCard, Badge, PageHeader } from "../components/ui";
import { products, purchaseOrders, suppliers } from "../data/sampleData";
import {
  taka,
  percent,
  profitAndLoss,
  totalInventoryValue,
  isLowStock,
  poTotal,
  expensesByCategory,
  totalOperatingExpenses,
} from "../lib/finance";

export default function Dashboard() {
  const pl = profitAndLoss();
  const invValue = totalInventoryValue();
  const lowStock = products.filter(isLowStock);
  const recentPOs = [...purchaseOrders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const expCats = expensesByCategory();
  const expTotal = totalOperatingExpenses();
  const supplierName = (id: string) => suppliers.find((s) => s.id === id)?.name ?? id;

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Business Dashboard"
        description="A live read on stock value, sales performance, and profitability for Ateliér — your fragrance house. All figures in Bangladeshi Taka."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Inventory Value" value={taka(invValue)} hint="At weighted landed cost" tone="accent" />
        <StatCard label="Revenue (MTD)" value={taka(pl.revenue)} hint="Across all channels" />
        <StatCard
          label="Gross Profit"
          value={taka(pl.grossProfit)}
          hint={`${percent(pl.grossMarginPct)} gross margin`}
          tone="positive"
        />
        <StatCard
          label="Net Profit"
          value={taka(pl.netProfit)}
          hint={`${percent(pl.netMarginPct)} net margin`}
          tone={pl.netProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* P&L waterfall */}
        <SectionCard className="lg:col-span-2">
          <CardHeader title="Profit Breakdown" subtitle="From revenue to net profit, this period" />
          <div className="space-y-3 px-5 py-5">
            <PnlBar label="Revenue" value={pl.revenue} max={pl.revenue} color="var(--color-oud)" />
            <PnlBar label="Cost of Goods Sold" value={pl.cogs} max={pl.revenue} color="var(--color-line-strong)" />
            <PnlBar label="Gross Profit" value={pl.grossProfit} max={pl.revenue} color="var(--color-positive)" />
            <PnlBar label="Operating Expenses" value={pl.operatingExpenses} max={pl.revenue} color="var(--color-negative)" />
            <div className="border-t border-line pt-3">
              <PnlBar label="Net Profit" value={pl.netProfit} max={pl.revenue} color="var(--color-amber)" bold />
            </div>
          </div>
        </SectionCard>

        {/* Expense mix */}
        <SectionCard>
          <CardHeader title="Expense Mix" subtitle={`${taka(expTotal)} operating spend`} />
          <div className="space-y-3 px-5 py-5">
            {expCats.map((e) => (
              <div key={e.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{e.category}</span>
                  <span className="tabular text-ink">{taka(e.amount)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-full rounded-full bg-oud-soft"
                    style={{ width: `${(e.amount / expCats[0].amount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent POs */}
        <SectionCard className="lg:col-span-2">
          <CardHeader title="Recent Purchase Orders" subtitle="Latest procurement activity" />
          <div className="divide-y divide-line">
            {recentPOs.map((po) => (
              <div key={po.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-sm font-medium text-ink">{po.id}</span>
                    <Badge tone={po.status === "Received" ? "positive" : po.status === "In Transit" ? "warn" : "info"}>
                      {po.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {supplierName(po.supplierId)} · {po.date}
                  </p>
                </div>
                <span className="tabular text-sm font-medium text-ink">{taka(poTotal(po))}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Low stock */}
        <SectionCard>
          <CardHeader title="Reorder Alerts" subtitle={`${lowStock.length} items at or below reorder level`} />
          <div className="divide-y divide-line">
            {lowStock.length === 0 && (
              <p className="px-5 py-6 text-sm text-ink-faint">All products are above reorder level.</p>
            )}
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-ink">{p.name}</p>
                  <p className="text-xs text-ink-faint">
                    {p.brand} · {p.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tabular text-sm font-semibold text-negative">{p.stockQty} left</p>
                  <p className="text-xs text-ink-faint">reorder at {p.reorderLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function PnlBar({
  label,
  value,
  max,
  color,
  bold,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  bold?: boolean;
}) {
  const width = max > 0 ? Math.min(100, (Math.abs(value) / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className={bold ? "font-medium text-ink" : "text-ink-soft"}>{label}</span>
        <span className={`tabular ${bold ? "font-semibold" : ""} text-ink`}>{taka(value)}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}
