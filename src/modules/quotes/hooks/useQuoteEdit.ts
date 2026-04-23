import { useState, useEffect } from "react";
import type { Quote, PaymentCondition, OfferValidity } from "../types";
import type { User } from "../../iam/types";
import { updateQuoteService } from "../api/quotes.api";

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
    setCommercialRate(String(Math.round((quote.commercialDiscountRate ?? 0) * 100)));
    setOtherRate(String(Math.round((quote.otherDiscountsRate ?? 0) * 100)));
  }, [quote]);

  const hasChanges =
    quote != null &&
    (selectedSeller?.id !== quote.sellerId ||
      selectedPriceListId !== (quote.priceList?.id ?? "") ||
      (selectedPaymentCondition || null) !== (quote.paymentCondition ?? null) ||
      (selectedOfferValidity || null) !== (quote.offerValidity ?? null) ||
      commercialRate !== String(Math.round((quote.commercialDiscountRate ?? 0) * 100)) ||
      otherRate !== String(Math.round((quote.otherDiscountsRate ?? 0) * 100)));

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
    isSaving,
    saveError,
    hasChanges,
    handleSaveAll,
  };
}
