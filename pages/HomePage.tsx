

import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { Gender, ActivityLevel } from '../types';
import { ScaleIcon, TapeMeasureIcon, HeartPulseIcon, LogoIcon } from '../components/Icons';
import { AIInsights } from '../components/AIInsights';
import { calculateAge } from '../lib/utils';
import { GoalTracker } from '../components/GoalTracker';
import { generateAIContent, getUserApiKey, checkServerKeyStatus } from '../lib/ai';

const activityMultipliers: Record<ActivityLevel, number> = {
    [ActivityLevel.UNSPECIFIED]: 0,
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
    [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
    [ActivityLevel.VERY_ACTIVE]: 1.725,
};

interface Insight {
    info: string;
    recommendation: string;
}
type InsightsData = {
    bmi?: Insight;
    whtr?: Insight;
    whr?: Insight;
    tdee?: Insight;
} | null;


const CalculatedMetrics: React.FC = () => {
    const { profile, getLatestMeasurement } = useData();
    const { t } = useLocalization();
    const [insights, setInsights] = useState<InsightsData>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const latestWeight = getLatestMeasurement('weight')?.value;
    const latestWaist = getLatestMeasurement('waist')?.value;
    const latestHips = getLatestMeasurement('hips')?.value;
    const age = calculateAge(profile.birthDate);

    const bmi = useMemo(() => (profile.height && latestWeight)
        ? (latestWeight / Math.pow(profile.height / 100, 2)).toFixed(1)
        : null, [profile.height, latestWeight]);

    const whtr = useMemo(() => (latestWaist && profile.height)
        ? (latestWaist / profile.height).toFixed(2)
        : null, [latestWaist, profile.height]);

    const whr = useMemo(() => (latestWaist && latestHips)
        ? (latestWaist / latestHips).toFixed(2)
        : null, [latestWaist, latestHips]);

    const bmr = useMemo(() => (latestWeight && profile.height && age && profile.gender !== Gender.UNSPECIFIED)
        ? (10 * latestWeight + 6.25 * profile.height - 5 * age + (profile.gender === Gender.MALE ? 5 : -161))
        : null, [latestWeight, profile.height, age, profile.gender]);
        
    const tdee = useMemo(() => (bmr && profile.activityLevel !== ActivityLevel.UNSPECIFIED)
        ? Math.round(bmr * activityMultipliers[profile.activityLevel])
        : null, [bmr, profile.activityLevel]);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!bmi && !whr && !tdee && !whtr) return; // No data to analyze
            
            const userKey = getUserApiKey();
            const serverHasKey = await checkServerKeyStatus();
            if (!userKey && !serverHasKey) {
                // Graceful fallback: do not trigger red error banner if no key
                return;
            }

            setIsLoading(true);
            setError('');
            setInsights(null);

            const prompt = `
Based on the following user data, return ONLY a valid JSON object with keys "bmi", "whtr", "whr", and "tdee".
Each key should correspond to an object with two properties: "info" and "recommendation".
- "info" should be a brief, one-sentence explanation of the value.
- "recommendation" should be a brief, one-sentence, non-medical lifestyle tip.
Do NOT give any medical advice. Keep sentences short and easy to understand.
If a metric value is 'N/A', return null for that metric's entire object.

User's Metrics:
- BMI: ${bmi || 'N/A'}
- WHtR: ${whtr || 'N/A'}
- WHR: ${whr || 'N/A'}
- TDEE: ${tdee ? `${tdee} kcal/day` : 'N/A'}
`;

            try {
                const responseText = await generateAIContent({
                    prompt,
                    systemInstruction: "You are a health metric assistant named 'UKURAGA Insight'. Deliver concise, clear, and objective observations based on recorded data. Never provide medical advice. Return strictly valid JSON.",
                    responseMimeType: "application/json",
                });

                const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
                const parsedJson = JSON.parse(cleanJson);
                setInsights(parsedJson);

            } catch (e: any) {
                console.error("Failed to load AI insights on Home:", e);
                // Graceful failure - do not show intrusive error banner
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [bmi, whtr, whr, tdee]);


    const metrics = [
        {
            id: 'bmi' as keyof InsightsData,
            name: t('home.bmi'),
            description: t('home.bmiDesc'),
            value: bmi,
            unit: '',
            Icon: ScaleIcon,
            missingReq: t('home.needsHeightWeight'),
        },
        {
            id: 'whtr' as keyof InsightsData,
            name: t('home.whtr'),
            description: t('home.whtrDesc'),
            value: whtr,
            unit: '',
            Icon: TapeMeasureIcon,
            missingReq: t('home.needsWaistHeight'),
        },
        {
            id: 'whr' as keyof InsightsData,
            name: t('home.whr'),
            description: t('home.whrDesc'),
            value: whr,
            unit: '',
            Icon: TapeMeasureIcon,
            missingReq: t('home.needsWaistHips'),
        },
        {
            id: 'tdee' as keyof InsightsData,
            name: t('home.tdee'),
            description: t('home.tdeeDesc'),
            value: tdee,
            unit: t('home.tdeeUnit'),
            Icon: HeartPulseIcon,
            missingReq: t('home.needsProfileActivity'),
        }
    ];

    return (
        <div className="w-full max-w-md mt-6">
            <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3 px-1 text-left">{t('home.smartCalculations')}</h2>
            <div className="grid grid-cols-1 gap-3">
                {metrics.map(metric => (
                    <div 
                        key={metric.id} 
                        className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between text-left transition-all duration-200"
                    >
                       <div className="flex items-start justify-between">
                           <div className="flex-1 pr-2">
                                <p className="text-sm font-semibold text-light-text dark:text-dark-text">{metric.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{metric.description}</p>
                           </div>
                           <metric.Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                       </div>
                       <div className="mt-3 text-center">
                           {metric.value ? (
                                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{metric.value}</span>
                           ) : (
                               <div className="text-xs text-gray-500 dark:text-gray-400 py-3">
                                   <p>{metric.missingReq}</p>
                               </div>
                           )}
                       </div>
                       {metric.value && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 text-center min-h-[40px] flex flex-col items-center justify-center">
                                {isLoading && <p>{t('home.generatingInsights')}</p>}
                                {error && <p className="text-red-500 font-medium">{error}</p>}
                                {insights && insights[metric.id] ? (
                                    <div className="space-y-1">
                                        <p>{insights[metric.id]?.info}</p>
                                        <p className="font-medium text-light-text dark:text-dark-text">{insights[metric.id]?.recommendation}</p>
                                    </div>
                                ) : (
                                    !isLoading && (
                                        <div>
                                            {metric.id === 'bmi' && (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                                                    {Number(metric.value) < 18.5 ? 'Kurang (< 18.5)' : Number(metric.value) < 25 ? 'Normal (18.5 - 24.9)' : Number(metric.value) < 30 ? 'Berlebih (25 - 29.9)' : 'Obesitas (≥ 30)'}
                                                </span>
                                            )}
                                            {metric.id === 'whtr' && (
                                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                                                    {Number(metric.value) < 0.5 ? 'Rasio Sehat (< 0.5)' : 'Perhatian (≥ 0.5)'}
                                                </span>
                                            )}
                                            {metric.id === 'whr' && (
                                                <span className="text-gray-500 dark:text-gray-400">Rasio Lingkar Pinggang / Pinggul</span>
                                            )}
                                            {metric.id === 'tdee' && (
                                                <span className="text-gray-500 dark:text-gray-400">Total Kebutuhan Energi Harian</span>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                       )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const HomePage: React.FC = () => {
    const { profile } = useData();
    const { t } = useLocalization();

    return (
        <div className="p-4 flex flex-col items-center text-center">
            <div className="flex flex-col items-center mt-4 mb-2">
                <LogoIcon className="h-14 w-14 text-light-text dark:text-dark-text" />
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text tracking-tight mt-2">{t('general.appName')}</h1>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {t('home.welcome', { name: profile.name })}
            </p>
            
            <GoalTracker />
            
            <CalculatedMetrics />

            <AIInsights />

        </div>
    );
};
