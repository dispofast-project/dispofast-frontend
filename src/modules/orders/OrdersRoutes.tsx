import { Route, Routes } from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CreateOrderPage from "./pages/CreateOrderPage";

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route index element={<OrdersPage />} />
      <Route path="nuevo" element={<CreateOrderPage />} />
      <Route path=":id" element={<OrderDetailPage />} />
    </Routes>
  );
};

export default OrdersRoutes;
