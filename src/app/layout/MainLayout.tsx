import {
    LayoutDashboard,
    ShoppingCart,
    FileText,
    Wallet,
    Package,
    Users,
    Truck,
    ScrollText,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar/TopBar';
import { useAuth } from '../../modules/iam/hooks/useAuth';

const ALL_NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard />,
    },
    {
        label: 'Órdenes',
        path: '/ordenes',
        icon: <ShoppingCart />,
        requiredAuthorities: ['QUOTES_VIEW'],
    },
    {
        label: 'Cotizaciones',
        path: '/cotizaciones',
        icon: <FileText />,
        requiredAuthorities: ['QUOTES_VIEW'],
    },
    {
        label: 'Cartera',
        path: '/cartera',
        icon: <Wallet />,
        requiredAuthorities: ['ACCOUNTS_VIEW'],
    },
    {
        label: 'Inventario',
        path: '/inventario',
        icon: <Package />,
        requiredAuthorities: ['INVENTORY_VIEW'],
    },
    {
        label: 'Clientes',
        path: '/clientes',
        icon: <Users />,
        requiredAuthorities: ['CUSTOMERS_VIEW'],
    },
    {
        label: 'Despachos',
        path: '/despachos',
        icon: <Truck />,
        requiredAuthorities: ['PURCHASE_ORDERS_VIEW'],
    },
    {
        label: 'Usuarios',
        path: '/usuarios',
        icon: <Users />,
        requiredAuthorities: ['IAM_VIEW'],
    },
    {
        label: 'Lista de precios',
        path: '/lista-precios',
        icon: <ScrollText />,
        requiredAuthorities: ['PRICE_LISTS_VIEW'],
    },
];

export const MainLayout = () => {
    const { authorities } = useAuth();

    const navItems = ALL_NAV_ITEMS.filter(({ requiredAuthorities }) => {
        if (!requiredAuthorities || requiredAuthorities.length === 0) return true;
        return requiredAuthorities.some((auth) => authorities.includes(auth));
    });

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar navItems={navItems} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
