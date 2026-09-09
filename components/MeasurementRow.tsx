
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { PencilIcon } from './Icons';

interface MeasurementRowProps {
    type: string;
    selectedDate: string;
}

export const MeasurementRow: React.FC<MeasurementRowProps> = ({ type, selectedDate }) => {
    const { measurements, upsertMeasurement, getMeasurementConfig } = useData();
    const { t } = useLocalization();
    
    const [mode, setMode] = useState<'display' | 'input'>('input');
    const [inputValue, setInputValue] = useState<string>('');

    const config = useMemo(() => getMeasurementConfig(type), [getMeasurementConfig, type]);

    // The canonical value for this row, derived from the central data store.
    const canonicalValue = useMemo(() => {
        const dateString = new Date(selectedDate).toISOString().split('T')[0];
        const measurementForDate = measurements.find(m => 
            m.type === type && new Date(m.date).toISOString().split('T')[0] === dateString
        );
        return measurementForDate ? String(measurementForDate.value) : '';
    }, [selectedDate, measurements, type]);

    // This effect syncs the component's state whenever the canonical value changes.
    // This happens when the selected date changes, or after a save operation updates the context.
    useEffect(() => {
        setInputValue(canonicalValue);
        setMode(canonicalValue ? 'display' : 'input');
    }, [canonicalValue]);

    const handleSave = () => {
        const valueToSave = inputValue.trim() === '' ? null : parseFloat(inputValue);

        const dateParts = selectedDate.split('-').map(Number);
        // Ensure date is treated as local, not UTC, to avoid timezone shifts.
        const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        upsertMeasurement({
            type,
            date: localDate.toISOString(),
            value: valueToSave
        });
        // The UI will update automatically when the `canonicalValue` changes.
    };
    
    const handleCancel = () => {
        // Revert any changes to the canonical value and exit input mode.
        setInputValue(canonicalValue);
        if (canonicalValue) {
            setMode('display');
        }
    };

    const hasChanged = useMemo(() => inputValue.trim() !== canonicalValue.trim(), [inputValue, canonicalValue]);
    const isEditingExisting = mode === 'input' && !!canonicalValue;

    return (
        <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg shadow-sm flex items-center space-x-3">
            <div className="flex-1 min-w-0">
                <label htmlFor={`input-${type}`} className="text-sm font-medium text-light-text dark:text-dark-text">
                    {config.name}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">{config.unit}</p>
            </div>
            <input
                id={`input-${type}`}
                type="number"
                step="0.1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="-"
                readOnly={mode === 'display'}
                className={`w-24 p-2 text-right border-b-2 bg-transparent text-light-text dark:text-dark-text focus:outline-none transition-colors ${
                    mode === 'display' 
                    ? 'border-transparent focus:border-transparent cursor-default'
                    : 'border-gray-300 dark:border-gray-600 focus:border-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm'
                }`}
            />
            <div className="flex items-center justify-center min-w-[110px]">
                {mode === 'display' && canonicalValue ? (
                     <button 
                        type="button"
                        onClick={() => setMode('input')} 
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        aria-label={t('general.edit')}
                     >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="flex items-center space-x-2">
                        {isEditingExisting && (
                             <button 
                                type="button"
                                onClick={handleCancel} 
                                className="min-h-[44px] text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline px-2 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                             >
                                {t('general.cancel')}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!hasChanged}
                            className={`min-h-[44px] w-20 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-center flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card ${
                                !hasChanged ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {t('general.save')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};