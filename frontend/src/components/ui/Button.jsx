import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
        secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
        danger: 'bg-danger text-white hover:bg-rose-600',
        outline: 'border-2 border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 relative',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100'
    };

    const sizes = {
        sm: 'text-sm px-3 py-1.5 h-9',
        md: 'text-base px-4 py-2 h-11',
        lg: 'text-lg px-6 py-3 h-14'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {leftIcon && <span className="mr-2">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
