import { useState } from "react";
import { Box, CircularProgress, Drawer, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { X } from "lucide-react";
import { useShipmentDetail } from "../../hooks/useShipmentDetail";
import { ShipmentDetailTab } from "./ShipmentDetailTab";
import { ShipmentAssignmentTab } from "./ShipmentAssignmentTab";
import { ShipmentHistorialTab } from "./ShipmentHistorialTab";

interface ShipmentDetailPanelProps {
  open: boolean;
  onClose: () => void;
  shipmentId: string | null;
}

export const ShipmentDetailPanel = ({ open, onClose, shipmentId }: ShipmentDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { shipment, loading, refetch } = useShipmentDetail(shipmentId ?? undefined);

  const handleClose = () => {
    setActiveTab(0);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 720, md: 820 } } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
          }}
        >
          <Box>
            <Typography
              sx={{
                display: "block",
                fontSize: "0.625rem",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "text.disabled",
                lineHeight: 1,
              }}
            >
              Despacho
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, lineHeight: 1.2 }}>
              {loading ? "Cargando..." : (shipment?.invoiceNumber ?? "—")}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose}>
            <X size={18} />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            px: 3,
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 44,
              fontSize: "0.8125rem",
              textTransform: "none",
              fontWeight: 500,
            },
            "& .MuiTabs-indicator": { height: 3 },
          }}
        >
          <Tab label="Detalle" />
          <Tab label="Asignación" />
          <Tab label="Historial" />
        </Tabs>

        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={28} />
            </Box>
          ) : !shipment ? (
            <Typography color="text.secondary" sx={{ py: 8, textAlign: "center" }}>
              No se pudo cargar el despacho
            </Typography>
          ) : (
            <>
              {activeTab === 0 && <ShipmentDetailTab shipment={shipment} />}
              {activeTab === 1 && <ShipmentAssignmentTab shipment={shipment} onSaved={refetch} />}
              {activeTab === 2 && <ShipmentHistorialTab shipment={shipment} />}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
