
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { CogIcon, PlusIcon, PencilIcon, TrashIcon } from './Icons';
import { CustomMeasurementModal } from './CustomMeasurementModal';
import { DEFAULT_MEASUREMENT_CONFIG } from '../constants';
import type { CustomMeasurementType } from '../types';

export const ManageMeasurements: React.FC = () => {
    const { 
        customMeasurementTypes, 
        deleteCustomMeasurementType,
        removedDefaultTypes,
        toggleDefaultMeasurementTypeVisibility 
    } = useData();
    const { t } = useLocalization();
    
    const [modalState, setModalState] = useState<{ isOpen: boolean, type?: CustomMeasurementType }>({ isOpen: false });
    const [confirmDeleteState, setConfirmDeleteState] = useState<{
        isOpen: boolean;
        title: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', onConfirm: () => {} });

    const handleDeleteCustomType = (type: CustomMeasurementType) => {
        setConfirmDeleteState({
            isOpen: true,
            title: t('profile.deleteMeasurementConfirmText', { name: type.name }),
            onConfirm: () => {
                deleteCustomMeasurementType(type.id);
                setConfirmDeleteState({ isOpen: false, title: '', onConfirm: () => {} });
            }
        });
    };

    const handleToggleDefault = (id: string, name: string) => {
        const isRemoved = removedDefaultTypes.includes(id);
        if (!isRemoved) {
            setConfirmDeleteState({
                isOpen: true,
                title: t('profile.deleteMeasurementConfirmText', { name }),
                onConfirm: () => {
                    toggleDefaultMeasurementTypeVisibility(id);
                    setConfirmDeleteState({ isOpen: false, title: '', onConfirm: () => {} });
                }
            });
        } else {
            toggleDefaultMeasurementTypeVisibility(id);
        }
    };

    return (
        <>
            {modalState.isOpen && (
                <CustomMeasurementModal
                    existingType={modalState.type}
                    onClose={() => setModalState({ isOpen: false })}
                />
            )}

            {confirmDeleteState.isOpen && (
                <div 
                    role="dialog" 
                    aria-modal="true" 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
                >
                    <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
                        <h4 className="text-base font-semibold text-light-text dark:text-dark-text">
                            {t('general.delete')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {confirmDeleteState.title}
                        </p>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setConfirmDeleteState({ isOpen: false, title: '', onConfirm: () => {} })}
                                className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
                            >
                                {t('general.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteState.onConfirm}
                                className="min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                            >
                                {t('general.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center">
                        <CogIcon className="h-5 w-5 mr-2 text-gray-400 shrink-0"/>
                        {t('profile.manageMeasurementsTitle')}
                    </h3>
                    <button 
                        type="button"
                        onClick={() => setModalState({ isOpen: true })} 
                        className="min-h-[44px] flex items-center justify-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 shadow-sm shrink-0"
                    >
                        <PlusIcon className="h-4 w-4 mr-1.5"/>
                        {t('profile.addCustomMeasurement')}
                    </button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-2">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">{t('profile.customTypes')}</h4>
                        <ul className="space-y-1">
                            {customMeasurementTypes.length > 0 ? customMeasurementTypes.map(type => (
                                <li key={type.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors">
                                    <div>
                                        <p className="font-medium text-sm text-light-text dark:text-dark-text">{type.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Unit: {type.unit || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button 
                                            type="button"
                                            onClick={() => setModalState({ isOpen: true, type })} 
                                            aria-label={`${t('general.edit')} ${type.name}`}
                                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleDeleteCustomType(type)} 
                                            aria-label={`${t('general.delete')} ${type.name}`}
                                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </li>
                            )) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-2">{t('profile.addCustomMeasurementHelp')}</p>
                            )}
                        </ul>
                    </div>
                    <div className="pt-3">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">{t('profile.defaultTypes')}</h4>
                        <ul className="space-y-1">
                           {Object.entries(DEFAULT_MEASUREMENT_CONFIG).map(([id, config]) => {
                                const isRemoved = removedDefaultTypes.includes(id);
                                const name = t(`measurements.${id}`);
                                return (
                                <li key={id} className={`flex items-center justify-between p-2 rounded-lg transition-all ${isRemoved ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'}`}>
                                    <div>
                                        <p className="font-medium text-sm text-light-text dark:text-dark-text">{name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Unit: {config.unit}</p>
                                    </div>
                                    {config.removable ? (
                                        <button 
                                            type="button"
                                            onClick={() => handleToggleDefault(id, name)} 
                                            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 ${
                                                isRemoved 
                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 focus-visible:ring-emerald-600' 
                                                    : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus-visible:ring-red-600'
                                            }`}
                                            aria-label={isRemoved ? `Add ${name}` : `Remove ${name}`}
                                        >
                                            {isRemoved ? <PlusIcon className="w-5 h-5"/> : <TrashIcon className="w-5 h-5"/>}
                                        </button>
                                    ) : (
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">Default</span>
                                    )}
                                </li>
                                )}
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};