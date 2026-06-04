export interface InventoryTableItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  imageUrl: string | null;
  taxFree: boolean;
  quantityAvailable: number;
  quantityReserved: number;
  state: "IN_STOCK" | "OUT_OF_STOCK";
}
