import { Paper, Skeleton } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TopProduct } from "../types";

interface Props {
  data: TopProduct[];
  loading: boolean;
}

export const ProductosMasVendidosChart = ({ data, loading }: Props) => {
  const chartData = data.map((d) => ({
    name: d.productName.length > 12 ? d.productName.slice(0, 12) + "…" : d.productName,
    fullName: d.productName,
    cantidad: Number(d.totalQuantity),
  }));

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-100 p-6">
      <p className="text-sm font-semibold text-gray-700 mb-4">Productos Más Vendidos</p>
      {loading ? (
        <Skeleton variant="rectangular" height={240} className="rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              formatter={(value: number, _name: string, props) => [
                `${value} uds`,
                props.payload?.fullName ?? _name,
              ]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill="#4676B8" fillOpacity={0.75 + i * 0.05 > 1 ? 1 : 0.75 + i * 0.05} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
