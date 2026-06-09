import type { JSX } from "react";
import {
  Box,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  Select,
  TextField,
  Skeleton,
} from "@mui/material";
import {
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Wallet,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../shared/components/Card/StatCard";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import { Button } from "../../../shared/components/Button/Button";
import { useCartera } from "../hooks/useCartera";
import { CARTERA_STATUS_CONFIG } from "../config/statusConfig";
import { type ArEntry, type ArEntryState } from "../types";
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

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <CustomTable<ArEntry>
        headers={[
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
          return [
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
