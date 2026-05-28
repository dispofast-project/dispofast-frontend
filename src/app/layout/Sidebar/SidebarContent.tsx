import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import dispofastLogo from "../../../assets/dispofast-logo.png";

interface NavItems {
    label: string;
    path: string;
    icon: React.ReactNode;
    requiredAuthorities?: string[];
}

interface SidebarContentProps {
    navItems: NavItems[];
    pathName: string;
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    onLinkClick?: () => void;
    onToggleCollapsed: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
    navItems,
    pathName,
    isOpen,
    isCollapsed,
    onLinkClick,
    onClose,
    onToggleCollapsed,
}) => {
    return(
        <aside
            data-testid="sidebar-content"
            className={`fixed lg:static top-0 left-0 h-full ${
                isCollapsed ? "w-25 " : "w-64"
            } bg-sidebar border-r border-sidebar-border text-sidebar-foreground transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-all duration-300 ease-in-out z-50 flex flex-col`}
        >
            {/* Header con logo y botón cerrar */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
                    <img src={dispofastLogo} alt="Dispofast logo" className="w-15 h-15"/>
                    {!isCollapsed && <span className="text-lg font-semibold">DISPOCOL</span>}
                </div>

                {/* Botón cerrar solo visible en móvil */}
                {!isCollapsed && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-sidebar-accent rounded-md transition-colors"
                        aria-label="Cerrar menú"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
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
                                            ? "bg-sidebar-primary text-white shadow-md" 
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    } ${isCollapsed ? "justify-center" : ""}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                                    {!isCollapsed && (
                                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Botón para colapsar/expandir (solo desktop) */}
            <div className="hidden lg:block p-3 border-t border-sidebar-border">
                <button
                    onClick={onToggleCollapsed}
                    className="w-full flex items-center justify-center p-2 hover:bg-sidebar-accent rounded-lg transition-colors hover:cursor-pointer"
                    aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <div className="flex items-center gap-2 w-full">
                            <ChevronLeft className="w-5 h-5" />
                            
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};