import type {
  Supplier,
  Product,
  PurchaseOrder,
  Expense,
  Sale,
} from "../lib/types";

export const suppliers: Supplier[] = [
  {
    id: "SUP-01",
    name: "Al-Haramain Perfumes",
    origin: "Dubai, UAE",
    contact: "orders@alharamain.ae",
    terms: "50% advance, 50% on shipment",
  },
  {
    id: "SUP-02",
    name: "Grasse Maison Fragrance",
    origin: "Grasse, France",
    contact: "b2b@grassemaison.fr",
    terms: "Net 30",
  },
  {
    id: "SUP-03",
    name: "Kannauj Attar House",
    origin: "Kannauj, India",
    contact: "sales@kannaujattar.in",
    terms: "Advance payment",
  },
  {
    id: "SUP-04",
    name: "Lattafa Distributors",
    origin: "Sharjah, UAE",
    contact: "wholesale@lattafa.com",
    terms: "Net 15",
  },
];

export const products: Product[] = [
  {
    id: "P-01",
    name: "Amber Oud Intense",
    brand: "Al-Haramain",
    category: "Eau de Parfum",
    size: "60ml",
    sku: "AH-AOI-60",
    stockQty: 48,
    reorderLevel: 20,
    retailPrice: 4200,
    avgUnitCost: 2180,
  },
  {
    id: "P-02",
    name: "Rose Damascena",
    brand: "Grasse Maison",
    category: "Eau de Parfum",
    size: "50ml",
    sku: "GM-RD-50",
    stockQty: 12,
    reorderLevel: 15,
    retailPrice: 6500,
    avgUnitCost: 3560,
  },
  {
    id: "P-03",
    name: "Pure Mukhallat Attar",
    brand: "Kannauj",
    category: "Attar / Oil",
    size: "12ml",
    sku: "KN-MUK-12",
    stockQty: 90,
    reorderLevel: 30,
    retailPrice: 1800,
    avgUnitCost: 720,
  },
  {
    id: "P-04",
    name: "Khamrah",
    brand: "Lattafa",
    category: "Eau de Parfum",
    size: "100ml",
    sku: "LT-KHM-100",
    stockQty: 6,
    reorderLevel: 25,
    retailPrice: 3900,
    avgUnitCost: 1650,
  },
  {
    id: "P-05",
    name: "Citrus Neroli Mist",
    brand: "Grasse Maison",
    category: "Body Mist",
    size: "150ml",
    sku: "GM-CNM-150",
    stockQty: 64,
    reorderLevel: 20,
    retailPrice: 1500,
    avgUnitCost: 640,
  },
  {
    id: "P-06",
    name: "Oud & Saffron Gift Set",
    brand: "Al-Haramain",
    category: "Gift Set",
    size: "3 x 30ml",
    sku: "AH-GS-3",
    stockQty: 22,
    reorderLevel: 10,
    retailPrice: 7200,
    avgUnitCost: 3980,
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-1041",
    supplierId: "SUP-01",
    date: "2026-08-18",
    status: "Received",
    lines: [
      { productId: "P-01", qty: 60, unitCost: 1950 },
      { productId: "P-06", qty: 24, unitCost: 3600 },
    ],
    miscCosts: [
      { label: "Air freight (Dubai → Dhaka)", amount: 18500, kind: "Shipping" },
      { label: "Customs duty + VAT", amount: 24800, kind: "Customs / Duty" },
      { label: "Clearing agent fee", amount: 6500, kind: "Handling" },
    ],
  },
  {
    id: "PO-1042",
    supplierId: "SUP-03",
    date: "2026-08-27",
    status: "Received",
    lines: [{ productId: "P-03", qty: 120, unitCost: 560 }],
    miscCosts: [
      { label: "Courier (Kannauj → Dhaka)", amount: 9200, kind: "Shipping" },
      { label: "Customs duty", amount: 7400, kind: "Customs / Duty" },
    ],
  },
  {
    id: "PO-1043",
    supplierId: "SUP-04",
    date: "2026-09-02",
    status: "In Transit",
    lines: [{ productId: "P-04", qty: 80, unitCost: 1420 }],
    miscCosts: [
      { label: "Sea freight consolidation", amount: 12600, kind: "Shipping" },
      { label: "Customs duty + VAT", amount: 15200, kind: "Customs / Duty" },
      { label: "Insurance", amount: 3200, kind: "Other" },
    ],
  },
  {
    id: "PO-1044",
    supplierId: "SUP-02",
    date: "2026-09-09",
    status: "Ordered",
    lines: [
      { productId: "P-02", qty: 40, unitCost: 3100 },
      { productId: "P-05", qty: 90, unitCost: 520 },
    ],
    miscCosts: [
      { label: "Air freight (Paris → Dhaka)", amount: 22400, kind: "Shipping" },
      { label: "Customs duty + VAT", amount: 31500, kind: "Customs / Duty" },
      { label: "Clearing agent fee", amount: 7200, kind: "Handling" },
    ],
  },
];

export const expenses: Expense[] = [
  { id: "E-01", date: "2026-09-01", category: "Rent", vendor: "Gulshan Warehouse", amount: 35000 },
  { id: "E-02", date: "2026-09-01", category: "Salaries", vendor: "Team payroll (3)", amount: 78000 },
  { id: "E-03", date: "2026-09-03", category: "Marketing", vendor: "Meta Ads", amount: 42000 },
  { id: "E-04", date: "2026-09-05", category: "Packaging", vendor: "BoxCraft BD", amount: 14500 },
  { id: "E-05", date: "2026-09-07", category: "Delivery", vendor: "Pathao Courier", amount: 19800 },
  { id: "E-06", date: "2026-09-08", category: "Platform Fees", vendor: "Daraz commission", amount: 9600 },
  { id: "E-07", date: "2026-09-10", category: "Utilities", vendor: "Internet + electricity", amount: 6200 },
  { id: "E-08", date: "2026-09-12", category: "Marketing", vendor: "Influencer collab", amount: 25000 },
];

export const sales: Sale[] = [
  {
    id: "S-2201",
    date: "2026-09-02",
    channel: "Website",
    lines: [
      { productId: "P-01", qty: 8, unitPrice: 4200 },
      { productId: "P-03", qty: 14, unitPrice: 1800 },
    ],
  },
  {
    id: "S-2202",
    date: "2026-09-04",
    channel: "Facebook",
    lines: [{ productId: "P-06", qty: 5, unitPrice: 6900 }],
  },
  {
    id: "S-2203",
    date: "2026-09-06",
    channel: "Daraz",
    lines: [
      { productId: "P-05", qty: 22, unitPrice: 1450 },
      { productId: "P-04", qty: 9, unitPrice: 3900 },
    ],
  },
  {
    id: "S-2204",
    date: "2026-09-09",
    channel: "Website",
    lines: [
      { productId: "P-02", qty: 4, unitPrice: 6500 },
      { productId: "P-01", qty: 6, unitPrice: 4200 },
    ],
  },
  {
    id: "S-2205",
    date: "2026-09-11",
    channel: "WhatsApp",
    lines: [{ productId: "P-03", qty: 20, unitPrice: 1750 }],
  },
  {
    id: "S-2206",
    date: "2026-09-13",
    channel: "Website",
    lines: [
      { productId: "P-06", qty: 4, unitPrice: 7200 },
      { productId: "P-05", qty: 16, unitPrice: 1500 },
    ],
  },
];
