export interface MonthlySales {
  year: number;
  month: number;
  total: number;
}

export interface TopProduct {
  productName: string;
  totalQuantity: number;
}

export interface DashboardStats {
  totalVentasMes: number;
  carteraVencida: number;
  ventasPorMes: MonthlySales[];
  productosMasVendidos: TopProduct[];
}
