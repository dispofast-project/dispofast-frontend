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

export interface AsesorVsQuotaStats {
  asesorId: string;
  asesorFullName: string;
  year: number;
  month: number;
  ventas: number;
  cuota: number;
  pctCumplimiento: number;
}
