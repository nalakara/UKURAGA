
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { ProfileCard } from '../components/ProfileCard';
import { ManageMeasurements } from '../components/ManageMeasurements';
import { SecuritySettings } from '../components/SecuritySettings';
import { AchievementList } from '../components/AchievementList';
import { AppSettings } from '../components/AppSettings';

export const ProfilePage: React.FC = () => {
    const { t } = useLocalization();

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{t('profile.title')}</h1>

            <ProfileCard />
            
            <ManageMeasurements />
            
            <SecuritySettings />
            
            <AchievementList />

            <AppSettings />
            
            <footer className="text-center py-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                {t('general.byNalakara')}
            </footer>
        </div>
    );
};
