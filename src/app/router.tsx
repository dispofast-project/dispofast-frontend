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
import CarteraPage from "../modules/cartera/pages/CarteraPage";
import InventoryPage from "../modules/inventory/pages/InventoryPage";

const NotFound = (): ReactElement => <div>Not Found</div>;

const AppRouter = (): ReactElement => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/no-access" element={<div>No Access</div>} />

      {/* Rutas protegidas con layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard: accesible para cualquier usuario autenticado */}
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

          {/* Cotizaciones */}
          <Route element={<ProtectedRoute requiredAuthorities={["QUOTES_VIEW"]} />}>
            <Route path="/cotizaciones" element={<QuotesPage />} />
            <Route path="/cotizaciones/nuevo/:clientId" element={<QuoteDetailPage mode="create" />} />
            <Route path="/cotizaciones/:id" element={<QuoteDetailPage mode="edit" />} />
          </Route>

          {/* Cartera / Cuentas */}
          <Route element={<ProtectedRoute requiredAuthorities={["ACCOUNTS_VIEW"]} />}>
            <Route path="/cartera" element={<CarteraPage />} />
          </Route>

          {/* Inventario */}
          <Route element={<ProtectedRoute requiredAuthorities={["INVENTORY_VIEW"]} />}>
            <Route path="/inventario" element={<InventoryPage />} />
          </Route>

          {/* Clientes */}
          <Route element={<ProtectedRoute requiredAuthorities={["CUSTOMERS_VIEW"]} />}>
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/clientes/:id" element={<ClientDetailsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredAuthorities={["CUSTOMERS_CREATE"]} />}>
            <Route path="/clientes/nuevo" element={<CreateClientPage />} />
          </Route>

          {/* Despachos / Órdenes de compra */}
          <Route element={<ProtectedRoute requiredAuthorities={["PURCHASE_ORDERS_VIEW"]} />}>
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
          </Route>

          {/* Configuración: solo ADMIN */}
          <Route element={<ProtectedRoute requiredAuthorities={["ROLE_ADMIN"]} />}>
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
          </Route>

          {/* Gestión de usuarios: solo ADMIN */}
          <Route element={<ProtectedRoute requiredAuthorities={["IAM_VIEW"]} />}>
            <Route path="/usuarios/*" element={<IamRoutes />} />
          </Route>

          {/* Órdenes */}
          <Route element={<ProtectedRoute requiredAuthorities={["QUOTES_VIEW"]} />}>
            <Route path="/ordenes/*" element={<OrdersRoutes />} />
          </Route>
          
          <Route element={<ProtectedRoute requiredAuthorities={["PRICE_LISTS_VIEW"]} />}>
            <Route
              path="/lista-precios"
              element={
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Lista de Precios
                  </h1>
                </div>
              }
            />
          </Route>

        

          <Route path="/404" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
