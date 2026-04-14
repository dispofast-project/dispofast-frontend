import type React from "react";

export interface Breadcrumb{
    label: string;
    onClick?: () => void;
}

interface TitleProps {
    breadcrumbs?: Breadcrumb[];
}

const CustomTitle: React.FC<TitleProps> = ({ breadcrumbs }) => {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs?.map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="mx-2 text-color-gray1-500">
                                {'>'}
                            </span>
                        )}
                        <span className={`text-3xl font-bold text-gray-800 mb-4 ${
                            breadcrumb.onClick 
                            ? "cursor-pointer text-dispocol-main-color hover:underline" 
                            : "text-black"
                        }`}
                            onClick={breadcrumb.onClick}
                        >
                            {breadcrumb.label}
                        </span>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default CustomTitle;