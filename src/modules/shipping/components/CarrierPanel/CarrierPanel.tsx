import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { useCarriers } from "../../hooks/useCarriers";
import { CarrierList } from "./CarrierList";
import { CarrierForm } from "./CarrierForm";
import type { Carrier } from "../../types";

interface CarrierPanelProps {
  open: boolean;
  onClose: () => void;
}

export const CarrierPanel = ({ open, onClose }: CarrierPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);

  const {
    carriers,
    loading,
    currentPage,
    totalElements,
    pageSize,
    setCurrentPage,
    refetch,
  } = useCarriers();

  const handleEdit = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setActiveTab(1);
  };

  const handleFormSuccess = () => {
    setEditingCarrier(null);
    setActiveTab(0);
    refetch();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1 && activeTab !== 1) {
      setEditingCarrier(null);
    }
  };

  const handleClose = () => {
    setEditingCarrier(null);
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
            Transportadoras
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
          <Tab label="Lista de transportadoras" />
          <Tab label={editingCarrier ? "Editar Transportadora" : "Registrar Transportadora"} />
        </Tabs>

        <Box className="flex-1 overflow-auto p-4">
          {activeTab === 0 && (
            <CarrierList
              carriers={carriers}
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
            <CarrierForm
              editingCarrier={editingCarrier}
              onSuccess={handleFormSuccess}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
