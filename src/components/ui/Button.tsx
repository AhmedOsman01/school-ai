import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, asChild = false, children, disabled, ...props }, ref) => {

        // Base classes
        const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 border whitespace-nowrap";

        // Size variants
        const sizes = {
            sm: "h-8 px-3 text-xs rounded-md",
            md: "h-10 px-4 py-2 text-sm rounded-md",
            lg: "h-12 px-8 text-base rounded-lg",
            icon: "h-10 w-10 justify-center rounded-md",
        };

        // Color/Style variants matching globals.css
        const variants = {
            primary: "bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-sm",
            secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700",
            danger: "bg-rose-500 text-white border-transparent hover:bg-rose-600 shadow-sm",
            ghost: "bg-transparent text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
            outline: "bg-transparent text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
        };

        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                className={cn(baseStyles, sizes[size], variants[variant], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && !asChild ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                {children}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button };
