import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
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
import { useNavigate } from "react-router-dom";
import CustomTitle from "../../../shared/components/Title/Title";
import { useShipments } from "../hooks/useShipments";
import { formatDate } from "../utils/shipmentUtils";
import type { Shipment, ShipmentState } from "../types";
import { getAllShipments } from "../api/shipping.service";
import {
  ShipmentFilterForm,
  type ShipmentFilterValues,
} from "../components/ShipmentFilterForm/ShipmentFilterForm";

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

  switch (state) {
    case "PENDING":
      return [invoiceNumber, fechaCreacion, cliente, numProds, direccion, asesor];
    case "ASSIGNED":
    case "IN_ROUTE":
      return [invoiceNumber, fechaCreacion, cliente, numProds, direccion, fEstEntrega, conductor];
    case "DELIVERED":
      return [fEstEntrega, fEntregado, cliente, numProds, invoiceNumber, fechaCreacion, direccion, conductor];
    case "DELAYED":
      return [fEstEntrega, fechaCreacion, cliente, numProds, direccion, conductor];
  }
};

const EMPTY_FILTERS: ShipmentFilterValues = {
  client: "",
  advisor: null,
  dateFrom: "",
  dateTo: "",
};

const ShipmentsPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ShipmentState>("PENDING");
  const [tabCounts, setTabCounts] = useState<Record<ShipmentState, number>>({
    PENDING: 0,
    ASSIGNED: 0,
    IN_ROUTE: 0,
    DELIVERED: 0,
    DELAYED: 0,
  });
  const [filterValues, setFilterValues] = useState<ShipmentFilterValues>(EMPTY_FILTERS);

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
    Promise.all(
      TAB_STATES.map((s) => getAllShipments({ state: s, size: 1, page: 0 }))
    ).then((results) => {
      const counts = {} as Record<ShipmentState, number>;
      TAB_STATES.forEach((s, i) => {
        counts[s] = results[i].totalElements;
      });
      setTabCounts(counts);
    });
  }, []);

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
                        onClick={() => navigate(`/despachos/${shipment.id}`)}
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
    </Box>
  );
};

export default ShipmentsPage;
