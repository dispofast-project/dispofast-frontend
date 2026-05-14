import { Route, Routes } from "react-router-dom"
import ProductDetailPage from "./pages/ProductDetailPage";
import InventoryPage from "./pages/InventoryPage";
import AddProductPage from "./pages/AddProductPage";

const InventoryRoutes = () => {
    return (
        <Routes>
            <Route index element={<InventoryPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/nuevo" element={<AddProductPage/>} />
        </Routes>
    );
}

export default InventoryRoutes;