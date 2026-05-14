export interface InventoryTableItem {
  id: string;
  productName: string;
  productReference: string;
  category: string;
  taxFree: boolean;
  quantityAvailable: number;
  quantityReserved: number;
  state: "IN_STOCK" | "OUT_OF_STOCK";
}
