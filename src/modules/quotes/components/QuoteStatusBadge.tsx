import { QuoteStatus } from "../types";
import { QUOTE_STATUS_UI } from "../constants";
import { FileText } from "lucide-react";

interface Props {
  status: string | QuoteStatus;
}

export const QuoteStatusBadge = ({ status }: Props) => {
  const config = QUOTE_STATUS_UI[status as QuoteStatus] || {
    label: status,
    icon: <FileText size={14} className="mr-1.5" />,
    colorClass: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${config.colorClass}`}>
      {config.icon}
      {config.label}
    </span>
  );
};