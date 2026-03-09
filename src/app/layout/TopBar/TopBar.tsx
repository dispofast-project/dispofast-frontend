import { Search, Bell, User } from "lucide-react";
import type React from "react";
import { useAuthStore } from "../../../modules/iam/auth.store";

interface TopBarProps {
    notificationCount?: number;
}

const formatRole = (roles: string[]): string => {
    if (!roles || roles.length === 0) return "";
    const raw = roles[0].replace(/^ROLE_/, "");
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};

const TopBar: React.FC<TopBarProps> = ({ notificationCount = 0 }) => {
    const user = useAuthStore((state) => state.user);

    const username = user?.name ?? "";
    const role = formatRole(user?.roles ?? []);

    return (
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            {/* Search */}
            <div className="flex-1 max-w-lg mr-4">
                <div className="relative hidden sm:flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar clientes, órdenes, productos..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4676B8]/20 focus:border-[#4676B8] focus:bg-white transition-colors placeholder:text-gray-400"
                    />
                </div>

                {/* Mobile: only icon */}
                <button
                    className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Buscar"
                >
                    <Search className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
                {/* Notification bell */}
                <button
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Notificaciones"
                >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notificationCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-[3px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                            {notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

                {/* User profile */}
                <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{username}</p>
                        <p className="text-xs text-gray-500 leading-tight">{role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#4676B8] flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
