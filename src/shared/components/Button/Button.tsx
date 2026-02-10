import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "icon";
    isLoading?: boolean;
    badgeContent?: number;
}

const baseStyles = 
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-dispofast-primary text-white hover:bg-dispofast-primary-dark hover:cursor-pointer",
    secondary: "bg-dispofast-secondary text-white hover:bg-dispofast-primary hover:cursor-pointer",
    icon: "p-2 bg-transparent text-dispofast-primary hover:bg-dispofast-neutral hover:cursor-pointer",
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading = false,
    badgeContent,
    className,
    ...rest
}) => {
    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${isLoading ? "cursor-not-allowed opacity-50" : ""} ${className ?? ""}`}
            disabled={isLoading || rest.disabled}
            {...rest}
        >
            {isLoading ? "Loading..." : children}
            {badgeContent !== undefined && badgeContent > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {badgeContent > 9 ? "9+" : badgeContent}
                </span>
            )}
        </button>
    );
}