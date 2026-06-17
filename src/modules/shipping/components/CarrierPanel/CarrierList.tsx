import { useState } from "react";
import {
  Box,
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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeCarrier, setActiveCarrier] = useState<Carrier | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, carrier: Carrier) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setActiveCarrier(carrier);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setActiveCarrier(null);
  };

  const handleEdit = () => {
    if (activeCarrier) onEdit(activeCarrier);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!activeCarrier) return;
    const carrier = activeCarrier;
    handleMenuClose();
    setDeleting(true);
    try {
      await deleteCarrier(carrier.id);
      showNotification("Transportadora eliminada correctamente", "success");
      onDeleted();
    } catch {
      showNotification("Error al eliminar la transportadora", "error");
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

  if (carriers.length === 0) {
    return (
      <Box className="flex justify-center py-8">
        <Typography color="text.secondary">No hay transportadoras registradas</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-semibold">Nombre</TableCell>
              <TableCell className="font-semibold">Sitio Web</TableCell>
              <TableCell className="font-semibold">Fecha de Registro</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow key={carrier.id} hover>
                <TableCell>{carrier.name}</TableCell>
                <TableCell>
                  {carrier.website ? (
                    <a
                      href={carrier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {carrier.website}
                    </a>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {carrier.registeredAt
                    ? new Date(carrier.registeredAt + "T00:00:00").toLocaleDateString("es-CO")
                    : "-"}
                </TableCell>
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, carrier)}
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
