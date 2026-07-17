import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "../hooks/useCreateOrder";
import OrderClientCard from "../components/OrderClientCard/OrderClientCard";
import OrderShippingCard from "../components/OrderShippingCard/OrderShippingCard";
import OrderPaymentTermsCard from "../components/OrderPaymentTermsCard/OrderPaymentTermsCard";
import OrderItemsCard from "../components/OrderItemsCard/OrderItemsCard";
import OrderSummaryPanel from "../components/OrderSummaryPanel/OrderSummaryPanel";
import { BackButton } from "../../../shared/components/BackButton/BackButton";
import CustomTitle from "../../../shared/components/Title/Title";

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const order = useCreateOrder();

  return (
    <Box className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <Box className="flex items-center gap-5">
        <BackButton onClick={() => navigate("/ordenes")} />
        <CustomTitle mainTitle="Nueva Orden de Compra" description="Completa los datos para registrar una nueva orden" />
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Box className="lg:col-span-2 flex flex-col gap-5">
          <OrderClientCard
            selectedClient={order.selectedClient}
            clientDetail={order.clientDetail}
            clientOptions={order.clientOptions}
            clientInputValue={order.clientInputValue}
            isClientSearching={order.isClientSearching}
            onClientInputChange={order.setClientInputValue}
            onClientChange={order.handleClientChange}
            asesorName={order.asesorName}
            priceListId={order.priceListId}
            onPriceListChange={order.setPriceListId}
            priceLists={order.priceLists}
          />
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
            clientId={order.selectedClient?.id}
            items={order.items}
            onAddProduct={order.handleAddProduct}
            onRemoveItem={order.handleRemoveItem}
            onUpdateItem={order.handleUpdateItem}
          />
        </Box>

        <OrderSummaryPanel
          selectedClient={order.selectedClient}
          orderNumber={order.orderNumber}
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
        />
      </Box>
    </Box>
  );
};

export default CreateOrderPage;
