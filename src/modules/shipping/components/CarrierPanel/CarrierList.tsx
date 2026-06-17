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
import { Globe, Pencil, Trash2, Truck } from "lucide-react";
import { deleteCarrier } from "../../api/shipping.service";
import { useNotificationStore } from "../../../../shared/store/notification.store";
import type { Carrier } from "../../types";

interface CarrierListProps {
  carriers: Carrier[];
  loading: boolean;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (carrier: Carrier) => void;
  onDeleted: () => void;
  onNew: () => void;
}

export const CarrierList = ({
  carriers,
  loading,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onEdit,
  onDeleted,
}: CarrierListProps) => {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (carrier: Carrier) => {
    setDeletingId(carrier.id);
    try {
      await deleteCarrier(carrier.id);
      showNotification("Transportadora eliminada correctamente", "success");
      onDeleted();
    } catch {
      showNotification("Error al eliminar la transportadora", "error");
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

  if (carriers.length === 0) {
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
          <Truck size={24} />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Sin transportadoras registradas
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Registra la primera para comenzar a asignar despachos
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
                Sitio web
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: "text.secondary", py: 1.5 }}>
                Registro
              </TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow
                key={carrier.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {carrier.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {carrier.website ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Globe size={12} color="#9e9e9e" />
                      <Typography
                        variant="body2"
                        component="a"
                        href={carrier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          "&:hover": { color: "primary.main", textDecoration: "underline" },
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {carrier.website.replace(/^https?:\/\//, "")}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.disabled">—</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {carrier.registeredAt
                      ? new Date(carrier.registeredAt + "T00:00:00").toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox" sx={{ pr: 1 }}>
                  <Box sx={{ display: "flex", gap: 0.25 }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => onEdit(carrier)}>
                        <Pencil size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(carrier)}
                        disabled={deletingId === carrier.id}
                        sx={{
                          color: "error.light",
                          "&:hover": { color: "error.main", bgcolor: "rgba(211,47,47,0.06)" },
                        }}
                      >
                        {deletingId === carrier.id ? (
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
