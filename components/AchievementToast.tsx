import React, { useEffect, useState, useCallback } from 'react';
import type { AchievementId } from '../types';
import { ALL_ACHIEVEMENTS } from '../lib/achievements';
import { useLocalization } from '../context/LocalizationContext';
import { TrophyIcon, CloseIcon } from './Icons';

interface AchievementToastProps {
    newAchievements: AchievementId[];
    onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ newAchievements, onDismiss }) => {
    const { t } = useLocalization();
    const [isShowing, setIsShowing] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<(typeof ALL_ACHIEVEMENTS[0]) | null>(null);

    // This callback handles the full dismissal logic
    const handleDismiss = useCallback(() => {
        setIsShowing(false);
        // Delay clearing data to allow for exit animation
        setTimeout(() => {
            onDismiss();
            setCurrentAchievement(null); // Reset for next time
        }, 300); // Corresponds to animation duration
    }, [onDismiss]);

    useEffect(() => {
        // Only process if there are new achievements and we aren't showing one already.
        if (newAchievements.length > 0 && !currentAchievement) {
            const achievementToShow = ALL_ACHIEVEMENTS.find(a => a.id === newAchievements[0]);
            if (achievementToShow) {
                setCurrentAchievement(achievementToShow);
                // A tiny delay ensures the element is in the DOM before we trigger the transition
                setTimeout(() => setIsShowing(true), 50);

                const timer = setTimeout(() => {
                    handleDismiss();
                }, 5000); // 5-second auto-dismiss

                return () => clearTimeout(timer);
            }
        }
    }, [newAchievements, currentAchievement, handleDismiss]);

    if (!currentAchievement) {
        return null;
    }

    return (
        <div 
            className={`fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl p-4 flex items-center space-x-4 z-50 transition-all duration-300 ease-out ${isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <span className="flex-shrink-0 h-12 w-12 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center">
                <TrophyIcon className="h-7 w-7 text-white"/>
            </span>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-light-text dark:text-dark-text">{t('achievementToast.title')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{t(`achievements.${currentAchievement.id}.name`)}</p>
            </div>
            <button 
                type="button"
                onClick={handleDismiss} 
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
                aria-label={t('general.close')}
            >
                <CloseIcon className="h-5 w-5" />
            </button>
        </div>
    );
};
