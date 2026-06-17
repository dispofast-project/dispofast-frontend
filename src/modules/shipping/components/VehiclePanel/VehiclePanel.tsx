import { useState } from "react";
import { Box, Drawer, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { X } from "lucide-react";
import { useVehicles } from "../../hooks/useVehicles";
import { VehicleList } from "./VehicleList";
import { VehicleForm } from "./VehicleForm";
import type { Vehicle } from "../../types";

interface VehiclePanelProps {
  open: boolean;
  onClose: () => void;
}

export const VehiclePanel = ({ open, onClose }: VehiclePanelProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const {
    vehicles,
    loading,
    currentPage,
    totalElements,
    pageSize,
    setCurrentPage,
    refetch,
  } = useVehicles();

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setActiveTab(1);
  };

  const handleFormSuccess = () => {
    setEditingVehicle(null);
    setActiveTab(0);
    refetch();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1 && activeTab !== 1) {
      setEditingVehicle(null);
    }
  };

  const handleClose = () => {
    setEditingVehicle(null);
    setActiveTab(0);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 680, md: 760 } } }}
    >
      <Box className="flex flex-col h-full">
        <Box className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <Typography variant="h6" className="font-semibold">
            Vehículos
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <X size={18} />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          <Tab label="Lista de vehículos" />
          <Tab label={editingVehicle ? "Editar Vehículo" : "Registrar Vehículo"} />
        </Tabs>

        <Box className="flex-1 overflow-auto p-4">
          {activeTab === 0 && (
            <VehicleList
              vehicles={vehicles}
              loading={loading}
              currentPage={currentPage}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDeleted={refetch}
            />
          )}
          {activeTab === 1 && (
            <VehicleForm
              editingVehicle={editingVehicle}
              onSuccess={handleFormSuccess}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
