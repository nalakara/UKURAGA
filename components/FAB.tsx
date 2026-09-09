
import React from 'react';

interface FABProps {
    onClick: () => void;
    children: React.ReactNode;
    'aria-label': string;
}

export const FAB: React.FC<FABProps> = ({ onClick, children, 'aria-label': ariaLabel }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
            className="fixed right-5 h-14 w-14 z-30 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-offset-dark-bg transition-transform duration-200 ease-in-out active:scale-95"
        >
            {children}
        </button>
    );
};
