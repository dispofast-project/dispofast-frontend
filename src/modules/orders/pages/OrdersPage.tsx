import { Box } from "@mui/material";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomTitle from "../../../shared/components/Title/Title";
import { Button } from "../../../shared/components/Button/Button";
import OrdersContent from "../components/OrdersContent/OrdersContent";

const OrdersPage = () => {
  const navigate = useNavigate();

  return (
    <Box className="flex h-full flex-col space-y-6">
      <Box className="grid grid-cols-2 flex-shrink-0 items-right justify-between">
        <CustomTitle mainTitle="Órdenes de compra" description="Gestiona las órdenes de compra de los clientes" />

        <Box className="flex items-center justify-end">
          <Button variant="primary" onClick={() => navigate("/ordenes/nuevo")}>
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