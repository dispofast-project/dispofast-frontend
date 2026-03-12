import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import LoginPage from "../modules/iam/pages/LoginPage";
import { MainLayout } from "./layout/MainLayout";
import { ProtectedRoute } from "../modules/iam/components/ProtectedRoute/ProtectedRoute";
import IamRoutes from "../modules/iam/IamRoutes";
import OrdersRoutes from "../modules/orders/OrdersRoutes";
import QuotesPage from "../modules/quotes/pages/QuotesPage";
import QuoteDetailPage from "../modules/quotes/pages/QuoteDetailPage";
import ClientsPage from "../modules/clients/pages/ClientsPage";
import ClientDetailsPage from "../modules/clients/pages/ClientDetailsPage";
import CreateClientPage from "../modules/clients/pages/CreateClientPage";

const NotFound = (): ReactElement => <div>Not Found</div>;

const AppRouter = (): ReactElement => {
  return (
    <Routes>
      {/* Rutas sin layout */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/no-access" element={<div>No Access</div>} />

      {/* Rutas con layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Dashboard
                </h1>
                <div className="bg-white rounded-lg shadow p-6">
                  <p>Contenido del dashboard</p>
                </div>
              </div>
            }
          />
          <Route path="/cotizaciones" element={<QuotesPage />} />
          <Route path="/cotizaciones/:id" element={<QuoteDetailPage />} />
          <Route
            path="/cartera"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Cartera
                </h1>
              </div>
            }
          />
          <Route
            path="/inventario"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Inventario
                </h1>
              </div>
            }
          />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/clientes/nuevo" element={<CreateClientPage />} />
          <Route path="/clientes/:id" element={<ClientDetailsPage />} />
          <Route
            path="/despachos"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Despachos
                </h1>
              </div>
            }
          />
          <Route
            path="/configuracion"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Configuración
                </h1>
              </div>
            }
          />
          <Route path="/usuarios/*" element={<IamRoutes />} />
          <Route path="/ordenes/*" element={<OrdersRoutes />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
