import { Route, Routes } from "react-router-dom";
import ShipmentsPage from "./pages/ShipmentsPage";
import ShipmentDetailPage from "./pages/ShipmentDetailPage";

const ShippingRoutes = () => {
  return (
    <Routes>
      {/* Despachos */}
      <Route index element={<ShipmentsPage />} />
      <Route path=":id" element={<ShipmentDetailPage />} />
    </Routes>
  );
};

export default ShippingRoutes;
