
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { useData } from '../context/DataContext';
import { CloseIcon } from './Icons';
import type { CustomMeasurementType } from '../types';

interface CustomMeasurementModalProps {
  onClose: () => void;
  existingType?: CustomMeasurementType;
}

export const CustomMeasurementModal: React.FC<CustomMeasurementModalProps> = ({ onClose, existingType }) => {
    const { t } = useLocalization();
    const { addCustomMeasurementType, updateCustomMeasurementType } = useData();

    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (existingType) {
            setName(existingType.name);
            setUnit(existingType.unit);
        }
    }, [existingType]);

    const handleSave = () => {
        if (!name.trim()) {
            return; // Name is required
        }
        if (existingType) {
            updateCustomMeasurementType({ ...existingType, name, unit });
        } else {
            addCustomMeasurementType({ name, unit });
        }
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-measurement-title"
        >
            <div 
                className="bg-light-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 w-full max-w-sm relative text-left" 
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" 
                    aria-label={t('general.close')}
                >
                    <CloseIcon className="h-5 w-5" />
                </button>

                <h2 id="custom-measurement-title" className="text-xl font-bold mb-4 text-light-text dark:text-dark-text pr-10">
                    {existingType ? t('profile.editCustomMeasurement') : t('profile.addCustomMeasurement')}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="measurement-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('profile.measurementName')}
                        </label>
                        <input
                            type="text"
                            id="measurement-name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., Water Intake"
                            autoFocus
                            className="block w-full min-h-[44px] p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="measurement-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('profile.measurementUnit')}
                        </label>
                        <input
                            type="text"
                            id="measurement-unit"
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                            placeholder="e.g., mL, hours, steps"
                            className="block w-full min-h-[44px] p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
                    >
                        {t('general.cancel')}
                    </button>
                     <button 
                        type="button"
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card transition-colors"
                    >
                        {t('general.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};