import { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEditOrder } from "../hooks/useEditOrder";
import { useAuth } from "../../iam/hooks/useAuth";
import { Button } from "../../../shared/components/Button/Button";
import { BackButton } from "../../../shared/components/BackButton/BackButton";
import CustomTitle from "../../../shared/components/Title/Title";
import Dropdown from "../../../shared/components/Dropdown/Dropdown";
import OrderClientDetailCard from "../components/OrderClientDetailCard/OrderClientDetailCard";
import OrderShippingCard from "../components/OrderShippingCard/OrderShippingCard";
import OrderPaymentTermsCard from "../components/OrderPaymentTermsCard/OrderPaymentTermsCard";
import OrderItemsCard from "../components/OrderItemsCard/OrderItemsCard";
import OrderSummaryPanel from "../components/OrderSummaryPanel/OrderSummaryPanel";

const EditOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authorities } = useAuth();
  const canEdit = authorities.includes("PURCHASE_ORDERS_EDIT");
  const order = useEditOrder(id);

  useEffect(() => {
    if (!canEdit) navigate("/no-access", { replace: true });
  }, [canEdit, navigate]);

  if (!canEdit) return null;

  if (order.loading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Box className="w-8 h-8 border-4 border-dispofast-primary border-t-transparent rounded-full animate-spin" />
      </Box>
    );
  }

  if (order.loadError || !order.order) {
    return (
      <Box className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500">{order.loadError ?? "Orden no encontrada"}</p>
        <Button onClick={() => navigate("/ordenes")} variant="primary">Volver a órdenes</Button>
      </Box>
    );
  }

  const isTerminal = order.order.state === "DELIVERED" || order.order.state === "CANCELLED";

  if (isTerminal) {
    return (
      <Box className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500">Esta orden ya fue entregada o cancelada y no puede editarse.</p>
        <Button onClick={() => navigate(`/ordenes/${id}`)} variant="primary">Volver a la orden</Button>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-6 pb-10">
      <Box className="flex items-center gap-5">
        <BackButton onClick={() => navigate(`/ordenes/${id}`)} />
        <CustomTitle
          mainTitle={`Editar Orden ${order.order.orderNumber}`}
          description="Modifica los datos de la orden de compra"
        />
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Box className="lg:col-span-2 flex flex-col gap-5">
          <OrderClientDetailCard client={order.clientDetail} />

          <Box className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
            <Dropdown
              label="Lista de Precios *"
              options={order.priceLists.map((pl) => ({ value: pl.id, label: pl.name }))}
              value={order.priceListId}
              onChange={(v) => order.setPriceListId(v)}
              placeholder="Seleccionar lista..."
              fullWidth
            />
          </Box>

          <OrderShippingCard
            shipmentCity={order.shipmentCity}
            onShipmentCityChange={order.setShipmentCity}
            zone={order.zone}
            onZoneChange={order.setZone}
            shipmentAddress={order.shipmentAddress}
            onShipmentAddressChange={order.setShipmentAddress}
          />
          <OrderPaymentTermsCard
            paymentCondition={order.paymentCondition}
            onPaymentConditionChange={order.setPaymentCondition}
            discountRate={order.discountRate}
            onDiscountRateChange={order.setDiscountRate}
            additionalDiscountRate={order.additionalDiscountRate}
            onAdditionalDiscountRateChange={order.setAdditionalDiscountRate}
            observations={order.observations}
            onObservationsChange={order.setObservations}
          />
          <OrderItemsCard
            priceListId={order.priceListId}
            items={order.items}
            onAddProduct={order.handleAddProduct}
            onRemoveItem={order.handleRemoveItem}
            onUpdateItem={order.handleUpdateItem}
          />
        </Box>

        <OrderSummaryPanel
          selectedClient={order.clientDetail}
          orderNumber={order.order.orderNumber}
          orderDate={new Date(order.order.orderDate)}
          subtotal={order.subtotal}
          tax={order.tax}
          discount={order.discountAmt}
          additionalDiscount={order.additionalDiscountAmt}
          retefuente={order.retefuente}
          freight={order.freight}
          onFreightChange={order.setFreight}
          total={order.total}
          items={order.items}
          missingFields={order.missingFields}
          isLoading={order.isLoading}
          onSubmit={order.handleSubmit}
          submitLabel="Guardar Cambios"
        />
      </Box>
    </Box>
  );
};

export default EditOrderPage;
