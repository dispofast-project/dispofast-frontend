import { useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { MoreVertical } from "lucide-react";
import { deleteVehicle } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Vehicle, VehicleState, VehicleType } from "../../types";

const STATE_LABELS: Record<VehicleState, string> = {
  AVAILABLE: "Disponible",
  IN_MAINTENANCE: "En Mantenimiento",
};

const STATE_COLORS: Record<VehicleState, "success" | "warning"> = {
  AVAILABLE: "success",
  IN_MAINTENANCE: "warning",
};

const TYPE_LABELS: Record<VehicleType, string> = {
  FURGON: "Furgón",
  MENSAJERIA: "Mensajería",
};

interface VehicleListProps {
  vehicles: Vehicle[];
  loading: boolean;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDeleted: () => void;
}

export const VehicleList = ({
  vehicles,
  loading,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onEdit,
  onDeleted,
}: VehicleListProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, vehicle: Vehicle) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setActiveVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setActiveVehicle(null);
  };

  const handleEdit = () => {
    if (activeVehicle) onEdit(activeVehicle);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!activeVehicle) return;
    const vehicle = activeVehicle;
    handleMenuClose();
    setDeleting(true);
    try {
      await deleteVehicle(vehicle.id);
      showNotification("Vehículo eliminado correctamente", "success");
      onDeleted();
    } catch {
      showNotification("Error al eliminar el vehículo", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center py-8">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Box className="flex justify-center py-8">
        <Typography color="text.secondary">No hay vehículos registrados</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-semibold">Placa</TableCell>
              <TableCell className="font-semibold">Estado</TableCell>
              <TableCell className="font-semibold">Tipo</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} hover>
                <TableCell>{vehicle.plate}</TableCell>
                <TableCell>
                  <Chip
                    label={STATE_LABELS[vehicle.state]}
                    color={STATE_COLORS[vehicle.state]}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{TYPE_LABELS[vehicle.type]}</TableCell>
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, vehicle)}
                    disabled={deleting}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[pageSize]}
        component="div"
        count={totalElements}
        rowsPerPage={pageSize}
        page={currentPage - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
};
