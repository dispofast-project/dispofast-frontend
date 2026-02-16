import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { SidebarContent } from "./SidebarContent";

interface NavItems {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[];
}

interface SidebarProps {
    navItems: NavItems[];
}

export const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Botón hamburguesa para móvil */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-dispofast-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg"
                aria-label="Abrir menú"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    data-testid="sidebar-overlay"
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Content */}
            <SidebarContent
                navItems={navItems}
                pathName={location.pathname}
                isOpen={isOpen}
                onClose={closeSidebar}
                onLinkClick={closeSidebar}
            />
        </>
    );
};
