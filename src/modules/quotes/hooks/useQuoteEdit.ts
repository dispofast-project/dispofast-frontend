import { useState, useEffect } from "react";
import type { Quote, PaymentCondition, OfferValidity } from "../types";
import type { RetefuenteType } from "../../clients/types";
import type { User } from "../../iam/types";
import { updateQuoteService } from "../api/quotes.api";
import { COMMERCIAL_DISCOUNT_OPTIONS } from "../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";

const VALID_COMMERCIAL_RATES = COMMERCIAL_DISCOUNT_OPTIONS.map((o) => o.value);

const snapCommercialRate = (decimalRate: number | null | undefined): string => {
  const r = String(Math.round((decimalRate ?? 0) * 100));
  return VALID_COMMERCIAL_RATES.includes(r as (typeof VALID_COMMERCIAL_RATES)[number]) ? r : "0";
};

interface UseQuoteEditReturn {
  selectedSeller: User | null;
  setSelectedSeller: (user: User | null) => void;
  selectedPriceListId: string;
  setSelectedPriceListId: (id: string) => void;
  selectedPaymentCondition: PaymentCondition | "";
  setSelectedPaymentCondition: (value: PaymentCondition | "") => void;
  selectedOfferValidity: OfferValidity | "";
  setSelectedOfferValidity: (value: OfferValidity | "") => void;
  commercialRate: string;
  setCommercialRate: (value: string) => void;
  otherRate: string;
  setOtherRate: (value: string) => void;
  freight: number;
  setFreight: (value: number) => void;
  shipmentAddress: string;
  setShipmentAddress: (value: string) => void;
  retefuenteOverride: RetefuenteType | "";
  setRetefuenteOverride: (value: RetefuenteType | "") => void;
  backorder: boolean;
  setBackorder: (value: boolean) => void;
  isSaving: boolean;
  saveError: string | null;
  hasChanges: boolean;
  handleSaveAll: (id: string) => Promise<void>;
}

export function useQuoteEdit(
  quote: Quote | null,
  onUpdated: (updated: Quote) => void,
): UseQuoteEditReturn {
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [selectedPriceListId, setSelectedPriceListId] = useState<string>("");
  const [selectedPaymentCondition, setSelectedPaymentCondition] = useState<PaymentCondition | "">("");
  const [selectedOfferValidity, setSelectedOfferValidity] = useState<OfferValidity | "">("");
  const [commercialRate, setCommercialRate] = useState<string>("");
  const [otherRate, setOtherRate] = useState<string>("");
  const [freight, setFreight] = useState<number>(0);
  const [shipmentAddress, setShipmentAddress] = useState<string>("");
  const [retefuenteOverride, setRetefuenteOverride] = useState<RetefuenteType | "">("");
  const [backorder, setBackorder] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!quote) return;
    setSelectedPriceListId(quote.priceList?.id ?? "");
    if (quote.sellerId && quote.sellerName) {
      setSelectedSeller({ id: quote.sellerId, name: quote.sellerName, email: "", role: "", effectivePermissions: [] });
    }
    setSelectedPaymentCondition(quote.paymentCondition ?? "");
    setSelectedOfferValidity(quote.offerValidity ?? "");
    setCommercialRate(snapCommercialRate(quote.commercialDiscountRate));
    setOtherRate(String(Math.round((quote.otherDiscountsRate ?? 0) * 100)));
    setFreight(quote.freight ?? 0);
    setShipmentAddress(quote.shipmentAddress ?? "");
    setRetefuenteOverride(quote.retefuenteTypeOverride ?? "");
    setBackorder(quote.backorder ?? false);
  }, [quote]);

  const hasChanges =
    quote != null &&
    (selectedSeller?.id !== quote.sellerId ||
      selectedPriceListId !== (quote.priceList?.id ?? "") ||
      (selectedPaymentCondition || null) !== (quote.paymentCondition ?? null) ||
      (selectedOfferValidity || null) !== (quote.offerValidity ?? null) ||
      commercialRate !== snapCommercialRate(quote.commercialDiscountRate) ||
      otherRate !== String(Math.round((quote.otherDiscountsRate ?? 0) * 100)) ||
      freight !== (quote.freight ?? 0) ||
      shipmentAddress !== (quote.shipmentAddress ?? "") ||
      (retefuenteOverride || null) !== (quote.retefuenteTypeOverride ?? null) ||
      backorder !== (quote.backorder ?? false));

  const handleSaveAll = async (id: string) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateQuoteService(id, {
        sellerId: selectedSeller?.id,
        priceListId: selectedPriceListId || undefined,
        paymentCondition: selectedPaymentCondition || undefined,
        offerValidity: selectedOfferValidity || undefined,
        commercialDiscountRate: commercialRate !== "" ? parseFloat(commercialRate) / 100 : 0,
        otherDiscountsRate: otherRate !== "" ? parseFloat(otherRate) / 100 : 0,
        freight,
        shipmentAddress,
        retefuenteTypeOverride: retefuenteOverride || undefined,
        backorder,
      } as Parameters<typeof updateQuoteService>[1]);
      onUpdated(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedSeller,
    setSelectedSeller,
    selectedPriceListId,
    setSelectedPriceListId,
    selectedPaymentCondition,
    setSelectedPaymentCondition,
    selectedOfferValidity,
    setSelectedOfferValidity,
    commercialRate,
    setCommercialRate,
    otherRate,
    setOtherRate,
    freight,
    setFreight,
    shipmentAddress,
    setShipmentAddress,
    retefuenteOverride,
    setRetefuenteOverride,
    backorder,
    setBackorder,
    isSaving,
    saveError,
    hasChanges,
    handleSaveAll,
  };
}
