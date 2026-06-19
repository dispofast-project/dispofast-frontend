import type { JSX } from "react";
import { Skeleton } from "@mui/material";
import { TrendingUp, AlertCircle } from "lucide-react";
import StatCard from "../../../shared/components/Card/StatCard";
import CustomTitle from "../../../shared/components/Title/Title";
import { VentasPorMesChart } from "../components/VentasPorMesChart";
import { ProductosMasVendidosChart } from "../components/ProductosMasVendidosChart";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency } from "../../../shared/utils/currency";
import AsesorVsQuotaChart from "../components/AsesorVsQuotaChart";

const DashboardPage = (): JSX.Element => {
  const { stats, loading, asesorQuotaStats } = useDashboard();

  const today = new Date();
  const dateLabel = today.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 space-y-6">
      <CustomTitle
        mainTitle="Dashboard"
        description={dateLabel.replace(/^\w/, (c) => c.toUpperCase())}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={88} className="rounded-xl" />
            <Skeleton variant="rectangular" height={88} className="rounded-xl" />
          </>
        ) : (

          <>
            <StatCard
              title="Ventas del Mes"
              value={formatCurrency(stats?.totalVentasMes ?? 0)}
              icon={<TrendingUp size={20} />}
              accent="blue"
            />
            <StatCard
              title="Cartera Vencida"
              value={formatCurrency(stats?.carteraVencida ?? 0)}
              icon={<AlertCircle size={20} />}
              accent="orange"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VentasPorMesChart data={stats?.ventasPorMes ?? []} loading={loading} />
        <ProductosMasVendidosChart data={stats?.productosMasVendidos ?? []} loading={loading} />
        
        <div className="md:col-span-2">
          <AsesorVsQuotaChart data={asesorQuotaStats ?? []} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
