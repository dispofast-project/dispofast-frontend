import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "icon";
    isLoading?: boolean;
    badgeContent?: number;
}

const baseStyles = 
    "inline-flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-dispocol-main-color text-white hover:bg-dispocol-secondary-color",
    secondary: "bg-dispocol-secondary-color text-white hover:bg-dispocol-main-color",
    icon: "p-2 bg-transparent text-dispocol-main-color hover:bg-dispocol-neutral-color",
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading = false,
    badgeContent,
    ...rest
}) => {
    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isLoading}
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