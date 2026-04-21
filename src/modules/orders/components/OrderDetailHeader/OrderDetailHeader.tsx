import { Box, CircularProgress, Menu, MenuItem } from "@mui/material";
import { ArrowLeft, ChevronDown, FileText } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import { StatusBadge } from "../../../../shared/components/StatusBadge/StatusBadge";
import CustomTitle from "../../../../shared/components/Title/Title";
import { ORDER_STATUS_CONFIG } from "../../config/statusConfig";
import type { OrderState } from "../../types";
import { useState } from "react";

interface OrderDetailHeaderProps {
  orderNumber: string;
  clientName: string;
  state: OrderState;
  nextStates: OrderState[];
  isTerminal: boolean;
  canAttachInvoice: boolean;
  stateLoading: boolean;
  onBack: () => void;
  onAttachInvoice: () => void;
  onStateChange: (state: OrderState) => void;
}

const OrderDetailHeader = ({
  orderNumber,
  clientName,
  state,
  nextStates,
  isTerminal,
  canAttachInvoice,
  stateLoading,
  onBack,
  onAttachInvoice,
  onStateChange,
}: OrderDetailHeaderProps) => {
  const [stateAnchor, setStateAnchor] = useState<null | HTMLElement>(null);

  return (
    <Box>
      <Button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
        variant="tertiary"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <Box className="flex flex-wrap items-start justify-between gap-3">
        <Box>
          <h1>
            Orden {orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{clientName}</p>
        </Box>

        <Box className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={state} configMap={ORDER_STATUS_CONFIG} />

          {canAttachInvoice && (
            <button
              onClick={onAttachInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Adjuntar factura
            </button>
          )}

          {!isTerminal && nextStates.length > 0 && (
            <>
              <button
                disabled={stateLoading}
                onClick={(e) => setStateAnchor(e.currentTarget)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-dispofast-primary text-white text-xs font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
              >
                {stateLoading ? (
                  <CircularProgress size={12} color="inherit" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                Cambiar estado
              </button>
              <Menu
                anchorEl={stateAnchor}
                open={Boolean(stateAnchor)}
                onClose={() => setStateAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {nextStates.map((s) => (
                  <MenuItem
                    key={s}
                    onClick={() => { setStateAnchor(null); onStateChange(s); }}
                    dense
                  >
                    <StatusBadge status={s} configMap={ORDER_STATUS_CONFIG} />
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderDetailHeader;
