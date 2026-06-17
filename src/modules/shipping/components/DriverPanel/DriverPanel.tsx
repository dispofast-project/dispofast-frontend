import { Box, Drawer, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { UserRound, X } from "lucide-react";
import { useDrivers } from "../../hooks/useDrivers";
import { usePanelTabState } from "../../hooks/usePanelTabState";
import { DriverList } from "./DriverList";
import { DriverForm } from "./DriverForm";
import type { Driver } from "../../types";

interface DriverPanelProps {
  open: boolean;
  onClose: () => void;
}

export const DriverPanel = ({ open, onClose }: DriverPanelProps) => {
  const { drivers, loading, currentPage, totalElements, pageSize, setCurrentPage, refetch } =
    useDrivers();
  const { activeTab, editingItem, handleEdit, handleFormSuccess, handleTabChange, handleClose } =
    usePanelTabState<Driver>(onClose);

  const handleNew = () => handleTabChange(null as unknown as React.SyntheticEvent, 1);
  const handleCancel = () => handleTabChange(null as unknown as React.SyntheticEvent, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 680, md: 760 } } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                flexShrink: 0,
              }}
            >
              <UserRound size={18} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                Conductores
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1}>
                {loading ? "Cargando..." : `${totalElements} registrado${totalElements !== 1 ? "s" : ""}`}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose}>
            <X size={18} />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2, minHeight: 44 }}
        >
          <Tab label="Lista" sx={{ minHeight: 44, textTransform: "none", fontWeight: 500 }} />
          <Tab
            label={editingItem ? "Editar" : "Registrar"}
            sx={{ minHeight: 44, textTransform: "none", fontWeight: 500 }}
          />
        </Tabs>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {activeTab === 0 && (
            <DriverList
              drivers={drivers}
              loading={loading}
              currentPage={currentPage}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDeleted={refetch}
              onNew={handleNew}
            />
          )}
          {activeTab === 1 && (
            <DriverForm
              editingDriver={editingItem}
              onSuccess={() => handleFormSuccess(refetch)}
              onCancel={handleCancel}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
