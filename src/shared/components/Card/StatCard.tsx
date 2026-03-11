import type { ReactNode } from "react";

export type StatCardAccent = "green" | "blue" | "orange" | "purple";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: StatCardAccent;
}

const ACCENT_BORDER: Record<StatCardAccent, string> = {
  green:  "border-l-green-500",
  blue:   "border-l-blue-500",
  orange: "border-l-orange-500",
  purple: "border-l-purple-500",
};

const ACCENT_ICON_BG: Record<StatCardAccent, string> = {
  green:  "bg-green-100 text-green-600",
  blue:   "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
};

const StatCard = ({ title, value, icon, accent = "green" }: StatCardProps) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${ACCENT_BORDER[accent]} px-5 py-4 flex items-center justify-between gap-4 min-w-0`}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-800 truncate">{value}</p>
      </div>

      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${ACCENT_ICON_BG[accent]}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
