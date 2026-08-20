import { useState, useEffect } from "react";
import type { PurchaseOrder, PaymentCondition } from "../types";
import type { RetefuenteType } from "../../clients/types";
import type { User } from "../../iam/types";
import { updatePurchaseOrderService } from "../api/purchases.api";
import { COMMERCIAL_DISCOUNT_OPTIONS } from "../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";

const VALID_COMMERCIAL_RATES = COMMERCIAL_DISCOUNT_OPTIONS.map((o) => o.value);

const snapCommercialRate = (decimalRate: number | null | undefined): string => {
  const r = String(Math.round((decimalRate ?? 0) * 100));
  return VALID_COMMERCIAL_RATES.includes(r as (typeof VALID_COMMERCIAL_RATES)[number]) ? r : "0";
};

interface UsePurchaseOrderEditReturn {
  selectedBuyer: User | null;
  setSelectedBuyer: (user: User | null) => void;
  selectedPaymentCondition: PaymentCondition | "";
  setSelectedPaymentCondition: (value: PaymentCondition | "") => void;
  commercialRate: string;
  setCommercialRate: (value: string) => void;
  otherRate: string;
  setOtherRate: (value: string) => void;
  freight: number;
  setFreight: (value: number) => void;
  retefuenteOverride: RetefuenteType | "";
  setRetefuenteOverride: (value: RetefuenteType | "") => void;
  isSaving: boolean;
  saveError: string | null;
  hasChanges: boolean;
  handleSaveAll: (id: string) => Promise<void>;
}

export function usePurchaseOrderEdit(
  order: PurchaseOrder | null,
  onUpdated: (updated: PurchaseOrder) => void,
): UsePurchaseOrderEditReturn {
  const [selectedBuyer, setSelectedBuyer] = useState<User | null>(null);
  const [selectedPaymentCondition, setSelectedPaymentCondition] = useState<PaymentCondition | "">("");
  const [commercialRate, setCommercialRate] = useState<string>("");
  const [otherRate, setOtherRate] = useState<string>("");
  const [freight, setFreight] = useState<number>(0);
  const [retefuenteOverride, setRetefuenteOverride] = useState<RetefuenteType | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
    if (order.buyerId && order.buyerName) {
      setSelectedBuyer({ id: order.buyerId, name: order.buyerName, email: "", role: "", effectivePermissions: [] });
    }
    setSelectedPaymentCondition(order.paymentCondition ?? "");
    setCommercialRate(snapCommercialRate(order.commercialDiscountRate));
    setOtherRate(String(Math.round((order.otherDiscountsRate ?? 0) * 100)));
    setFreight(order.freight ?? 0);
    setRetefuenteOverride(order.retefuenteTypeOverride ?? "");
  }, [order]);

  const hasChanges =
    order != null &&
    (selectedBuyer?.id !== order.buyerId ||
      (selectedPaymentCondition || null) !== (order.paymentCondition ?? null) ||
      commercialRate !== snapCommercialRate(order.commercialDiscountRate) ||
      otherRate !== String(Math.round((order.otherDiscountsRate ?? 0) * 100)) ||
      freight !== (order.freight ?? 0) ||
      (retefuenteOverride || null) !== (order.retefuenteTypeOverride ?? null));

  const handleSaveAll = async (id: string) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updatePurchaseOrderService(id, {
        buyerId: selectedBuyer?.id,
        paymentCondition: selectedPaymentCondition || undefined,
        commercialDiscountRate: commercialRate !== "" ? parseFloat(commercialRate) / 100 : 0,
        otherDiscountsRate: otherRate !== "" ? parseFloat(otherRate) / 100 : 0,
        freight,
        retefuenteTypeOverride: retefuenteOverride || undefined,
      } as Parameters<typeof updatePurchaseOrderService>[1]);
      onUpdated(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedBuyer,
    setSelectedBuyer,
    selectedPaymentCondition,
    setSelectedPaymentCondition,
    commercialRate,
    setCommercialRate,
    otherRate,
    setOtherRate,
    freight,
    setFreight,
    retefuenteOverride,
    setRetefuenteOverride,
    isSaving,
    saveError,
    hasChanges,
    handleSaveAll,
  };
}
