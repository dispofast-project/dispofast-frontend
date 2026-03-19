import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ArrowLeft,
  User,
  MapPin,
  ShoppingCart,
  Plus,
  Trash2,
  AlertCircle,
  Circle,
} from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import Dropdown from "../../../shared/components/Dropdown/Dropdown";
import { Input } from "../../../shared/components/Input/Input";
import { CityAutocomplete } from "../../../shared/components/CityAutocomplete/CityAutocomplete";
import AddProductDialog from "../components/AddProductDialog/AddProductDialog";
import { createOrder } from "../api/order.service";
import { getClientsService, getClientByIdService } from "../../clients/api/clients.api";
import { getAllPriceLists } from "../../pricelist/api/pricelist.api";
import { useNotificationStore } from "../../../shared/store";
import type { ClientPreview } from "../../clients/types";
import type { City } from "../../../shared/types/location";
import type { CreateOrderItemDTO } from "../types";
import type { PriceListItem } from "../../pricelist/api/pricelist.api";

interface OrderItem extends CreateOrderItemDTO {
  productName: string;
}

const ZONE_OPTIONS = [
  { value: "norte", label: "Zona Norte" },
  { value: "sur", label: "Zona Sur" },
  { value: "oriente", label: "Zona Oriente" },
  { value: "occidente", label: "Zona Occidente" },
  { value: "centro", label: "Zona Centro" },
];

const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const seq = Math.floor(100 + Math.random() * 900);
  return `ORD-${year}-${seq}`;
};

const formatCurrency = (value: number): string =>
  `$${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

const formatDate = (date: Date): string =>
  date.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();

  // ─── Order metadata ────────────────────────────────────────────────────────
  const [orderNumber] = useState<string>(generateOrderNumber);

  // ─── Client search ─────────────────────────────────────────────────────────
  const [clientInputValue, setClientInputValue] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientPreview[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientPreview | null>(null);
  const [isClientSearching, setIsClientSearching] = useState(false);

  // ─── Auto-filled from client ────────────────────────────────────────────────
  const [asesorName, setAsesorName] = useState("");
  const [asesorUserId, setAsesorUserId] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);

  // ─── Shipping ──────────────────────────────────────────────────────────────
  const [shipmentCity, setShipmentCity] = useState<City | null>(null);
  const [zone, setZone] = useState("");
  const [shipmentAddress, setShipmentAddress] = useState("");

  // ─── Products ──────────────────────────────────────────────────────────────
  const [items, setItems] = useState<OrderItem[]>([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  // ─── Form state ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

  // ─── Load price lists on mount ─────────────────────────────────────────────
  useEffect(() => {
    getAllPriceLists().then(setPriceLists).catch(() => {});
  }, []);

  // ─── Client search effect ──────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    if (clientInputValue.trim().length < 2) {
      setClientOptions(selectedClient ? [selectedClient] : []);
      return undefined;
    }

    setIsClientSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await getClientsService(0, 20, clientInputValue);
        if (active) setClientOptions(res.content);
      } catch {
        // ignore
      } finally {
        if (active) setIsClientSearching(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [clientInputValue, selectedClient]);

  // ─── When client selected, fetch full details to get priceList ────────────
  const handleClientChange = useCallback(
    async (client: ClientPreview | null) => {
      setSelectedClient(client);
      setAsesorName("");
      setAsesorUserId("");
      setPriceListId("");

      if (!client) return;

      if (client.defaultAdvisor) {
        setAsesorName(client.defaultAdvisor.fullName);
        setAsesorUserId(client.defaultAdvisor.id);
      }

      try {
        const full = await getClientByIdService(client.id);
        if (full.priceList?.id) setPriceListId(full.priceList.id);
      } catch {
        // ignore, user can select manually
      }
    },
    []
  );

  // ─── Items ─────────────────────────────────────────────────────────────────
  const handleAddProduct = (item: OrderItem) => {
    setItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, it) => acc + it.lineTotal, 0);

  // ─── Validation ────────────────────────────────────────────────────────────
  const missingFields: string[] = [];
  if (!selectedClient) missingFields.push("Cliente");
  if (!asesorUserId) missingFields.push("Asesor comercial");
  if (!priceListId) missingFields.push("Lista de precios");
  if (!shipmentCity) missingFields.push("Ciudad de envío");
  if (!shipmentAddress.trim()) missingFields.push("Dirección de entrega");
  if (items.length === 0) missingFields.push("Al menos un producto");

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (missingFields.length > 0) {
      showNotification("Completa los campos requeridos antes de crear la orden.", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        orderNumber,
        clientId: selectedClient!.id,
        asesorUserId,
        orderDate: new Date().toISOString(),
        shipmentCityId: shipmentCity!.code,
        shipmentAddress: shipmentAddress.trim(),
        zone: zone || undefined,
        priceListId,
        items: items.map(({ productName: _pn, ...rest }) => rest),
      };

      const created = await createOrder(payload);
      showNotification("Orden creada exitosamente", "success");
      navigate(`/ordenes/${created.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr.response?.data?.message || axiosErr.message || "Error al crear la orden";
      showNotification(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex flex-col gap-6 pb-10">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box>
        <Button
          variant="tertiary"
          onClick={() => navigate("/ordenes")}
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <Typography variant="h5" className="font-bold text-gray-800">
          Nueva Orden de Compra
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completa los datos para registrar una nueva orden
        </Typography>
      </Box>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── Left column (main content) ──────────────────────────────────── */}
        <Box className="lg:col-span-2 flex flex-col gap-5">

          {/* Client card */}
          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-dispofast-primary" />
              </Box>
              <Box>
                <Typography variant="body1" className="font-semibold text-gray-800">
                  Información del Cliente
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Selecciona el cliente y el asesor de esta orden
                </Typography>
              </Box>
            </Box>

            <Box className="px-6 py-5 flex flex-col gap-4">
              <Autocomplete
                size="small"
                fullWidth
                options={clientOptions}
                getOptionLabel={(opt) => opt.name}
                filterOptions={(x) => x}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={selectedClient}
                noOptionsText={
                  isClientSearching
                    ? "Buscando..."
                    : clientInputValue.length < 2
                    ? "Escribe al menos 2 caracteres"
                    : "No se encontraron clientes"
                }
                onChange={(_e, newVal) => {
                  setClientOptions(newVal ? [newVal, ...clientOptions] : clientOptions);
                  handleClientChange(newVal);
                }}
                onInputChange={(_e, val, reason) => {
                  if (reason === "input" || reason === "clear") setClientInputValue(val);
                }}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente *"
                    placeholder="Buscar por nombre o NIT..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isClientSearching ? (
                            <CircularProgress color="inherit" size={18} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, opt) => (
                  <li {...props} key={opt.id}>
                    <Box>
                      <Typography variant="body2" className="font-medium">
                        {opt.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {opt.identificationNumber}
                      </Typography>
                    </Box>
                  </li>
                )}
              />

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Asesor Comercial"
                  value={asesorName}
                  readOnly
                  placeholder="Se asigna al seleccionar cliente"
                  onChange={() => {}}
                />
                <Dropdown
                  label="Lista de Precios *"
                  options={priceLists.map((pl) => ({ value: pl.id, label: pl.name }))}
                  value={priceListId}
                  onChange={(v) => setPriceListId(v)}
                  placeholder="Seleccionar lista..."
                  fullWidth
                />
              </Box>
            </Box>
          </Box>

          {/* Shipping card */}
          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-dispofast-primary" />
              </Box>
              <Box>
                <Typography variant="body1" className="font-semibold text-gray-800">
                  Información de Envío
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Datos del lugar de entrega de la orden
                </Typography>
              </Box>
            </Box>

            <Box className="px-6 py-5 flex flex-col gap-4">
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CityAutocomplete
                  value={shipmentCity}
                  onChange={setShipmentCity}
                  required
                  label="Ciudad de Envío *"
                />
                <Dropdown
                  label="Zona"
                  options={ZONE_OPTIONS}
                  value={zone}
                  onChange={(v) => setZone(v)}
                  placeholder="Seleccionar zona..."
                  fullWidth
                />
              </Box>

              <Input
                label="Dirección de Entrega *"
                value={shipmentAddress}
                onChange={(e) => setShipmentAddress(e.target.value)}
                placeholder="Ej: Calle 123 #45-67, Piso 2, Bodega 3"
              />
            </Box>
          </Box>

          {/* Products card */}
          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-dispofast-primary" />
                </Box>
                <Box>
                  <Typography variant="body1" className="font-semibold text-gray-800">
                    Productos de la Orden
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Selecciona y configura los ítems de esta orden
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="primary"
                onClick={() => setProductDialogOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </Button>
            </Box>

            {items.length === 0 ? (
              <Box className="flex flex-col items-center justify-center py-14 gap-3">
                <Box className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-gray-400" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No hay productos agregados
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Haz clic en "Agregar Producto" para comenzar
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box className="grid grid-cols-12 px-6 py-2 bg-gray-50 border-b border-gray-100">
                  <Typography variant="caption" className="col-span-4 font-semibold text-gray-500 uppercase tracking-wide">
                    Producto
                  </Typography>
                  <Typography variant="caption" className="col-span-2 font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Cant.
                  </Typography>
                  <Typography variant="caption" className="col-span-2 font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Precio Unit.
                  </Typography>
                  <Typography variant="caption" className="col-span-2 font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Descuento
                  </Typography>
                  <Typography variant="caption" className="col-span-2 font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Total
                  </Typography>
                </Box>

                {items.map((item, idx) => (
                  <Box
                    key={idx}
                    className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 items-center hover:bg-gray-50 group"
                  >
                    <Typography variant="body2" className="col-span-4 font-medium text-gray-800">
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" className="col-span-2 text-right text-gray-700">
                      {item.quantity}
                    </Typography>
                    <Typography variant="body2" className="col-span-2 text-right text-gray-700">
                      {formatCurrency(item.unitPrice)}
                    </Typography>
                    <Typography variant="body2" className="col-span-2 text-right text-gray-700">
                      {item.discount ? `${item.discount}%` : "-"}
                    </Typography>
                    <Box className="col-span-2 flex items-center justify-end gap-2">
                      <Typography variant="body2" className="font-semibold text-gray-800">
                        {formatCurrency(item.lineTotal)}
                      </Typography>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Box>
                  </Box>
                ))}

                <Box className="flex items-center justify-between px-6 py-3 bg-gray-50">
                  <Typography variant="body2" className="font-semibold text-gray-700">
                    Subtotal
                  </Typography>
                  <Typography variant="body2" className="font-bold text-gray-800">
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Right column (summary panel) ──────────────────────────────────── */}
        <Box className="lg:col-span-1 sticky top-4">
          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Box className="px-5 py-4 border-b border-gray-100">
              <Typography variant="body1" className="font-bold text-gray-800">
                Resumen de la Orden
              </Typography>
            </Box>

            <Box className="px-5 py-4 flex flex-col gap-4">
              {/* Client display */}
              <Box>
                <Typography variant="caption" className="font-semibold text-gray-400 uppercase tracking-wide">
                  Cliente
                </Typography>
                {selectedClient ? (
                  <Box className="mt-1 p-2.5 bg-blue-50 rounded-lg">
                    <Typography variant="body2" className="font-semibold text-dispofast-primary">
                      {selectedClient.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {selectedClient.identificationNumber}
                    </Typography>
                  </Box>
                ) : (
                  <Box className="mt-1 p-2.5 bg-gray-50 rounded-lg">
                    <Typography variant="body2" className="text-gray-400 text-center text-sm">
                      Sin cliente seleccionado
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Order metadata */}
              <Box className="flex flex-col gap-2.5">
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">Nº Orden</Typography>
                  <Typography variant="body2" className="font-bold text-gray-800">
                    {orderNumber}
                  </Typography>
                </Box>
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">Fecha</Typography>
                  <Typography variant="body2" className="font-medium text-gray-700">
                    {formatDate(new Date())}
                  </Typography>
                </Box>
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">Estado</Typography>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    Creada
                  </span>
                </Box>
              </Box>

              <Divider />

              {/* Totals */}
              <Box className="flex flex-col gap-2">
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">Productos</Typography>
                  <Typography variant="body2" className="font-medium text-gray-700">
                    {items.length} {items.length === 1 ? "ítem" : "ítems"}
                  </Typography>
                </Box>
                <Box className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-500">Subtotal</Typography>
                  <Typography variant="body2" className="font-medium text-gray-700">
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box className="flex items-center justify-between">
                <Typography variant="body1" className="font-bold text-gray-800">
                  Total Orden
                </Typography>
                <Typography
                  variant="h6"
                  className="font-bold"
                  sx={{ color: "var(--dispofast-primary)" }}
                >
                  {formatCurrency(subtotal)}
                </Typography>
              </Box>

              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={missingFields.length > 0 || isLoading}
                className="w-full justify-center"
              >
                Crear Orden
              </Button>

              {missingFields.length > 0 && (
                <Box className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <Box className="flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <Typography variant="caption" className="font-semibold text-amber-700">
                      Campos requeridos
                    </Typography>
                  </Box>
                  <Box className="flex flex-col gap-1">
                    {missingFields.map((field) => (
                      <Box key={field} className="flex items-center gap-1.5">
                        <Circle className="w-2 h-2 text-amber-500" fill="currentColor" />
                        <Typography variant="caption" className="text-amber-700">
                          {field}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <AddProductDialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        onAdd={handleAddProduct}
      />
    </Box>
  );
};

export default CreateOrderPage;
