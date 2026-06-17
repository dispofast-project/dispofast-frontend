import { useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Car, Pencil, Trash2 } from "lucide-react";
import { deleteVehicle } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Vehicle } from "../../types";
import {
  VEHICLE_STATE_LABELS,
  VEHICLE_STATE_COLORS,
  VEHICLE_TYPE_LABELS,
} from "../../constants/shippingConstants";

interface VehicleListProps {
  vehicles: Vehicle[];
  loading: boolean;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDeleted: () => void;
  onNew: () => void;
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (vehicle: Vehicle) => {
    setDeletingId(vehicle.id);
    try {
      await deleteVehicle(vehicle.id);
      showNotification("Vehículo eliminado correctamente", "success");
      onDeleted();
    } catch {
      showNotification("Error al eliminar el vehículo", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 10 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "action.selected",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.disabled",
          }}
        >
          <Car size={24} />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Sin vehículos registrados
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Registra el primero para asignarlo a los conductores
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", py: 1.5 }}>
                Placa
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", py: 1.5 }}>
                Tipo
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", py: 1.5 }}>
                Estado
              </TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ fontFamily: "monospace", letterSpacing: "0.5px" }}
                  >
                    {vehicle.plate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {VEHICLE_TYPE_LABELS[vehicle.type]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={VEHICLE_STATE_LABELS[vehicle.state]}
                    color={VEHICLE_STATE_COLORS[vehicle.state]}
                    size="small"
                    sx={{ height: 22, fontSize: "0.72rem", fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell padding="checkbox" sx={{ pr: 1 }}>
                  <Box sx={{ display: "flex", gap: 0.25 }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => onEdit(vehicle)}>
                        <Pencil size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(vehicle)}
                        disabled={deletingId === vehicle.id}
                        sx={{
                          color: "error.light",
                          "&:hover": { color: "error.main", bgcolor: "rgba(211,47,47,0.06)" },
                        }}
                      >
                        {deletingId === vehicle.id ? (
                          <CircularProgress size={13} color="inherit" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalElements > pageSize && (
        <TablePagination
          rowsPerPageOptions={[pageSize]}
          component="div"
          count={totalElements}
          rowsPerPage={pageSize}
          page={currentPage - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Box>
  );
};
