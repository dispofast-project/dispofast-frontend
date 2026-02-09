import type React from "react";
import { useId, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id?: string;
    error?: string;
    rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, error, rightElement, ...rest }, ref) => {

    const autoId = useId();
    const finalId = id || autoId;

    const errorStyles = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-2 focus:border-dispocol-main-color focus:ring-dispocol-main-color";
    
    const baseClassName =  `
        w-full px-4 py-2 border transition-color placeholder-gray-400
    `

    const stateClassName = rest.readOnly
      ? 'bg-slate-50 border-gray-300 text-gray-800 cursor-not-allowed focus:ring-0'
      : `disabled:border-gray-2 disabled:text-gray-2 disabled:bg-gray-100 disabled:cursor-not-allowed
        ${errorStyles} bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dispocol-main-color`;

    const inputClassName = `
        ${baseClassName} ${stateClassName} ${rightElement ? 'pr-10' : ''}
    `.trim()

    return (
        <div className="w-full">
            <label htmlFor={finalId}
                className="block mb-1 font-semibold text-gray-1"
            >
                {label}
            </label>
            <div className="relative">
                <input id={finalId} type="text" className={inputClassName} ref={ref} {...rest}/>
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex item-center">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && 
                <p className="mt-1 text-sm text-red-600">{error}</p>
            }
        </div>
    )
});

Input.displayName = "Input"