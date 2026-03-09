import { Search, X } from "lucide-react";
import type React from "react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = "Buscar...",
    className = "",
    disabled = false,
}) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#4676B8]/20 focus:border-[#4676B8] focus:bg-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors placeholder:text-gray-400"
            />
            {value && !disabled && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-2.5 p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};
