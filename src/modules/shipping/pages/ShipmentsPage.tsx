import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { MoreVertical } from "lucide-react";
import CustomTitle from "../../../shared/components/Title/Title";
import { useShipments } from "../hooks/useShipments";
import { formatDate } from "../utils/shipmentUtils";
import type { Shipment, ShipmentState } from "../types";
import { deleteShipment } from "../api/shipping.service";
import { useShipmentTabCounts } from "../hooks/useShipmentTabCounts";
import { useNotificationStore } from "../../../shared/store/notification.store";
import { ShipmentDetailPanel } from "../components/ShipmentDetailPanel/ShipmentDetailPanel";
import {
  ShipmentFilterForm,
  type ShipmentFilterValues,
} from "../components/ShipmentFilterForm/ShipmentFilterForm";
import { CarrierPanel } from "../components/CarrierPanel/CarrierPanel";
import { VehiclePanel } from "../components/VehiclePanel/VehiclePanel";
import { DriverPanel } from "../components/DriverPanel/DriverPanel";
import { useShipmentStateChange } from "../hooks/useShipmentStateChange";
import { ShipmentStateSelector } from "../components/ShipmentStateSelector/ShipmentStateSelector";
import { VALID_STATE_TRANSITIONS } from "../config/shipmentStatusConfig";

const TAB_STATES: ShipmentState[] = [
  "PENDING",
  "ASSIGNED",
  "IN_ROUTE",
  "DELIVERED",
  "DELAYED",
];

const TAB_LABELS: Record<ShipmentState, string> = {
  PENDING: "Pendientes",
  ASSIGNED: "Asignados",
  IN_ROUTE: "En Ruta",
  DELIVERED: "Entregados",
  DELAYED: "Retrasados",
};

type ColumnDef = {
  label: string;
  render: (s: Shipment) => React.ReactNode;
};

const buildColumns = (state: ShipmentState): ColumnDef[] => {
  const invoiceNumber: ColumnDef = {
    label: "# Factura",
    render: (s) => s.invoiceNumber || "-",
  };
  const fechaCreacion: ColumnDef = {
    label: "Fecha",
    render: (s) => formatDate(s.createdAt),
  };
  const cliente: ColumnDef = {
    label: "Cliente",
    render: (s) => s.clientName || "-",
  };
  const numProds: ColumnDef = {
    label: "# Prods.",
    render: (s) => s.productCount ?? "-",
  };
  const direccion: ColumnDef = {
    label: "Dirección",
    render: (s) => (
      <span className="block max-w-[180px] truncate" title={s.deliveryAddress}>
        {s.deliveryAddress || "-"}
      </span>
    ),
  };
  const asesor: ColumnDef = {
    label: "Asesor",
    render: (s) => s.asesorName || "-",
  };
  const conductor: ColumnDef = {
    label: "Conductor",
    render: (s) => s.carrier?.name || "-",
  };
  const fEstEntrega: ColumnDef = {
    label: "F. Est. Entrega",
    render: (s) => s.estimatedDeliveryDate || "-",
  };
  const fEntregado: ColumnDef = {
    label: "F. Entregado",
    render: (s) => formatDate(s.deliveryDate),
  };
  const codigoS: ColumnDef = {
    label: "Código S",
    render: (s) => s.trackingCode || "-",
  };

  switch (state) {
    case "PENDING":
      return [invoiceNumber, fechaCreacion, cliente, numProds, direccion, asesor];
    case "ASSIGNED":
    case "IN_ROUTE":
      return [invoiceNumber, fechaCreacion, cliente, numProds, direccion, fEstEntrega, conductor, codigoS];
    case "DELIVERED":
      return [fEstEntrega, fEntregado, cliente, numProds, invoiceNumber, fechaCreacion, direccion, conductor, codigoS];
    case "DELAYED":
      return [fEstEntrega, fechaCreacion, cliente, numProds, direccion, conductor, codigoS];
  }
};

const EMPTY_FILTERS: ShipmentFilterValues = {
  client: "",
  advisor: null,
  dateFrom: "",
  dateTo: "",
};

const ShipmentsPage = () => {
  const [activeTab, setActiveTab] = useState<ShipmentState>("PENDING");
  const tabCounts = useShipmentTabCounts();
  const [filterValues, setFilterValues] = useState<ShipmentFilterValues>(EMPTY_FILTERS);
  const [carrierPanelOpen, setCarrierPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [driverPanelOpen, setDriverPanelOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailShipmentId, setDetailShipmentId] = useState<string | null>(null);
  const [stateDialogShipment, setStateDialogShipment] = useState<Shipment | null>(null);
  const [stateDialogNewState, setStateDialogNewState] = useState<ShipmentState | null>(null);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const { changeState, loading: stateChangeLoading } = useShipmentStateChange();

  const {
    shipments,
    loading,
    currentPage,
    totalElements,
    pageSize,
    setCurrentPage,
    handleStateFilter,
    applySearchFilters,
  } = useShipments();

  useEffect(() => {
    handleStateFilter("PENDING");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newState: ShipmentState) => {
    setActiveTab(newState);
    handleStateFilter(newState);
  };

  const handleFilter = () => {
    applySearchFilters({
      clientName: filterValues.client || undefined,
      asesorName: filterValues.advisor?.name || undefined,
      dateFrom: filterValues.dateFrom || undefined,
      dateTo: filterValues.dateTo || undefined,
    });
  };

  const handleClearFilters = () => {
    setFilterValues(EMPTY_FILTERS);
    applySearchFilters({ clientName: undefined, asesorName: undefined, dateFrom: undefined, dateTo: undefined });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, shipmentId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedShipmentId(shipmentId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedShipmentId(null);
  };

  const handleViewDetail = () => {
    if (selectedShipmentId) setDetailShipmentId(selectedShipmentId);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedShipmentId) {
      try {
        await deleteShipment(selectedShipmentId);
        handleStateFilter(activeTab);
      } catch {
        showNotification("Error al eliminar el despacho", "error");
      }
    }
    handleMenuClose();
  };

  const handleChangeStateOpen = () => {
    const shipment = shipments.find((s) => s.id === selectedShipmentId);
    if (shipment) {
      const validTransitions = VALID_STATE_TRANSITIONS[shipment.state];
      setStateDialogShipment(shipment);
      setStateDialogNewState(validTransitions[0] ?? null);
    }
    setMenuAnchorEl(null);
    setSelectedShipmentId(null);
  };

  const handleChangeStateClose = () => {
    setStateDialogShipment(null);
    setStateDialogNewState(null);
  };

  const handleChangeStateConfirm = async () => {
    if (!stateDialogShipment || !stateDialogNewState) return;
    const updated = await changeState(stateDialogShipment, stateDialogNewState);
    if (updated) {
      showNotification("Estado actualizado correctamente", "success");
      handleStateFilter(activeTab);
      handleChangeStateClose();
    } else {
      showNotification("Error al cambiar el estado del despacho", "error");
    }
  };

  const selectedShipmentForMenu = shipments.find((s) => s.id === selectedShipmentId);

  const columns = buildColumns(activeTab);

  return (
    <Box className="flex h-full flex-col space-y-6">
      <CustomTitle
        mainTitle="Despachos"
        description="Seguimiento y gestión de despachos y envíos"
      />

      <ShipmentFilterForm
        values={filterValues}
        onChange={setFilterValues}
        onFilter={handleFilter}
        onClear={handleClearFilters}
        onOpenCarriers={() => setCarrierPanelOpen(true)}
        onOpenVehicles={() => setVehiclePanelOpen(true)}
        onOpenDrivers={() => setDriverPanelOpen(true)}
      />

      <CarrierPanel
        open={carrierPanelOpen}
        onClose={() => setCarrierPanelOpen(false)}
      />

      <VehiclePanel
        open={vehiclePanelOpen}
        onClose={() => setVehiclePanelOpen(false)}
      />

      <DriverPanel
        open={driverPanelOpen}
        onClose={() => setDriverPanelOpen(false)}
      />

      <Paper variant="outlined">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {TAB_STATES.map((state) => (
            <Tab
              key={state}
              value={state}
              label={`${TAB_LABELS[state]} (${tabCounts[state]})`}
            />
          ))}
        </Tabs>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell padding="checkbox" />
                {columns.map((col) => (
                  <TableCell key={col.label} className="font-semibold whitespace-nowrap">
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" className="py-8">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" className="py-8">
                    <Typography color="text.secondary">
                      Sin despachos en esta categoría
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment) => (
                  <TableRow key={shipment.id} hover>
                    <TableCell padding="checkbox">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, shipment.id)}
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.label}>{col.render(shipment)}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={totalElements}
            rowsPerPage={pageSize}
            page={currentPage - 1}
            onPageChange={handleChangePage}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </TableContainer>
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetail}>Ver detalle</MenuItem>
        <Divider />
        <MenuItem
          onClick={handleChangeStateOpen}
          disabled={
            !selectedShipmentForMenu ||
            VALID_STATE_TRANSITIONS[selectedShipmentForMenu.state].length === 0
          }
        >
          Cambiar estado
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog
        open={stateDialogShipment !== null}
        onClose={handleChangeStateClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cambiar estado del despacho</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {stateDialogShipment && stateDialogNewState && (
            <ShipmentStateSelector
              currentState={stateDialogShipment.state}
              value={stateDialogNewState}
              onChange={setStateDialogNewState}
              disabled={stateChangeLoading}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeStateClose} disabled={stateChangeLoading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleChangeStateConfirm}
            disabled={stateChangeLoading || stateDialogNewState === stateDialogShipment?.state}
          >
            {stateChangeLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ShipmentDetailPanel
        open={detailShipmentId !== null}
        onClose={() => setDetailShipmentId(null)}
        shipmentId={detailShipmentId}
      />
    </Box>
  );
};

export default ShipmentsPage;
