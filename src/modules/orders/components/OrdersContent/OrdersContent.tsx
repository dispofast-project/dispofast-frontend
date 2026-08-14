import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  CircularProgress,
  Link,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { JSX } from "react";
import type { OrderState, SalesOrder } from "../../types";
import { ORDER_STATUS_CONFIG } from "../../config/statusConfig";
import { StatusBadge } from "../../../../shared/components/StatusBadge/StatusBadge";
import { useOrders } from "../../hooks/useOrders";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import { Button } from "../../../../shared/components/Button/Button";
import FilterSearchBar from "../../../../shared/components/SearchBar/SearchBar";
import type { FilterConfig, FilterState } from "../../../../shared/components/SearchBar/types";
import { deleteOrder, attachInvoice, downloadInvoice } from "../../api/order.service";
import AttachInvoiceDialog from "../AttachInvoiceDialog/AttachInvoiceDialog";
import { Download, Eye, Paperclip, Trash2 } from "lucide-react";
import { ListItemIcon } from "@mui/material";
import { useAuth } from "../../../iam/hooks/useAuth";

const filterConfigs: FilterConfig[] = [
  {
    type: "scoped-text",
    key: "search",
    label: "Buscar",
    scopes: [
      { value: "orderNumber", label: "# Orden" },
      { value: "clientName", label: "Cliente" },
    ],
    debounceMs: 400,
  },
];

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return "-";
  return `$${value.toLocaleString("es-CO")}`;
};

const formatDate = (isoDate: string): string => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ALL_STATES: { value: OrderState | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Creada" },
  { value: "INVOICED", label: "Facturada" },
  { value: "ASSIGNED", label: "Asignada" },
  { value: "IN_TRANSIT", label: "En Despacho" },
  { value: "DELIVERED", label: "Entregada" },
  { value: "CANCELLED", label: "Cancelada" },
];

const HEADERS = [
  "Estado",
  "Cliente",
  "# Orden",
  "Valor",
  "# Factura",
  "Ciudad",
  "Dirección de Entrega",
  "# Guía",
  "Fecha",
];


const OrdersContent = (): JSX.Element => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize,
    filters,
    handlePageChange,
    handleStateFilter,
    handleSearchChange,
    handleRefresh,
  } = useOrders();

  const [orderToDelete, setOrderToDelete] = useState<SalesOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [invoiceOrder, setInvoiceOrder] = useState<SalesOrder | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [uploadInvoiceError, setUploadInvoiceError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleFilterChange = useCallback(
    (state: FilterState) => {
      const term = state["search"]?.term ?? "";
      const scope = (state["search"]?.scope ?? "orderNumber") as "orderNumber" | "clientName";
      handleSearchChange(term, scope);
    },
    [handleSearchChange]
  );

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const val = event.target.value as OrderState | "";
    handleStateFilter(val || undefined);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteOrder(orderToDelete.id);
      setOrderToDelete(null);
      handleRefresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar la orden.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    if (isDeleting) return;
    setOrderToDelete(null);
    setDeleteError(null);
  };

  const handleCloseInvoiceDialog = () => {
    if (isUploadingInvoice) return;
    setInvoiceOrder(null);
    setInvoiceNumber("");
    setInvoiceFile(null);
    setUploadInvoiceError(null);
  };

  const handleUploadInvoice = async () => {
    if (!invoiceOrder || !invoiceNumber.trim() || !invoiceFile) return;
    setIsUploadingInvoice(true);
    setUploadInvoiceError(null);
    try {
      await attachInvoice(invoiceOrder.id, { invoiceNumber, file: invoiceFile });
      setInvoiceOrder(null);
      setInvoiceNumber("");
      setInvoiceFile(null);
      handleRefresh();
    } catch (err) {
      setUploadInvoiceError(err instanceof Error ? err.message : "Error al adjuntar factura.");
    } finally {
      setIsUploadingInvoice(false);
    }
  };

  const handleDownloadInvoice = async (id: string | null) => {
    if (!id) return;
    setDownloadLoading(true);
    try {
      await downloadInvoice(id);
    } finally {
      setDownloadLoading(false);
    }
  };
  

  const { authorities } = useAuth();
  const canDelete = authorities.includes("PURCHASE_ORDERS_DELETE");

  const renderOptionsMenu = (item: SalesOrder, closeMenu: () => void) => (
    <>
      <MenuItem onClick={() => { closeMenu(); navigate(`/ordenes/${item.id}`); }}>
        <ListItemIcon><Eye size={16} /></ListItemIcon>
        Ver detalles
      </MenuItem>
      {item.state !== "PENDING" && ( 
        <MenuItem onClick={() => { closeMenu(); handleDownloadInvoice(item.id); }}>
          <ListItemIcon>{downloadLoading ? <CircularProgress size={12} /> : <Download className="w-3.5 h-3.5" />}</ListItemIcon>
          Descargar factura
        </MenuItem>
      )}
      {authorities.includes("ROLE_ADMIN") && item.state === "PENDING" && (
        <MenuItem onClick={() => { closeMenu(); setInvoiceOrder(item); }}>
          <ListItemIcon><Paperclip size={16} /></ListItemIcon>
          Adjuntar factura
        </MenuItem>
      )}
      {canDelete && (
        <MenuItem onClick={() => { closeMenu(); setOrderToDelete(item); }} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}><Trash2 size={16} /></ListItemIcon>
          Eliminar orden
        </MenuItem>
      )} 
      
    </>
  );

  const renderOrderRow = useCallback(
    (item: SalesOrder): (string | JSX.Element)[] => [
      <StatusBadge key="state" status={item.state} configMap={ORDER_STATUS_CONFIG} />,
      item.clientName,
      item.orderNumber,
      formatCurrency(item.totalValue),
      <span>
        {item.invoiceNumber ?? "-"}
      </span>,
      item.shipmentCityName,
      item.shipmentAddress ?? "-",
      item.trackingCode ? (
        <Link
          href={`https://transprensa.com/Seguimiento/?remesa_codigo=${encodeURIComponent(item.trackingCode)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {item.trackingCode}
        </Link>
      ) : (
        "-"
      ),
      formatDate(item.orderDate),
    ],
    [navigate]
  );

  if (error) {
    return (
      <Box className="text-center py-10">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={handleRefresh} variant="primary">
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box component="div" className="space-y-4 pb-6">
      <Box className="flex flex-wrap items-center gap-3">
        <FilterSearchBar
          configs={filterConfigs}
          onChange={handleFilterChange}
          className="flex-grow max-w-lg"
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.state ?? ""}
            label="Estado"
            onChange={handleStateChange}
          >
            {ALL_STATES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className={loading ? "opacity-50 pointer-events-none" : ""}>
        <CustomTable
          data={orders}
          headers={HEADERS}
          renderRow={renderOrderRow}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={pageSize}
          totalItems={totalElements}
          onRowClick={(item) => navigate(`/ordenes/${item.id}`)}
          optionsMenu={renderOptionsMenu}
        />
      </Box>

      <AttachInvoiceDialog
        open={!!invoiceOrder}
        onClose={handleCloseInvoiceDialog}
        onSubmit={handleUploadInvoice}
        invoiceNumber={invoiceNumber}
        onInvoiceNumberChange={setInvoiceNumber}
        invoiceFile={invoiceFile}
        onInvoiceFileChange={setInvoiceFile}
        isLoading={isUploadingInvoice}
        error={uploadInvoiceError}
      />

      <Dialog open={!!orderToDelete} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar orden</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la orden{" "}
            <strong>{orderToDelete?.orderNumber}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
          {deleteError && (
            <Box className="mt-3 text-sm text-red-600 bg-red-50 rounded p-2">
              {deleteError}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog} disabled={isDeleting}>
            Cancelar
          </MuiButton>
          <MuiButton
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={14} color="inherit" /> : undefined}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersContent;