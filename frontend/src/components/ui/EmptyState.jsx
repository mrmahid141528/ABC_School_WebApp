import React from 'react';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionComponent
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {Icon && (
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Icon className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
                </div>
            )}
            <h3 className="text-xl font-bold text-text-main mb-2">
                {title}
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
                {description}
            </p>
            {actionComponent && (
                <div className="mt-2">
                    {actionComponent}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
