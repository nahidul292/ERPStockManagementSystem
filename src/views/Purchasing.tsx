import { useState } from "react";
import { SectionCard, CardHeader, Badge, PageHeader, StatCard } from "../components/ui";
import { useToast } from "../components/notifications";
import { purchaseOrders, suppliers } from "../data/sampleData";
import {
  taka,
  poGoodsTotal,
  poMiscTotal,
  poTotal,
  landedLines,
  findProduct,
} from "../lib/finance";

export default function Purchasing() {
  const { notify } = useToast();
  const [selected, setSelected] = useState(purchaseOrders[0].id);
  const po = purchaseOrders.find((p) => p.id === selected)!;
  const supplier = suppliers.find((s) => s.id === po.supplierId)!;
  const lines = landedLines(po);
  const goods = poGoodsTotal(po);
  const misc = poMiscTotal(po);

  return (
    <div>
      <PageHeader
        eyebrow="Procurement"
        title="Purchasing & Landed Cost"
        description="Every purchase order carries hidden costs — freight, customs, clearing. Here we spread those across units to reveal the true landed cost of each bottle."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* PO list */}
        <SectionCard className="h-fit">
          <CardHeader title="Purchase Orders" subtitle={`${purchaseOrders.length} orders`} />
          <div className="divide-y divide-line">
            {purchaseOrders.map((p) => {
              const active = p.id === selected;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelected(p.id);
                    notify({
                      title: `${p.id} opened`,
                      body: "Landed cost recalculated across units.",
                      tone: "info",
                    });
                  }}
                  className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors ${
                    active ? "bg-surface-sunken" : "hover:bg-surface-sunken/50"
                  }`}
                >
                  <div>
                    <span className="tabular text-sm font-medium text-ink">{p.id}</span>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {suppliers.find((s) => s.id === p.supplierId)?.name}
                    </p>
                  </div>
                  <Badge tone={p.status === "Received" ? "positive" : p.status === "In Transit" ? "warn" : "info"}>
                    {p.status}
                  </Badge>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* PO detail */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Goods Value" value={taka(goods)} />
            <StatCard label="Landed Costs" value={taka(misc)} hint="Freight, duty, handling" tone="accent" />
            <StatCard label="Order Total" value={taka(poTotal(po))} />
            <StatCard
              label="Cost Uplift"
              value={goods > 0 ? ((misc / goods) * 100).toFixed(1) + "%" : "—"}
              hint="Over base supplier cost"
            />
          </div>

          <SectionCard>
            <CardHeader
              title={`${po.id} · ${supplier.name}`}
              subtitle={`${supplier.origin} · ${po.date} · Terms: ${supplier.terms}`}
            />

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 text-right font-semibold">Qty</th>
                    <th className="px-3 py-3 text-right font-semibold">Base / Unit</th>
                    <th className="px-3 py-3 text-right font-semibold">Base Total</th>
                    <th className="px-3 py-3 text-right font-semibold">+ Allocated Cost</th>
                    <th className="px-5 py-3 text-right font-semibold text-oud">Landed / Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {lines.map((l) => {
                    const p = findProduct(l.productId);
                    return (
                      <tr key={l.productId} className="hover:bg-surface-sunken/40">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-ink">{p?.name}</p>
                          <p className="text-xs text-ink-faint">{p?.brand} · {p?.size}</p>
                        </td>
                        <td className="tabular px-3 py-3.5 text-right text-ink-soft">{l.qty}</td>
                        <td className="tabular px-3 py-3.5 text-right text-ink-soft">{taka(l.unitCost)}</td>
                        <td className="tabular px-3 py-3.5 text-right text-ink-soft">{taka(l.baseTotal)}</td>
                        <td className="tabular px-3 py-3.5 text-right text-warn">{taka(l.allocatedMisc)}</td>
                        <td className="tabular px-5 py-3.5 text-right font-semibold text-oud">{taka(l.landedUnitCost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Misc cost breakdown */}
            <div className="border-t border-line px-5 py-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Miscellaneous costs allocated across units (by goods value)
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {po.miscCosts.map((m) => (
                  <div key={m.label} className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-2">
                    <div>
                      <span className="text-sm text-ink">{m.label}</span>
                      <span className="ml-2 text-[11px] text-ink-faint">{m.kind}</span>
                    </div>
                    <span className="tabular text-sm text-ink">{taka(m.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm">
                <span className="font-medium text-ink">Total allocated</span>
                <span className="tabular font-semibold text-ink">{taka(misc)}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
