import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
    const variants = {
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
        text: 'rounded-md h-4 w-3/4'
    };

    return (
        <div className={`animate-pulse bg-slate-200 ${variants[variant]} ${className}`} />
    );
};

export default Skeleton;
