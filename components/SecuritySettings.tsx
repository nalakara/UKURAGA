
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../context/LocalizationContext';
import { SetPinModal } from './SetPinModal';
import { isBiometricSupported } from '../lib/auth';
import { KeyIcon, FingerprintIcon } from './Icons';

export const SecuritySettings: React.FC = () => {
    const { authData, setupAuth, removeAuth } = useAuth();
    const { t } = useLocalization();
    const [showPinModal, setShowPinModal] = useState(false);
    const [biometricSupport, setBiometricSupport] = useState(false);
    
    useEffect(() => {
        isBiometricSupported().then(setBiometricSupport);
    }, []);

    const handleSetupPin = (pin: string) => {
        setupAuth('pin', pin);
        setShowPinModal(false);
    };

    const handleSetupBiometric = () => {
        setupAuth('biometric');
    }

    return (
        <>
            {showPinModal && (
                <SetPinModal 
                    onClose={() => setShowPinModal(false)}
                    onSetPin={handleSetupPin}
                />
            )}
            <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">{t('profile.securityTitle')}</h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {authData.method === 'none' ? (
                    <>
                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-3">
                            <div>
                                <p className="text-light-text dark:text-dark-text font-semibold">{t('profile.appLock')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('profile.appLockDesc')}</p>
                            </div>
                            <div className="flex space-x-2 shrink-0">
                                {biometricSupport && (
                                    <button 
                                        type="button"
                                        onClick={handleSetupBiometric} 
                                        className="min-h-[44px] px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card transition-colors"
                                    >
                                        {t('profile.biometric')}
                                    </button>
                                )}
                                <button 
                                    type="button"
                                    onClick={() => setShowPinModal(true)} 
                                    className="min-h-[44px] px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card transition-colors"
                                >
                                    {t('profile.pin')}
                                </button>
                            </div>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="flex justify-between items-center py-3">
                                <div className="flex items-center space-x-2">
                                {authData.method === 'pin' ? <KeyIcon className="h-5 w-5 text-gray-400"/> : <FingerprintIcon className="h-5 w-5 text-gray-400"/>}
                                <span className="text-light-text dark:text-dark-text">{t('profile.appLockActive')}</span>
                                </div>
                                <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {authData.method === 'pin' ? t('profile.pin') : t('profile.biometric')}
                                </span>
                        </li>
                        {authData.method === 'pin' && (
                            <li className="flex justify-between items-center py-3">
                                <span className="text-light-text dark:text-dark-text">{t('profile.changePin')}</span>
                                <button 
                                    type="button"
                                    onClick={() => setShowPinModal(true)} 
                                    className="min-h-[44px] px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                >
                                    {t('general.change')}
                                </button>
                            </li>
                        )}
                            <li className="flex justify-between items-center py-3">
                            <span className="text-light-text dark:text-dark-text">{t('profile.disableLock')}</span>
                            <button 
                                type="button"
                                onClick={() => removeAuth()} 
                                className="min-h-[44px] px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                            >
                                {t('profile.disable')}
                            </button>
                        </li>
                    </>
                )}
                </ul>
            </div>
        </>
    );
};
