import type { StatusBadgeConfig } from "../../../shared/components/StatusBadge/StatusBadge";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { QuoteStatus } from "../types";
import React from "react";

export const QUOTE_STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  [QuoteStatus.PENDING]: {
    label: QuoteStatus.PENDING,
    color: "warning",
    icon: React.createElement(Clock, { size: 14 }),
  },
  [QuoteStatus.ACCEPTED]: {
    label: QuoteStatus.ACCEPTED,
    color: "success",
    icon: React.createElement(CheckCircle, { size: 14 }),
  },
  [QuoteStatus.REJECTED]: {
    label: QuoteStatus.REJECTED,
    color: "error",
    icon: React.createElement(XCircle, { size: 14 }),
  },
  [QuoteStatus.EXPIRED]: {
    label: QuoteStatus.EXPIRED,
    color: "default",
    icon: React.createElement(FileText, { size: 14 }),
  },
};
