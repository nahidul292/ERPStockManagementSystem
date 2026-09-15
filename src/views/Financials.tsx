import { SectionCard, CardHeader, PageHeader, StatCard } from "../components/ui";
import { sales } from "../data/sampleData";
import {
  taka,
  percent,
  profitAndLoss,
  saleRevenue,
  saleCogs,
  unitsSold,
  expensesByCategory,
} from "../lib/finance";

export default function Financials() {
  const pl = profitAndLoss();
  const units = unitsSold();
  const orders = sales.length;
  const aov = orders > 0 ? pl.revenue / orders : 0;
  const expCats = expensesByCategory();

  const statement: { label: string; value: number; kind: "line" | "subtotal" | "total"; note?: string }[] = [
    { label: "Revenue", value: pl.revenue, kind: "line", note: `${orders} orders · ${units} units` },
    { label: "Less: Cost of Goods Sold", value: -pl.cogs, kind: "line", note: "At weighted landed cost" },
    { label: "Gross Profit", value: pl.grossProfit, kind: "subtotal", note: `${percent(pl.grossMarginPct)} gross margin` },
    { label: "Less: Operating Expenses", value: -pl.operatingExpenses, kind: "line", note: `${expCats.length} categories` },
    { label: "Net Profit", value: pl.netProfit, kind: "total", note: `${percent(pl.netMarginPct)} net margin` },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Financial Summary"
        title="Profit & Loss"
        description="The full picture: revenue earned, the cost of goods sold, and operating expenses — resolving to gross and net profit for the period."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Revenue" value={taka(pl.revenue)} />
        <StatCard label="Gross Profit" value={taka(pl.grossProfit)} hint={percent(pl.grossMarginPct)} tone="positive" />
        <StatCard label="Net Profit" value={taka(pl.netProfit)} hint={percent(pl.netMarginPct)} tone={pl.netProfit >= 0 ? "positive" : "negative"} />
        <StatCard label="Avg. Order Value" value={taka(aov)} hint={`${orders} orders`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <SectionCard>
          <CardHeader title="Income Statement" subtitle="Current period" />
          <div className="px-5 py-2">
            {statement.map((row) => {
              const isNeg = row.value < 0;
              const emphasized = row.kind !== "line";
              return (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-3.5 ${
                    row.kind === "subtotal" ? "border-t border-line" : ""
                  } ${row.kind === "total" ? "mt-1 border-t-2 border-line-strong" : ""}`}
                >
                  <div>
                    <p className={`${emphasized ? "font-serif text-lg text-ink" : "text-sm text-ink-soft"}`}>
                      {row.label}
                    </p>
                    {row.note && <p className="text-xs text-ink-faint">{row.note}</p>}
                  </div>
                  <span
                    className={`tabular ${row.kind === "total" ? "text-xl font-semibold" : emphasized ? "text-lg font-medium" : "text-sm"} ${
                      row.kind === "total"
                        ? row.value >= 0
                          ? "text-positive"
                          : "text-negative"
                        : isNeg
                          ? "text-negative"
                          : "text-ink"
                    }`}
                  >
                    {isNeg ? "(" + taka(-row.value) + ")" : taka(row.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard className="h-fit">
          <CardHeader title="Sales by Order" subtitle="Revenue, cost and profit per order" />
          <div className="divide-y divide-line">
            {[...sales]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((s) => {
                const rev = saleRevenue(s);
                const cogs = saleCogs(s);
                const gp = rev - cogs;
                return (
                  <div key={s.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="tabular text-sm font-medium text-ink">{s.id}</span>
                        <span className="ml-2 text-xs text-ink-faint">{s.channel}</span>
                      </div>
                      <span className="tabular text-sm text-ink">{taka(rev)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-ink-faint">
                      <span>{s.date}</span>
                      <span className="tabular text-positive">+{taka(gp)} profit</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
