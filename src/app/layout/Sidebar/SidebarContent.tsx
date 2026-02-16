import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface NavItems {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[]; 
}

interface SidebarContentProps {
    navItems: NavItems[];
    pathName: string;
    isOpen: boolean;
    onClose: () => void;
    onLinkClick?: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
    navItems,
    pathName,
    isOpen,
    onLinkClick,
    onClose,
}) => {
    return(
        <aside
            data-testid="sidebar-content"
            className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#2d3748] text-white transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col`}
        >
            {/* Header con logo y botón cerrar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-dispofast-primary flex items-center justify-center text-white font-bold text-xl">
                        D
                    </div>
                    <span className="text-lg font-semibold">DISPOCOL</span>
                </div>
                
                {/* Botón cerrar solo visible en móvil */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 hover:bg-gray-700 rounded-md transition-colors"
                    aria-label="Cerrar menú"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navegación */}
            <nav className="flex-grow overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.path === '/' 
                            ? pathName === item.path
                            : pathName.startsWith(item.path);
                        return (
                            <li key={item.path}>
                                <Link 
                                    to={item.path}
                                    onClick={onLinkClick}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        isActive 
                                            ? "bg-dispofast-primary text-white shadow-md" 
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};