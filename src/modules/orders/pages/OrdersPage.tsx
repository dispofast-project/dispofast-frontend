import { Box } from "@mui/material";
import { Plus } from "lucide-react";
import CustomTitle from "../../../shared/components/Title/Title";
import { Button } from "../../../shared/components/Button/Button";
import OrdersContent from "../components/OrdersContent/OrdersContent";

const OrdersPage = () => {
  const breadcrumbs = [{ label: "Órdenes de Compra" }];

  return (
    <Box className="flex h-full flex-col space-y-6">
      <Box className="grid grid-cols-2 flex-shrink-0 items-right justify-between">
        <CustomTitle breadcrumbs={breadcrumbs} />
        <Box className="flex items-center justify-end">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
        </Box>
      </Box>

      <Box>
        <OrdersContent />
      </Box>
    </Box>
  );
};

export default OrdersPage;