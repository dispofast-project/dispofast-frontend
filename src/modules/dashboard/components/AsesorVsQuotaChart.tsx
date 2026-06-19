import { useEffect, useState } from "react";
import { Divider, Paper, Skeleton, Tab, Tabs } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { getAsesorVsQuotaStats } from "../api/dashboard.service";
import { formatCurrency } from "../../../shared/utils/currency";
import type { AsesorVsQuotaStats } from "../types";

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

type QuotaType = "SALES_QUOTA" | "COLLECTION_QUOTA";

const TABS: { type: QuotaType; label: string; realLabel: string }[] = [
  { type: "SALES_QUOTA",      label: "Cuota Ventas",   realLabel: "Ventas"    },
  { type: "COLLECTION_QUOTA", label: "Cuota Recaudos", realLabel: "Recaudado" },
];

const PctBadge = ({ pct }: { pct: number }) => {
  const color =
    pct >= 100 ? "text-green-600" : pct >= 80 ? "text-yellow-600" : "text-red-500";
  return <span className={`font-semibold ${color}`}>{pct.toFixed(1)}%</span>;
};

const AsesorVsQuotaChart = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<AsesorVsQuotaStats[]>([]);
  const [loading, setLoading] = useState(true);

  const currentTab = TABS[activeTab];

  useEffect(() => {
    setLoading(true);
    getAsesorVsQuotaStats(6, currentTab.type)
      .then(setData)
      .finally(() => setLoading(false));
  }, [activeTab]);

  const chartData = data.map((d) => ({
    name: `${d.asesorFullName.split(" ")[0]} (${MONTHS[d.month - 1]} ${d.year})`,
    Cuota: d.cuota,
    [currentTab.realLabel]: d.ventas,
  }));

  const chartHeight = Math.max(data.length * 44 + 60, 200);

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-100 p-6">
      {/* Header con tabs */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700">Ventas vs. Cuota</p>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ minHeight: 32, "& .MuiTab-root": { minHeight: 32, fontSize: 12, py: 0 } }}
        >
          {TABS.map((t, i) => (
            <Tab key={t.type} label={t.label} value={i} />
          ))}
        </Tabs>
      </div>

      {loading ? (
        <Skeleton variant="rectangular" height={300} className="rounded-lg" />
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 py-10 text-center">
          Sin datos. Asigna cuotas a los asesores desde su perfil de usuario.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 11, fill: "#374151" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="Cuota" fill="#f97316" radius={[0, 3, 3, 0]} barSize={10} />
              <Bar dataKey={currentTab.realLabel} fill="#22c55e" radius={[0, 3, 3, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>

          <Divider sx={{ my: 3 }} />

          <CustomTable
            headers={["Asesor", "Mes", currentTab.realLabel, "Cuota", "% Cumpl."]}
            data={data.map((d) => ({ ...d, id: d.asesorId }))}
            renderRow={(row) => [
              row.asesorFullName,
              `${MONTHS[row.month - 1]} ${row.year}`,
              formatCurrency(row.ventas),
              formatCurrency(row.cuota),
              <PctBadge pct={row.pctCumplimiento} />,
            ]}
            currentPage={1}
            itemsPerPage={data.length}
            totalItems={data.length}
            onPageChange={() => {}}
            hidePagination
          />
        </>
      )}
    </Paper>
  );
};

export default AsesorVsQuotaChart;
