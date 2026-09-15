import { useState } from "react";
import { SectionCard, CardHeader, Badge, PageHeader, StatCard } from "../components/ui";
import { useToast } from "../components/notifications";
import { products } from "../data/sampleData";
import {
  taka,
  percent,
  stockValue,
  retailStockValue,
  unitMargin,
  unitMarginPct,
  isLowStock,
  totalInventoryValue,
} from "../lib/finance";

const categories = ["All", "Eau de Parfum", "Attar / Oil", "Body Mist", "Gift Set"] as const;

export default function Inventory() {
  const { notify } = useToast();
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const rows = products.filter((p) => filter === "All" || p.category === filter);

  const totalUnits = products.reduce((s, p) => s + p.stockQty, 0);
  const potentialRevenue = products.reduce((s, p) => s + retailStockValue(p), 0);
  const invValue = totalInventoryValue();

  return (
    <div>
      <PageHeader
        eyebrow="Stock"
        title="Inventory & Valuation"
        description="Live stock levels valued at weighted landed cost, with per-item margins and retail potential. Items at or below their reorder level are flagged."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Stock Value (Cost)" value={taka(invValue)} tone="accent" />
        <StatCard label="Retail Potential" value={taka(potentialRevenue)} hint="If sold at list price" />
        <StatCard label="Units in Stock" value={totalUnits.toLocaleString("en-IN")} />
        <StatCard
          label="Unrealized Margin"
          value={taka(potentialRevenue - invValue)}
          hint={`${percent(((potentialRevenue - invValue) / potentialRevenue) * 100)} of retail`}
          tone="positive"
        />
      </div>

      <SectionCard className="mt-6">
        <CardHeader
          title="Product Catalogue"
          subtitle={`${rows.length} of ${products.length} products`}
          right={
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setFilter(c);
                    const count = products.filter((p) => c === "All" || p.category === c).length;
                    notify({ title: c === "All" ? "Showing all products" : c, body: `${count} products in view.`, tone: "info" });
                  }}
                  className={`press rounded-full border px-3 py-1 text-xs ${
                    filter === c
                      ? "border-oud bg-oud text-surface"
                      : "border-line-strong text-ink-soft hover:bg-surface-sunken"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-faint">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">SKU</th>
                <th className="px-3 py-3 text-right font-semibold">Stock</th>
                <th className="px-3 py-3 text-right font-semibold">Unit Cost</th>
                <th className="px-3 py-3 text-right font-semibold">Retail</th>
                <th className="px-3 py-3 text-right font-semibold">Margin</th>
                <th className="px-5 py-3 text-right font-semibold">Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-surface-sunken/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-ink-faint">
                      {p.brand} · {p.category} · {p.size}
                    </p>
                  </td>
                  <td className="tabular px-3 py-3.5 text-xs text-ink-faint">{p.sku}</td>
                  <td className="px-3 py-3.5 text-right">
                    {isLowStock(p) ? (
                      <Badge tone="warn">{p.stockQty} low</Badge>
                    ) : (
                      <span className="tabular text-ink-soft">{p.stockQty}</span>
                    )}
                  </td>
                  <td className="tabular px-3 py-3.5 text-right text-ink-soft">{taka(p.avgUnitCost)}</td>
                  <td className="tabular px-3 py-3.5 text-right text-ink">{taka(p.retailPrice)}</td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="tabular text-positive">{taka(unitMargin(p))}</span>
                    <span className="ml-1 text-xs text-ink-faint">{percent(unitMarginPct(p))}</span>
                  </td>
                  <td className="tabular px-5 py-3.5 text-right font-medium text-ink">{taka(stockValue(p))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
