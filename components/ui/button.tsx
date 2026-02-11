import * as React from "react"
// Imports removed (unused)
import { cn } from "@/lib/utils"

// Note: If you want to use Radix primitives, install them. But for now I'll use a span/button.
// Wait, I didn't install @radix-ui/react-slot or class-variance-authority.
// I should stick to basic props for now to keep it simple as requested ("No heavy UI libraries").

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            ghost: "hover:bg-gray-100 hover:text-gray-900",
            destructive: "bg-red-600 text-white hover:bg-red-700"
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-10 py-2 px-4",
            lg: "h-11 px-8 text-lg"
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"
