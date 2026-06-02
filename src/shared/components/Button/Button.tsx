import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "icon" | "tertiary";
    isLoading?: boolean;
    badgeContent?: number;
}

const baseStyles = 
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-100";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-dispofast-primary text-white hover:bg-dispofast-primary/90 hover:cursor-pointer disabled:bg-dispofast-neutral disabled:text-gray-500",
    secondary: "bg-dispofast-secondary text-white hover:bg-dispofast-primary hover:cursor-pointer disabled:bg-dispofast-neutral disabled:text-gray-500",
    tertiary: "bg-transparent text-gray-700 hover:bg-gray-100 hover:cursor-pointer disabled:text-gray-400",
    icon: "p-2 bg-transparent text-dispofast-primary hover:bg-dispofast-neutral hover:cursor-pointer disabled:text-gray-400",
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading = false,
    badgeContent,
    className,
    ...rest
}) => {
    const isDisabled = isLoading || rest.disabled;
    const resolvedStyle: React.CSSProperties | undefined = (() => {
        if (variant === "icon") return undefined;

        if (isDisabled) {
            return {
                backgroundColor: "var(--dispofast-neutral)",
                color: "#6b7280",
            };
        }

        if (variant === "secondary") {
            return {
                backgroundColor: "var(--dispofast-secondary)",
                color: "#ffffff",
            };
        }

        return {
            backgroundColor: "var(--dispofast-primary)",
            color: "#ffffff",
        };
    })();

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${isLoading ? "cursor-not-allowed opacity-50" : ""} ${className ?? ""}`}
            style={{ ...resolvedStyle, ...rest.style }}
            disabled={isDisabled}
            {...rest}
        >
            {isLoading ? "Cargando..." : children}
            {badgeContent !== undefined && badgeContent > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {badgeContent > 9 ? "9+" : badgeContent}
                </span>
            )}
        </button>
    );
}