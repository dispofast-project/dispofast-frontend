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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeDriver, setActiveDriver] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, driver: Driver) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setActiveDriver(driver);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setActiveDriver(null);
  };

  const handleEdit = () => {
    if (activeDriver) onEdit(activeDriver);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!activeDriver) return;
    const driver = activeDriver;
    handleMenuClose();
    setDeleting(true);
    try {
      await deleteDriver(driver.id);
      showNotification("Conductor eliminado correctamente", "success");
      onDeleted();
    } catch {
      showNotification("Error al eliminar el conductor", "error");
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

  if (drivers.length === 0) {
    return (
      <Box className="flex justify-center py-8">
        <Typography color="text.secondary">No hay conductores registrados</Typography>
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
              <TableCell className="font-semibold">Cédula</TableCell>
              <TableCell className="font-semibold">Teléfono</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id} hover>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.cedula || "-"}</TableCell>
                <TableCell>{driver.phone || "-"}</TableCell>
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, driver)}
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
