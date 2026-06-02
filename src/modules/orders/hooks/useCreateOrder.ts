import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/order.service";
import { getClientsService, getClientByIdService } from "../../clients/api/clients.api";
import { getAllPriceLists } from "../../pricelist/api/pricelist.api";
import { useNotificationStore } from "../../../shared/store";
import { useSystemParams } from "../../../shared/hooks/useSystemParams";
import type { ClientPreview, ClientResponse } from "../../clients/types";
import type { PaymentCondition, CreateOrderItemDTO } from "../types";
import type { City } from "../../../shared/types/location";
import type { PriceListItem } from "../../pricelist/api/pricelist.api";

export interface OrderItem extends CreateOrderItemDTO {
  productName: string;
  productReference: string;
  taxFree: boolean;
}

const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const seq = Math.floor(100 + Math.random() * 900);
  return `ORD-${year}-${seq}`;
};

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();
  const { IVA, RETEFUENTE_RATE, RETEFUENTE_THRESHOLD } = useSystemParams();

  // ─── Order metadata ────────────────────────────────────────────────────────
  const [orderNumber] = useState<string>(generateOrderNumber);

  // ─── Client search ─────────────────────────────────────────────────────────
  const [clientInputValue, setClientInputValue] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientPreview[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientPreview | null>(null);
  const [isClientSearching, setIsClientSearching] = useState(false);

  // ─── Auto-filled from client ────────────────────────────────────────────────
  const [clientDetail, setClientDetail] = useState<ClientResponse | null>(null);
  const [asesorName, setAsesorName] = useState("");
  const [asesorUserId, setAsesorUserId] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);

  // ─── Shipping ──────────────────────────────────────────────────────────────
  const [shipmentCity, setShipmentCity] = useState<City | null>(null);
  const [zone, setZone] = useState("");
  const [shipmentAddress, setShipmentAddress] = useState("");

  // ─── Payment terms ─────────────────────────────────────────────────────────
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition | "">("");
  const [discountRate, setDiscountRate] = useState("0");
  const [additionalDiscountRate, setAdditionalDiscountRate] = useState("");

  // ─── Financial panel ───────────────────────────────────────────────────────
  const [freight, setFreight] = useState(0);

  // ─── Observations ──────────────────────────────────────────────────────────
  const [observations, setObservations] = useState("");

  // ─── Products ──────────────────────────────────────────────────────────────
  const [items, setItems] = useState<OrderItem[]>([]);

  // ─── Form state ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

  // ─── Load price lists on mount ─────────────────────────────────────────────
  useEffect(() => {
    getAllPriceLists().then(setPriceLists).catch(() => {});
  }, []);

  // ─── Client search effect ──────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    setIsClientSearching(true);

    const delay = clientInputValue.trim() ? 400 : 0;

    const timer = setTimeout(async () => {
      try {
        const res = await getClientsService(0, 50, clientInputValue.trim() || undefined);
        if (active) setClientOptions(res.content);
      } catch {
        // ignore
      } finally {
        if (active) setIsClientSearching(false);
      }
    }, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [clientInputValue]);

  // ─── When client selected, fetch full details to get priceList ────────────
  const handleClientChange = useCallback(
    async (client: ClientPreview | null) => {
      setClientOptions((prev) => (client ? [client, ...prev.filter((c) => c.id !== client.id)] : prev));
      setSelectedClient(client);
      setClientDetail(null);
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
        setClientDetail(full);
        if (full.priceList?.id) setPriceListId(full.priceList.id);
      } catch {
        // ignore, user can select manually
      }
    },
    []
  );

  // ─── Items ─────────────────────────────────────────────────────────────────
  const handleAddProduct = (item: CreateOrderItemDTO & { productName: string; productReference: string; taxFree: boolean }) => {
    setItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, qty: number, price: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: qty, unitPrice: price, lineTotal: qty * price }
          : item
      )
    );
  };

  const subtotal              = items.reduce((acc, it) => acc + it.lineTotal, 0);
  const tax                   = items.reduce((acc, it) => acc + (it.taxFree ? 0 : it.lineTotal * IVA), 0);
  const discountAmt           = subtotal * ((parseInt(discountRate, 10) || 0) / 100);
  const additionalDiscountAmt = subtotal * ((parseFloat(additionalDiscountRate || "0")) / 100);
  const retefuente            =
    clientDetail?.retefuenteApplies && subtotal > RETEFUENTE_THRESHOLD
      ? subtotal * RETEFUENTE_RATE
      : 0;
  const total              = subtotal + tax - discountAmt - additionalDiscountAmt - retefuente + freight;

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
        paymentCondition: paymentCondition || undefined,
        discountRate: parseInt(discountRate, 10) || 0,
        additionalDiscountRate: additionalDiscountRate ? parseFloat(additionalDiscountRate) : undefined,
        freight: freight > 0 ? freight : undefined,
        observations: observations.trim() || undefined,
        items: items.map(({ productName: _pn, productReference: _pr, taxFree: _tf, ...rest }) => rest),
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

  return {
    orderNumber,
    clientInputValue,
    setClientInputValue,
    clientOptions,
    selectedClient,
    isClientSearching,
    clientDetail,
    asesorName,
    priceListId,
    setPriceListId,
    priceLists,
    shipmentCity,
    setShipmentCity,
    zone,
    setZone,
    shipmentAddress,
    setShipmentAddress,
    paymentCondition,
    setPaymentCondition,
    discountRate,
    setDiscountRate,
    additionalDiscountRate,
    setAdditionalDiscountRate,
    items,
    isLoading,
    subtotal,
    tax,
    discountAmt,
    additionalDiscountAmt,
    retefuente,
    freight,
    setFreight,
    observations,
    setObservations,
    total,
    missingFields,
    handleClientChange,
    handleAddProduct,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit,
  };
};
