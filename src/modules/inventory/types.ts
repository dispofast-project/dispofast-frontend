export interface InventoryTableItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  taxFree: boolean;
  quantityAvailable: number;
  quantityReserved: number;
  state: "IN_STOCK" | "OUT_OF_STOCK";
}
