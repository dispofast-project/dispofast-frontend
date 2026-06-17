import { Paper, Skeleton } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../../shared/utils/currency";
import type { MonthlySales } from "../types";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface Props {
  data: MonthlySales[];
  loading: boolean;
}

export const VentasPorMesChart = ({ data, loading }: Props) => {
  const chartData = data.map((d) => ({
    name: MONTH_NAMES[d.month - 1],
    total: d.total,
  }));

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-100 p-6">
      <p className="text-sm font-semibold text-gray-700 mb-4">Ventas por Mes</p>
      {loading ? (
        <Skeleton variant="rectangular" height={240} className="rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4676B8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4676B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              width={52}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Ventas"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#4676B8"
              strokeWidth={2}
              fill="url(#ventasGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#4676B8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
