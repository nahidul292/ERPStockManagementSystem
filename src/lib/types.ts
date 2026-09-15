export type Currency = number; // stored in BDT (Taka)

export interface Supplier {
  id: string;
  name: string;
  origin: string; // country/city
  contact: string;
  terms: string; // payment terms
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Eau de Parfum" | "Eau de Toilette" | "Attar / Oil" | "Body Mist" | "Gift Set";
  size: string; // e.g. "50ml"
  sku: string;
  stockQty: number;
  reorderLevel: number;
  retailPrice: Currency; // selling price per unit
  avgUnitCost: Currency; // landed cost per unit (weighted)
}

export interface PurchaseOrderLine {
  productId: string;
  qty: number;
  unitCost: Currency; // base supplier cost per unit
}

export interface MiscCost {
  label: string;
  amount: Currency;
  kind: "Shipping" | "Customs / Duty" | "Handling" | "Other";
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  date: string; // ISO
  status: "Received" | "In Transit" | "Ordered";
  lines: PurchaseOrderLine[];
  miscCosts: MiscCost[];
}

export interface Expense {
  id: string;
  date: string;
  category:
    | "Marketing"
    | "Packaging"
    | "Delivery"
    | "Rent"
    | "Salaries"
    | "Platform Fees"
    | "Utilities";
  vendor: string;
  amount: Currency;
}

export interface SaleLine {
  productId: string;
  qty: number;
  unitPrice: Currency; // actual selling price
}

export interface Sale {
  id: string;
  date: string;
  channel: "Website" | "Facebook" | "Daraz" | "WhatsApp";
  lines: SaleLine[];
}
