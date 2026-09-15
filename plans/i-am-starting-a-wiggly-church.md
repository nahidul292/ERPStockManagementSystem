# Perfume ERP — Stock & Financial Management (Demo)

## Context

The user is launching an online perfume/fragrance retail business in Bangladesh. They need
an ERP-style app to manage the money side of the business: purchase orders, true purchasing
cost (including miscellaneous/import costs), stock, expenses, and profit calculations.

This build is a **design-forward demo with realistic sample data** (no backend, no auth,
no persistence — confirmed with the user). The goal is to show a complete, credible ERP
interface with correct financial math that the user can evaluate and later back with a real
database. Currency is **Bangladeshi Taka (৳ / BDT)**.

Priority modules (confirmed with user):
1. **Purchasing + landed cost** — POs, supplier cost, shipping/customs/misc costs → true cost per unit
2. **Inventory / stock** — products, variants, stock levels, valuation
3. **Expenses + financial summary** — operating costs, P&L overview

A **Dashboard** ties these together. Sales exists as a lighter module feeding profit numbers.

## Approach

Single-page React app (Vite + Tailwind v4 scaffold) with client-side view routing via
component state (no react-router needed for a demo of this size). All data lives in typed
in-memory sample datasets. Financial figures are **derived** from that data through pure
calculation functions so the numbers are internally consistent across every screen.

### Aesthetic direction
Invoke the `make:aesthetic-stance` skill before writing code and call `create_make_theme`
(full-page brief). Target a **refined, editorial "quiet luxury" admin** feel appropriate to
a fragrance brand: warm neutral paper/ivory surfaces, a deep accent (amber/oud-inspired or
ink), restrained serif display for headings paired with a clean sans for data, generous
spacing, and understated data-table styling. Avoid a generic blue SaaS look. All tokens go
in `src/index.css` (Tailwind v4 `@theme`); fonts via Google Fonts `@import` at top of
`src/index.css`.

### File structure
- `src/App.tsx` — app shell: sidebar nav + active-view switch, currency/format context
- `src/index.css` — Tailwind import, font `@import`, `@theme` tokens, base styles
- `src/data/sampleData.ts` — typed sample data: suppliers, products/variants, purchase
  orders (with line items + landed-cost allocations), expenses, sales
- `src/lib/finance.ts` — pure functions: landed cost allocation, cost-per-unit,
  inventory valuation, gross profit, net profit, margins, P&L rollup, currency formatter (৳)
- `src/lib/types.ts` — shared TypeScript types
- `src/components/` — layout + UI primitives (Sidebar, TopBar, StatCard, DataTable, Badge,
  SectionCard, PageHeader) and one component file per module view

### Modules / views
1. **Dashboard** — KPI stat row (inventory value, revenue, gross profit, net profit, margin %),
   recent POs, low-stock alerts, expense-vs-profit summary. Follow `dataviz` skill for any charts.
2. **Purchasing** — PO list + PO detail showing line items, base cost, then allocated
   landed costs (shipping, customs/duty, misc) distributed across units → **true cost/unit**.
   Include a supplier list. Landed-cost allocation is the core calculation to get right.
3. **Inventory** — product/variant table with stock qty, avg cost, retail price, stock value,
   margin per item, low-stock badges.
4. **Expenses** — operating expense list by category (marketing, packaging, delivery, rent,
   salaries, platform fees) with period totals.
5. **Financials (P&L)** — revenue → COGS → gross profit → operating expenses → net profit,
   with gross/net margin %. All numbers derived from the same source data.

### Key calculations (in `src/lib/finance.ts`)
- **Landed cost per unit** = (line base cost + allocated share of PO-level misc costs) / qty,
  where misc costs (shipping, customs, handling) are allocated across lines by value or qty.
- **Inventory valuation** = Σ(stock qty × unit cost).
- **Gross profit** = revenue − COGS; **Gross margin** = gross profit / revenue.
- **Net profit** = gross profit − operating expenses; **Net margin** = net profit / revenue.
- Central **BDT formatter** used everywhere for consistent ৳ display.

## Verification
- Dev server is already running on `$PORT`; confirm the app loads and each nav view renders.
- Spot-check that a PO's allocated landed costs sum back to the PO misc total, and that
  Dashboard/Financials KPIs match values derived on their own detail screens (no divergent numbers).
- Confirm ৳/BDT formatting is consistent and headings/data fonts load correctly.
- Only run a build/typecheck if a real error surfaces.
