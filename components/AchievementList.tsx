
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { ALL_ACHIEVEMENTS, getAchievementsStatus } from '../lib/achievements';
import { ProgressBar } from './ProgressBar';

export const AchievementList: React.FC = () => {
    const { measurements, profile, unlockedAchievements } = useData();
    const { t } = useLocalization();

    const achievementsStatus = useMemo(() => {
        return getAchievementsStatus(measurements, profile, unlockedAchievements, t);
    }, [measurements, profile, unlockedAchievements, t]);

    return (
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">{t('profile.achievementsTitle')}</h3>
            {Object.keys(achievementsStatus).length > 0 ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {ALL_ACHIEVEMENTS.map(ach => {
                            const status = achievementsStatus[ach.id];
                            const isUnlocked = status.unlocked;
                            const progressPercent = status.goal > 0 ? Math.min((status.progress / status.goal) * 100, 100) : 0;
                        return (
                            <li key={ach.id} className="p-2 flex flex-col justify-start items-center">
                                <div className={`text-center transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                                    <span className={`flex-shrink-0 h-16 w-16 mx-auto rounded-full flex items-center justify-center text-3xl ${isUnlocked ? 'bg-yellow-400 dark:bg-yellow-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                        {ach.icon}
                                    </span>
                                    <p className="font-semibold text-sm mt-2 text-light-text dark:text-dark-text">{t(`achievements.${ach.id}.name`)}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 h-8 mt-1">{t(`achievements.${ach.id}.description`)}</p>
                                </div>
                                {!isUnlocked && status.goal > 1 && (
                                    <div className="w-full mt-2 text-center flex-grow flex flex-col justify-end">
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1 h-4">
                                            {status.progress > 0 ? status.progressText : ''}
                                        </p>
                                        <ProgressBar progress={progressPercent} />
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('profile.noAchievements')}</p>
            )}
        </div>
    );
};
