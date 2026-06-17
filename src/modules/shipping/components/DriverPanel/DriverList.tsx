import { useState } from "react";
import {
  Box,
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
import { Pencil, Trash2, UserRound } from "lucide-react";
import { deleteDriver } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Driver } from "../../types";

interface DriverListProps {
  drivers: Driver[];
  loading: boolean;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (driver: Driver) => void;
  onDeleted: () => void;
  onNew: () => void;
}

export const DriverList = ({
  drivers,
  loading,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onEdit,
  onDeleted,
}: DriverListProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (driver: Driver) => {
    setDeletingId(driver.id);
    try {
      await deleteDriver(driver.id);
      showNotification("Conductor eliminado correctamente", "success");
      onDeleted();
    } catch {
      showNotification("Error al eliminar el conductor", "error");
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

  if (drivers.length === 0) {
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
          <UserRound size={24} />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Sin conductores registrados
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Registra el primero para asignarlo a los despachos
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
                Nombre
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", py: 1.5 }}>
                Cédula
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", py: 1.5 }}>
                Teléfono
              </TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow
                key={driver.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {driver.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                    {driver.cedula || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {driver.phone || "—"}
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox" sx={{ pr: 1 }}>
                  <Box sx={{ display: "flex", gap: 0.25 }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => onEdit(driver)}>
                        <Pencil size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(driver)}
                        disabled={deletingId === driver.id}
                        sx={{
                          color: "error.light",
                          "&:hover": { color: "error.main", bgcolor: "rgba(211,47,47,0.06)" },
                        }}
                      >
                        {deletingId === driver.id ? (
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
