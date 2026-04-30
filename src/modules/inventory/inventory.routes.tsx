import { Route, Routes } from "react-router-dom"
import ProductDetailPage from "./pages/ProductDetailPage";
import InventoryPage from "./pages/InventoryPage";

const InventoryRoutes = () => {
    return (
        <Routes>
            <Route index element={<InventoryPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
        </Routes>
    );
}

export default InventoryRoutes;