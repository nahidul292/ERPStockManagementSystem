import type {
  Product,
  PurchaseOrder,
  Expense,
  Sale,
} from "./types";
import { products, sales, expenses } from "../data/sampleData";

/** Format a BDT amount with the Taka sign. */
export function taka(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && Math.abs(amount) >= 1000) {
    return "৳" + (amount / 1000).toFixed(1) + "k";
  }
  return "৳" + Math.round(amount).toLocaleString("en-IN");
}

export function percent(value: number): string {
  return value.toFixed(1) + "%";
}

const productById = new Map(products.map((p) => [p.id, p]));
export function findProduct(id: string): Product | undefined {
  return productById.get(id);
}

// ---- Purchase order / landed cost --------------------------------------

export function poMiscTotal(po: PurchaseOrder): number {
  return po.miscCosts.reduce((s, m) => s + m.amount, 0);
}

export function poGoodsTotal(po: PurchaseOrder): number {
  return po.lines.reduce((s, l) => s + l.qty * l.unitCost, 0);
}

export function poTotal(po: PurchaseOrder): number {
  return poGoodsTotal(po) + poMiscTotal(po);
}

export interface LandedLine {
  productId: string;
  qty: number;
  unitCost: number; // base
  baseTotal: number;
  allocatedMisc: number; // share of PO misc costs, allocated by value
  landedTotal: number;
  landedUnitCost: number;
}

/**
 * Allocate PO-level miscellaneous costs (shipping, customs, handling) across
 * lines in proportion to each line's goods value, then derive the true landed
 * cost per unit. Allocations always sum back to the PO misc total.
 */
export function landedLines(po: PurchaseOrder): LandedLine[] {
  const goods = poGoodsTotal(po);
  const misc = poMiscTotal(po);
  return po.lines.map((l) => {
    const baseTotal = l.qty * l.unitCost;
    const allocatedMisc = goods > 0 ? (baseTotal / goods) * misc : 0;
    const landedTotal = baseTotal + allocatedMisc;
    return {
      productId: l.productId,
      qty: l.qty,
      unitCost: l.unitCost,
      baseTotal,
      allocatedMisc,
      landedTotal,
      landedUnitCost: l.qty > 0 ? landedTotal / l.qty : 0,
    };
  });
}

// ---- Inventory ---------------------------------------------------------

export function stockValue(p: Product): number {
  return p.stockQty * p.avgUnitCost;
}

export function retailStockValue(p: Product): number {
  return p.stockQty * p.retailPrice;
}

export function unitMargin(p: Product): number {
  return p.retailPrice - p.avgUnitCost;
}

export function unitMarginPct(p: Product): number {
  return p.retailPrice > 0 ? (unitMargin(p) / p.retailPrice) * 100 : 0;
}

export function isLowStock(p: Product): boolean {
  return p.stockQty <= p.reorderLevel;
}

export function totalInventoryValue(): number {
  return products.reduce((s, p) => s + stockValue(p), 0);
}

// ---- Sales / profit ----------------------------------------------------

export function saleRevenue(s: Sale): number {
  return s.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
}

export function saleCogs(s: Sale): number {
  return s.lines.reduce((sum, l) => {
    const p = findProduct(l.productId);
    return sum + l.qty * (p ? p.avgUnitCost : 0);
  }, 0);
}

export function totalRevenue(): number {
  return sales.reduce((s, sale) => s + saleRevenue(sale), 0);
}

export function totalCogs(): number {
  return sales.reduce((s, sale) => s + saleCogs(sale), 0);
}

export function totalOperatingExpenses(): number {
  return expenses.reduce((s, e) => s + e.amount, 0);
}

export function expensesByCategory(): { category: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// ---- P&L rollup --------------------------------------------------------

export interface ProfitAndLoss {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
  operatingExpenses: number;
  netProfit: number;
  netMarginPct: number;
}

export function profitAndLoss(): ProfitAndLoss {
  const revenue = totalRevenue();
  const cogs = totalCogs();
  const grossProfit = revenue - cogs;
  const operatingExpenses = totalOperatingExpenses();
  const netProfit = grossProfit - operatingExpenses;
  return {
    revenue,
    cogs,
    grossProfit,
    grossMarginPct: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
    operatingExpenses,
    netProfit,
    netMarginPct: revenue > 0 ? (netProfit / revenue) * 100 : 0,
  };
}

export function unitsSold(): number {
  return sales.reduce(
    (s, sale) => s + sale.lines.reduce((n, l) => n + l.qty, 0),
    0,
  );
}
