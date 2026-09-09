
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { TrashIcon } from './Icons';
import { type Goal } from '../types';
import { ProgressBar } from './ProgressBar';

const GoalProgressView: React.FC<{ goal: Goal }> = ({ goal }) => {
    const { getLatestMeasurement, removeGoal, getMeasurementConfig } = useData();
    const { t, getLocale } = useLocalization();
    const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

    const latestMeasurement = getLatestMeasurement(goal.type);
    const currentValue = latestMeasurement?.value ?? goal.startingValue;
    const config = getMeasurementConfig(goal.type);

    const progressPercent = useMemo(() => {
        const { startingValue, targetValue } = goal;
        if (targetValue === startingValue) return 100;
        
        const rawProgress = (currentValue - startingValue) / (targetValue - startingValue);
        return Math.min(Math.max(rawProgress * 100, 0), 100);
    }, [currentValue, goal]);
    
    const valueToGo = Math.abs(goal.targetValue - currentValue).toFixed(1);

    const handleConfirmRemove = () => {
        removeGoal();
        setIsConfirmingRemove(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">{t('home.goalTitle')}: {config.name}</h3>
                {!isConfirmingRemove ? (
                    <button 
                        type="button"
                        onClick={() => setIsConfirmingRemove(true)} 
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600" 
                        aria-label={t('home.removeGoal')}
                    >
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                ) : (
                    <div className="flex items-center space-x-1">
                        <button
                            type="button"
                            onClick={() => setIsConfirmingRemove(false)}
                            className="min-h-[36px] px-2.5 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                        >
                            {t('general.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmRemove}
                            className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                        >
                            {t('general.confirm')}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mb-3 h-2.5">
                <ProgressBar progress={progressPercent} />
            </div>

            <div className="flex justify-between text-sm">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">{t('home.current')}</p>
                    <p className="font-bold text-light-text dark:text-dark-text text-lg">{currentValue.toLocaleString(getLocale())} <span className="text-xs">{config.unit}</span></p>
                </div>
                 <div className="text-center text-indigo-600 dark:text-indigo-400">
                    <p className="font-semibold">{progressPercent >= 100 ? t('home.goalReached') : t('home.toGo', { value: `${valueToGo} ${config.unit}`})}</p>
                    <p className="font-bold text-xl">{Math.round(progressPercent)}%</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">{t('home.target')}</p>
                    <p className="font-bold text-light-text dark:text-dark-text text-lg">{goal.targetValue.toLocaleString(getLocale())} <span className="text-xs">{config.unit}</span></p>
                </div>
            </div>
        </div>
    );
}

const SetGoalView: React.FC = () => {
    const { setGoal, getLatestMeasurement, allMeasurementTypes, getMeasurementConfig } = useData();
    const { t } = useLocalization();
    
    const [selectedType, setSelectedType] = useState<string>('weight');
    const [targetValue, setTargetValue] = useState('');

    const startingMeasurement = useMemo(() => getLatestMeasurement(selectedType), [selectedType, getLatestMeasurement]);
    const config = useMemo(() => getMeasurementConfig(selectedType), [selectedType, getMeasurementConfig]);

    const handleSetGoal = () => {
        if (!targetValue || !startingMeasurement) return;

        const goal: Omit<Goal, 'id'> = {
            type: selectedType,
            targetValue: parseFloat(targetValue),
            startingValue: startingMeasurement.value,
            startDate: new Date().toISOString(),
        };
        setGoal(goal);
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">{t('home.setNewGoal')}</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="goal-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('home.selectGoalType')}</label>
                    <select
                        id="goal-type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full min-h-[44px] p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                    >
                        {allMeasurementTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {startingMeasurement ? (
                    <>
                         <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('home.current')}</p>
                            <p className="text-light-text dark:text-dark-text text-2xl font-bold">{startingMeasurement.value} <span className="text-base font-normal">{config.unit}</span></p>
                        </div>
                        <div>
                            <label htmlFor="target-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('home.setTarget')}</label>
                            <input
                                id="target-value"
                                type="number"
                                value={targetValue}
                                onChange={(e) => setTargetValue(e.target.value)}
                                placeholder={t('home.valuePlaceholder')}
                                className="w-full min-h-[44px] p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSetGoal}
                            disabled={!targetValue || !startingMeasurement || parseFloat(targetValue) === startingMeasurement.value}
                            className="w-full min-h-[44px] flex items-center justify-center space-x-2 bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-offset-dark-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{t('home.setGoal')}</span>
                        </button>
                    </>
                ) : (
                    <div className="text-center py-4 px-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-200">{t('home.noStartValue', { measurement: config.name })}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const GoalTracker: React.FC = () => {
    const { activeGoal } = useData();

    return (
        <div className="w-full max-w-md mt-6">
            <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                {activeGoal ? <GoalProgressView goal={activeGoal} /> : <SetGoalView />}
            </div>
        </div>
    );
};