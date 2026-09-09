
import type { Achievement, AchievementId, Measurement, Profile } from '../types';
import { Gender, ActivityLevel } from '../types';

// Names and descriptions are now handled by the localization system (translations.ts)
export const ALL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'FIRST_ENTRY',
        icon: '🥇'
    },
    {
        id: 'PROFILER',
        icon: '✏️'
    },
    {
        id: 'EXPLORER',
        icon: '🗺️'
    },
    {
        id: 'CONSISTENT_WEEK',
        icon: '🗓️'
    }
];

export const checkNewAchievements = (
    measurements: Measurement[],
    profile: Profile,
    unlocked: AchievementId[]
): AchievementId[] => {
    const newAchievements: AchievementId[] = [];

    const check = (id: AchievementId, condition: boolean) => {
        if (!unlocked.includes(id) && condition) {
            newAchievements.push(id);
        }
    };

    // Achievement: First Entry
    check('FIRST_ENTRY', measurements.length > 0);
    
    // Achievement: Profiler
    check('PROFILER', profile.name !== 'Pengguna' && profile.name !== 'User' && profile.gender !== Gender.UNSPECIFIED && !!profile.birthDate && (profile.height || 0) > 0 && profile.activityLevel !== ActivityLevel.UNSPECIFIED);

    // Achievement: Data Collector
    const uniqueMeasurementTypes = new Set(measurements.map(m => m.type));
    check('EXPLORER', uniqueMeasurementTypes.size >= 5);

    // Achievement: Consistent Week
    if (measurements.length >= 7) {
        const measurementDays = new Set(measurements.map(m => new Date(m.date).toDateString()));
        if(measurementDays.size >= 7) {
            const sortedDates = Array.from(measurementDays).map(d => new Date(d).getTime()).sort((a,b) => a - b);
            let consecutiveDays = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const diff = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    consecutiveDays++;
                } else if (diff > 1) {
                    consecutiveDays = 1; // Reset
                }
                if (consecutiveDays >= 7) {
                    check('CONSISTENT_WEEK', true);
                    break;
                }
            }
        }
    }


    return newAchievements;
};

export interface AchievementStatus {
    unlocked: boolean;
    progress: number;
    goal: number;
    progressText: string;
}

type Translator = (key: string, replacements?: { [key: string]: string | number }) => string;

export const getAchievementsStatus = (
    measurements: Measurement[],
    profile: Profile,
    unlocked: AchievementId[],
    t: Translator
): Record<AchievementId, AchievementStatus> => {
    const status: Record<string, Partial<AchievementStatus>> = {};

    // Profiler
    const profilerFields = [
        profile.name !== 'Pengguna' && profile.name !== 'User',
        profile.gender !== Gender.UNSPECIFIED,
        !!profile.birthDate,
        (profile.height || 0) > 0,
        profile.activityLevel !== ActivityLevel.UNSPECIFIED
    ];
    const profilerProgress = profilerFields.filter(Boolean).length;
    status.PROFILER = {
        progress: profilerProgress,
        goal: 5,
        progressText: profilerProgress < 5 ? t('achievements.profiler_progress', { progress: profilerProgress, goal: 5 }) : ''
    };

    // Explorer
    const uniqueTypes = new Set(measurements.map(m => m.type)).size;
    status.EXPLORER = {
        progress: uniqueTypes,
        goal: 5,
        progressText: uniqueTypes < 5 ? t('achievements.explorer_progress', { progress: uniqueTypes, goal: 5 }) : ''
    };
    
    // Consistent Week
    let longestStreak = 0;
    if (measurements.length > 0) {
        const measurementDays = new Set(measurements.map(m => new Date(m.date).toISOString().split('T')[0]));
        const sortedDates = Array.from(measurementDays).map(d => new Date(d).getTime()).sort((a, b) => a - b);
        if (sortedDates.length > 0) {
            let currentStreak = 1;
            longestStreak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const diff = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    currentStreak++;
                } else if (diff > 1){
                    currentStreak = 1; // Reset
                }
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                }
            }
        }
    }
    status.CONSISTENT_WEEK = {
        progress: longestStreak,
        goal: 7,
        progressText: longestStreak < 7 ? t('achievements.consistent_week_progress', { progress: longestStreak }) : ''
    };

    // First Entry
    status.FIRST_ENTRY = {
        progress: measurements.length > 0 ? 1 : 0,
        goal: 1,
        progressText: ''
    };

    // Finalize by adding the `unlocked` status
    const finalStatus: Partial<Record<AchievementId, AchievementStatus>> = {};
    for (const ach of ALL_ACHIEVEMENTS) {
        finalStatus[ach.id] = {
            ...status[ach.id],
            unlocked: unlocked.includes(ach.id),
        } as AchievementStatus;
    }
    
    return finalStatus as Record<AchievementId, AchievementStatus>;
};