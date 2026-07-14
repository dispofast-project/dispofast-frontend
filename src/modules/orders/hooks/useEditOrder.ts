import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../api/order.service";
import { getClientByIdService } from "../../clients/api/clients.api";
import { getCityByCodeService } from "../../clients/api/locations.api";
import { getAllPriceLists } from "../../pricelist/api/pricelist.api";
import { useNotificationStore } from "../../../shared/store";
import { useSystemParams } from "../../../shared/hooks/useSystemParams";
import type { ClientResponse } from "../../clients/types";
import type { PaymentCondition, SalesOrder } from "../types";
import type { City } from "../../../shared/types/location";
import type { PriceListItem } from "../../pricelist/api/pricelist.api";
import type { OrderItem } from "./useCreateOrder";

export const useEditOrder = (id: string | undefined) => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();
  const { IVA, RETEFUENTE_RATE, RETEFUENTE_THRESHOLD } = useSystemParams();

  // ─── Order load ──────────────────────────────────────────────────────────
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [clientDetail, setClientDetail] = useState<ClientResponse | null>(null);

  // ─── Editable fields ───────────────────────────────────────────────────────
  const [priceListId, setPriceListId] = useState("");
  const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);
  const [shipmentCity, setShipmentCity] = useState<City | null>(null);
  const [zone, setZone] = useState("");
  const [shipmentAddress, setShipmentAddress] = useState("");
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition | "">("");
  const [discountRate, setDiscountRate] = useState("0");
  const [additionalDiscountRate, setAdditionalDiscountRate] = useState("");
  const [freight, setFreight] = useState(0);
  const [observations, setObservations] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllPriceLists().then(setPriceLists).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setLoadError(null);

    (async () => {
      try {
        const data = await getOrderById(id);
        if (!active) return;
        setOrder(data);
        setPriceListId(data.priceListId ?? "");
        setZone(data.zone ?? "");
        setShipmentAddress(data.shipmentAddress ?? "");
        setPaymentCondition(data.paymentCondition ?? "");
        setDiscountRate(String(data.discountRate ?? 0));
        setAdditionalDiscountRate(
          data.additionalDiscountRate ? String(data.additionalDiscountRate) : ""
        );
        setFreight(data.freight ?? 0);
        setObservations(data.observations ?? "");
        setItems(
          data.items.map((it) => ({
            productId: it.productId,
            productName: it.productName,
            productReference: it.productReference,
            taxFree: it.taxFree,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            discount: it.discount,
            lineTotal: it.lineTotal,
          }))
        );

        getClientByIdService(data.clientId)
          .then((c) => active && setClientDetail(c))
          .catch(() => {});

        if (data.shipmentCityId) {
          getCityByCodeService(data.shipmentCityId)
            .then((city) => active && setShipmentCity(city))
            .catch(() => {});
        }
      } catch {
        if (active) setLoadError("Error al cargar la orden");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  // ─── Items ─────────────────────────────────────────────────────────────────
  const handleAddProduct = useCallback((item: OrderItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpdateItem = useCallback((index: number, qty: number, price: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: qty, unitPrice: price, lineTotal: qty * price } : item
      )
    );
  }, []);

  const subtotal = items.reduce((acc, it) => acc + it.lineTotal, 0);
  const tax = items.reduce((acc, it) => acc + (it.taxFree ? 0 : it.lineTotal * IVA), 0);
  const discountAmt = subtotal * ((parseInt(discountRate, 10) || 0) / 100);
  const additionalDiscountAmt = subtotal * (parseFloat(additionalDiscountRate || "0") / 100);
  const retefuente =
    clientDetail?.retefuenteApplies && subtotal > RETEFUENTE_THRESHOLD
      ? subtotal * RETEFUENTE_RATE
      : 0;
  const total = subtotal + tax - discountAmt - additionalDiscountAmt - retefuente + freight;

  // ─── Validation ────────────────────────────────────────────────────────────
  const missingFields: string[] = [];
  if (!priceListId) missingFields.push("Lista de precios");
  if (!shipmentCity) missingFields.push("Ciudad de envío");
  if (!shipmentAddress.trim()) missingFields.push("Dirección de entrega");
  if (items.length === 0) missingFields.push("Al menos un producto");

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!id) return;
    if (missingFields.length > 0) {
      showNotification("Completa los campos requeridos antes de guardar la orden.", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        shipmentCityId: shipmentCity!.code,
        shipmentAddress: shipmentAddress.trim(),
        zone: zone || undefined,
        priceListId,
        paymentCondition: paymentCondition || undefined,
        discountRate: parseInt(discountRate, 10) || 0,
        additionalDiscountRate: additionalDiscountRate ? parseFloat(additionalDiscountRate) : undefined,
        freight: freight > 0 ? freight : undefined,
        observations: observations.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          lineTotal: item.lineTotal,
        })),
      };

      await updateOrder(id, payload);
      showNotification("Orden actualizada exitosamente", "success");
      navigate(`/ordenes/${id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr.response?.data?.message || axiosErr.message || "Error al actualizar la orden";
      showNotification(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    order,
    loading,
    loadError,
    clientDetail,
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
    handleAddProduct,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit,
  };
};
