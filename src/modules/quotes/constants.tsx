import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { JSX } from "react";
import { QuoteStatus } from "./types";

export interface StatusConfig { 
  label: string;
  icon: JSX.Element;
  colorClass: string;
}

export const QUOTE_STATUS_UI: Record<QuoteStatus, StatusConfig> = {
  [QuoteStatus.PENDING]: {
    label: "Pendiente",
    icon: <Clock size={14} className="mr-1.5" />,
    colorClass: "bg-orange-100 text-orange-800 border-orange-200",
  },
  [QuoteStatus.ACCEPTED]: {
    label: "Aprobada",
    icon: <CheckCircle size={14} className="mr-1.5" />,
    colorClass: "bg-green-100 text-green-800 border-green-200",
  },
  [QuoteStatus.REJECTED]: {
    label: "Rechazada",
    icon: <XCircle size={14} className="mr-1.5" />,
    colorClass: "bg-red-100 text-red-800 border-red-200",
  },
  [QuoteStatus.EXPIRED]: {
    label: "Caducada",
    icon: <AlertCircle size={14} className="mr-1.5" />,
    colorClass: "bg-gray-100 text-gray-800 border-gray-200",
  },
};