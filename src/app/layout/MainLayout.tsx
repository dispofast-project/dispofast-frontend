import { 
    LayoutDashboard, 
    ShoppingCart, 
    FileText, 
    Wallet, 
    Package, 
    Users, 
    Truck, 
    Settings,
    ScrollText,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

const navItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard />,
    },
    {
        label: 'Órdenes',
        path: '/ordenes',
        icon: <ShoppingCart />,
    },
    {
        label: 'Cotizaciones',
        path: '/cotizaciones',
        icon: <FileText />,
    },
    {
        label: 'Cartera',
        path: '/cartera',
        icon: <Wallet />,
    },
    {
        label: 'Inventario',
        path: '/inventario',
        icon: <Package />,
    },
    {
        label: 'Clientes',
        path: '/clientes',
        icon: <Users />,
    },
    {
        label: 'Despachos',
        path: '/despachos',
        icon: <Truck />,
    },
    {
        label: 'Configuración',
        path: '/configuracion',
        icon: <Settings />,
    },
    {
        label: 'Usuarios',
        path: '/usuarios',
        icon: <Users />,
    },
    {
        label: 'Lista de precios',
        path: '/lista-precios',
        icon: <ScrollText />,
    }
];

export const MainLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar navItems={navItems} />
            
            <main className="flex-1 overflow-y-auto">
                <div className="lg:ml-0 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
