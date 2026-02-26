import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import LoginPage from "../modules/iam/pages/LoginPage";
import { MainLayout } from "./layout/MainLayout";
import { ProtectedRoute } from "../modules/iam/components/ProtectedRoute/ProtectedRoute";
import QuotesPage from "../modules/quotes/pages/QuotesPage";
import QuoteDetailPage from "../modules/quotes/pages/QuoteDetailPage";

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
          <Route
            path="/ordenes"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Órdenes
                </h1>
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
          <Route
            path="/clientes"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Clientes
                </h1>
              </div>
            }
          />
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
          <Route
            path="/users"
            element={
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Users</h1>
              </div>
            }
          />
        </Route>

        <Route path="/404" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
