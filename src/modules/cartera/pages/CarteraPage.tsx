import type { JSX } from "react";
import { useState } from "react";
import {
  Box,
  Checkbox,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  Select,
  TextField,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Wallet,
  FileText,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../shared/components/Card/StatCard";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import { Button } from "../../../shared/components/Button/Button";
import { useCartera } from "../hooks/useCartera";
import { CARTERA_STATUS_CONFIG } from "../config/statusConfig";
import { type ArEntry, type ArEntryState } from "../types";
import { downloadInvoicePdf } from "../../invoices/api/invoice.service";
import { useNotificationStore } from "../../../shared/store/notification.store";
import CustomTitle from "../../../shared/components/Title/Title";

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatCurrency = (value: number): string =>
  `$${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DaysBadge = ({ dias }: { dias: number}) => {
  const color = dias <= 10
    ? "text-amber-600 bg-amber-50"
    : "text-green-600 bg-green-50";

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}
    >
      {dias} días
    </span>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────

const CarteraPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleDownloadInvoice = async (entry: ArEntry) => {
    if (!entry.invoiceId) return;
    try {
      await downloadInvoicePdf(entry.invoiceId);
    } catch {
      showNotification("No se pudo descargar la factura", "error");
    }
  };
  const {
    entries,
    loading,
    currentPage,
    totalElements,
    pageSize,
    stats,
    statsLoading,
    stateFilter,
    searchText,
    asesorFilter,
    asesorOptions,
    setCurrentPage,
    setSearchText,
    setAsesorFilter,
    handleStateFilter,
  } = useCartera();

  const selectedEntries = entries.filter((e) => selectedIds.has(e.id));
  const selectedClientId = selectedEntries[0]?.clientId;

  const toggleSelected = (entry: ArEntry) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(entry.id)) {
        next.delete(entry.id);
      } else {
        next.add(entry.id);
      }
      return next;
    });
  };

  const handleCombinedPayment = () => {
    if (selectedEntries.length < 2) return;
    navigate("/cartera/pago-multiple", { state: { entries: selectedEntries } });
  };

  return (
    <Box className="flex flex-col gap-6 pb-8">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <Box className="flex items-start justify-between gap-3">
        <CustomTitle mainTitle="Cartera" description="Gestiona las cuentas por cobrar" />

        <Button variant="secondary" className="flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </Box>

      {/* ── Stats cards ───────────────────────────────────────────────────────── */}
      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsLoading ? (
          <>
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={80} />
          </>
        ) : (
          <>
            <StatCard
              title="Total Cartera"
              value={formatCurrency(stats.totalCartera)}
              icon={<Wallet className="w-5 h-5" />}
              accent="blue"
            />
            <StatCard
              title="Cartera Vencida"
              value={formatCurrency(stats.carteraVencida)}
              icon={<AlertCircle className="w-5 h-5" />}
              accent="orange"
            />
            <StatCard
              title="Al Día"
              value={formatCurrency(stats.alDia)}
              icon={<CheckCircle2 className="w-5 h-5" />}
              accent="green"
            />
          </>
        )}
      </Box>

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4 flex flex-wrap items-center gap-3">
        {/* Text search */}
        <TextField
          placeholder="Buscar por cliente, orden, factura..."
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-4 h-4 text-gray-400" />
              </InputAdornment>
            ),
          }}
        />

        {/* Estado filter */}
        <Select
          size="small"
          displayEmpty
          value={stateFilter}
          onChange={(e) =>
            handleStateFilter(e.target.value as ArEntryState | "")
          }
          sx={{ minWidth: 150 }}
          renderValue={(v) =>
            (v as string) === "" ? <span className="text-gray-400">Estado</span> : v === "PENDING" ? "Pendiente" : "Pagado"
          }
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="PENDING">Pendiente</MenuItem>
          <MenuItem value="PAID">Pagado</MenuItem>
        </Select>

        {/* Asesor filter */}
        <Select
          size="small"
          displayEmpty
          value={asesorFilter}
          onChange={(e) => setAsesorFilter(e.target.value)}
          sx={{ minWidth: 160 }}
          renderValue={(v) =>
            v === "" ? <span className="text-gray-400">Asesor</span> : (v as string)
          }
        >
          <MenuItem value="">Todos</MenuItem>
          {asesorOptions.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* ── Combined payment bar ──────────────────────────────────────────────── */}
      {selectedEntries.length > 0 && (
        <Box className="bg-white rounded-xl border border-dispofast-primary shadow-sm px-4 py-3 flex items-center justify-between gap-3">
          <Typography variant="body2" className="text-gray-700">
            {selectedEntries.length} factura{selectedEntries.length !== 1 ? "s" : ""} seleccionada
            {selectedEntries.length !== 1 ? "s" : ""}
            {selectedEntries.length === 1 && " (selecciona al menos 2 para un pago combinado)"}
          </Typography>
          <Box className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setSelectedIds(new Set())}>
              Limpiar selección
            </Button>
            <Button
              variant="primary"
              disabled={selectedEntries.length < 2}
              onClick={handleCombinedPayment}
              className="flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Registrar pago combinado
            </Button>
          </Box>
        </Box>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <CustomTable<ArEntry>
        headers={[
          "",
          "Estado",
          "Cliente",
          "Asesor",
          "# Orden",
          "Valor",
          "Factura",
          "Fecha Factura",
          "Días Cartera",
          "Ciudad",
        ]}
        data={loading ? [] : entries}
        renderRow={(entry): (string | JSX.Element)[] => {
          const disabledReason =
            entry.state !== "PENDING"
              ? "Solo se pueden combinar facturas pendientes"
              : selectedClientId && entry.clientId !== selectedClientId
                ? "Un pago combinado solo puede cubrir facturas del mismo cliente"
                : null;

          return [
            <Tooltip key="select" title={disabledReason ?? ""} disableHoverListener={!disabledReason}>
              <span>
                <Checkbox
                  size="small"
                  checked={selectedIds.has(entry.id)}
                  disabled={!!disabledReason}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelected(entry)}
                />
              </span>
            </Tooltip>,
            <StatusBadge
              key="estado"
              status={entry.state}
              configMap={CARTERA_STATUS_CONFIG}
            />,
            <Box key="cliente">
              <p className="text-sm font-medium text-gray-800">
                {entry.clientName}
              </p>
              <p className="text-xs text-gray-400">
                {entry.clientIdentification}
              </p>
            </Box>,
            entry.asesorName ?? "-",
            entry.orderNumber ?? "-",
            formatCurrency(entry.balance ?? entry.value ?? 0),
            entry.invoiceNumber ?? "-",
            formatDate(entry.invoiceDate),
            <DaysBadge
              key="dias"
              dias={entry.diasCartera}
            />,
            entry.cityName ?? "-",
          ];
        }}
        optionsMenu={(entry, closeMenu) => (
          <>
            {entry.invoiceId && (
              <MenuItem
                onClick={() => {
                  closeMenu();
                  handleDownloadInvoice(entry);
                }}
              >
                <ListItemIcon>
                  <Download size={16} />
                </ListItemIcon>
                Descargar factura
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                closeMenu();
                navigate(`/cartera/${entry.id}/recibo`, { state: { entry } });
              }}
            >
              <ListItemIcon>
                <FileText size={16} />
              </ListItemIcon>
                {entry.state === "PENDING" ? "Generar recibo de caja" : "Ver recibo de pago" }
            </MenuItem>
          </>
        )}
        currentPage={currentPage}
        itemsPerPage={pageSize}
        totalItems={totalElements}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Loading overlay */}
      {loading && (
        <Box className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={52} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CarteraPage;
