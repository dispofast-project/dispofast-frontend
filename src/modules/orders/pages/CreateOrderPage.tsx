import { Box, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button/Button";
import { useCreateOrder } from "../hooks/useCreateOrder";
import OrderClientCard from "../components/OrderClientCard/OrderClientCard";
import OrderShippingCard from "../components/OrderShippingCard/OrderShippingCard";
import OrderPaymentTermsCard from "../components/OrderPaymentTermsCard/OrderPaymentTermsCard";
import OrderItemsCard from "../components/OrderItemsCard/OrderItemsCard";
import OrderSummaryPanel from "../components/OrderSummaryPanel/OrderSummaryPanel";

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const order = useCreateOrder();

  return (
    <Box className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <Box>
        <Button variant="tertiary" onClick={() => navigate("/ordenes")} className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Typography variant="h5" className="font-bold text-gray-800">Nueva Orden de Compra</Typography>
        <Typography variant="body2" color="text.secondary">Completa los datos para registrar una nueva orden</Typography>
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
          />
          <OrderItemsCard
            items={order.items}
            onAddProduct={order.handleAddProduct}
            onRemoveItem={order.handleRemoveItem}
          />
        </Box>

        <OrderSummaryPanel
          selectedClient={order.selectedClient}
          orderNumber={order.orderNumber}
          subtotal={order.subtotal}
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
