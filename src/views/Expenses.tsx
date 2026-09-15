import { SectionCard, CardHeader, PageHeader, StatCard } from "../components/ui";
import { expenses } from "../data/sampleData";
import { taka, expensesByCategory, totalOperatingExpenses } from "../lib/finance";

export default function Expenses() {
  const total = totalOperatingExpenses();
  const byCat = expensesByCategory();
  const rows = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
  const largest = byCat[0];

  return (
    <div>
      <PageHeader
        eyebrow="Operating Costs"
        title="Expenses"
        description="Everything it costs to run the business beyond buying stock — marketing, delivery, salaries, platform fees and more. These feed directly into net profit."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Expenses" value={taka(total)} tone="negative" />
        <StatCard label="Largest Category" value={largest.category} hint={taka(largest.amount)} />
        <StatCard label="Categories" value={String(byCat.length)} />
        <StatCard label="Line Items" value={String(expenses.length)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <SectionCard>
          <CardHeader title="Expense Ledger" subtitle="This period, most recent first" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-faint">
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((e) => (
                  <tr key={e.id} className="hover:bg-surface-sunken/40">
                    <td className="tabular px-5 py-3.5 text-xs text-ink-faint">{e.date}</td>
                    <td className="px-3 py-3.5 text-ink">{e.category}</td>
                    <td className="px-3 py-3.5 text-ink-soft">{e.vendor}</td>
                    <td className="tabular px-5 py-3.5 text-right font-medium text-ink">{taka(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line-strong">
                  <td colSpan={3} className="px-5 py-3.5 font-medium text-ink">Total operating expenses</td>
                  <td className="tabular px-5 py-3.5 text-right font-semibold text-ink">{taka(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>

        <SectionCard className="h-fit">
          <CardHeader title="By Category" subtitle="Share of operating spend" />
          <div className="space-y-4 px-5 py-5">
            {byCat.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{c.category}</span>
                  <span className="tabular text-ink">{((c.amount / total) * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full rounded-full bg-oud-soft" style={{ width: `${(c.amount / byCat[0].amount) * 100}%` }} />
                </div>
                <p className="tabular mt-1 text-xs text-ink-faint">{taka(c.amount)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
