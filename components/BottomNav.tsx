
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocalization } from '../context/LocalizationContext';
import { HomeIcon, ChartIcon, UserIcon, ClipboardListIcon, CameraIcon } from './Icons';

const NavItem: React.FC<{ to: string; label: string; children: React.ReactNode }> = ({ to, label, children }) => {
    const activeClass = 'text-indigo-600 dark:text-indigo-400 font-semibold';
    const inactiveClass = 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400';

    return (
        <NavLink 
            to={to} 
            className={({ isActive }) => 
                `flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors ${isActive ? activeClass : inactiveClass}`
            }
        >
            {children}
            <span className="text-xs mt-1 leading-tight">{label}</span>
        </NavLink>
    );
};

export const BottomNav: React.FC = () => {
    const { t } = useLocalization();
    return (
        <nav 
            aria-label="Main navigation"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-light-card/95 dark:bg-dark-card/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-lg flex justify-around items-center h-16 min-h-[64px]"
        >
            <NavItem to="/" label={t('nav.home')}>
                 <HomeIcon className="h-6 w-6" />
            </NavItem>
            <NavItem to="/record" label={t('nav.record')}>
                 <ClipboardListIcon className="h-6 w-6" />
            </NavItem>
            <NavItem to="/gallery" label={t('nav.gallery')}>
                 <CameraIcon className="h-6 w-6" />
            </NavItem>
            <NavItem to="/history" label={t('nav.history')}>
                 <ChartIcon className="h-6 w-6" />
            </NavItem>
            <NavItem to="/profile" label={t('nav.profile')}>
                 <UserIcon className="h-6 w-6" />
            </NavItem>
        </nav>
    );
};
