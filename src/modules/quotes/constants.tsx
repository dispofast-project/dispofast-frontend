import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { JSX } from "react";

export interface StatusConfig { 
  label: string;
  icon: JSX.Element;
  colorClass: string;
}

export const QUOTE_STATUS_UI: Record<string, StatusConfig> = {
  pendiente: {
    label: "Pendiente",
    icon: <Clock size={14} className="mr-1.5" />,
    colorClass: "bg-orange-100 text-orange-800 border-orange-200",
  },
  aprobada: {
    label: "Aprobada",
    icon: <CheckCircle size={14} className="mr-1.5" />,
    colorClass: "bg-green-100 text-green-800 border-green-200",
  },
  rechazada: {
    label: "Rechazada",
    icon: <XCircle size={14} className="mr-1.5" />,
    colorClass: "bg-red-100 text-red-800 border-red-200",
  },
  caducada: {
    label: "Caducada",
    icon: <AlertCircle size={14} className="mr-1.5" />,
    colorClass: "bg-gray-100 text-gray-800 border-gray-200",
  },
};