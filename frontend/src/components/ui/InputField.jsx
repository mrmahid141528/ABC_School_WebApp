import React from 'react';

const InputField = React.forwardRef(({
    label,
    error,
    type = 'text',
    id,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                id={id}
                className={`w-full px-4 py-2.5 rounded-xl border bg-white text-text-main transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20
          ${error ? 'border-danger focus:border-danger ring-danger/20' : 'border-slate-200 focus:border-primary'}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-danger">{error}</p>
            )}
        </div>
    );
});

InputField.displayName = 'InputField';

export default InputField;
