import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        success: 'bg-emerald-100 text-emerald-700',
        danger: 'bg-rose-100 text-rose-700',
        warning: 'bg-amber-100 text-amber-700',
        info: 'bg-indigo-100 text-indigo-700',
        neutral: 'bg-slate-100 text-slate-700',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
