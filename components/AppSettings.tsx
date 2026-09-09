
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { ThemeToggle } from './ThemeToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { NOTIFICATION_ICON_URL } from '../constants';
import { Language } from '../types';
import { getUserApiKey, setUserApiKey, checkServerKeyStatus } from '../lib/ai';

export const AppSettings: React.FC = () => {
    const { language, setLanguage, t } = useLocalization();
    const [remindersEnabled, setRemindersEnabled] = useLocalStorage('ukuraga_reminders', false);
    const [byokKey, setByokKey] = useState('');
    const [savedKey, setSavedKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [hasServerKey, setHasServerKey] = useState(false);
    const [keySavedMessage, setKeySavedMessage] = useState(false);

    useEffect(() => {
        const current = getUserApiKey();
        setSavedKey(current);
        setByokKey(current);
        checkServerKeyStatus().then(setHasServerKey);
    }, []);

    const handleSaveKey = () => {
        setUserApiKey(byokKey);
        setSavedKey(byokKey.trim());
        setKeySavedMessage(true);
        setTimeout(() => setKeySavedMessage(false), 2500);
    };

    const handleClearKey = () => {
        setUserApiKey('');
        setByokKey('');
        setSavedKey('');
        setKeySavedMessage(true);
        setTimeout(() => setKeySavedMessage(false), 2500);
    };

    const handleReminderToggle = async () => {
        const newStatus = !remindersEnabled;
        if (newStatus && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setRemindersEnabled(true);
                    new Notification(t('general.appName'), {
                        body: t('notifications.reminderEnabled'),
                        icon: NOTIFICATION_ICON_URL
                    });
                    return;
                }
            } catch {
                // Ignore permission error
            }
        }
        setRemindersEnabled(newStatus);
    };

    return (
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">{t('profile.settingsTitle')}</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="flex justify-between items-center py-3">
                    <span className="text-light-text dark:text-dark-text font-medium">{t('profile.darkTheme')}</span>
                    <ThemeToggle />
                </li>
                <li className="flex justify-between items-center py-3">
                    <span className="text-light-text dark:text-dark-text font-medium">{t('profile.language')}</span>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        aria-label={t('profile.language')}
                        className="min-h-[44px] px-3 py-2 text-sm rounded-lg bg-light-bg dark:bg-gray-800 text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                    >
                        <option value={Language.ID}>Bahasa Indonesia</option>
                        <option value={Language.EN}>English</option>
                    </select>
                </li>
                <li className="flex justify-between items-center py-3">
                    <div>
                        <p className="text-light-text dark:text-dark-text font-medium">{t('profile.weeklyReminder')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('profile.weeklyReminderDesc')}</p>
                    </div>
                    <label className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={remindersEnabled} 
                            onChange={handleReminderToggle} 
                            aria-label={t('profile.weeklyReminder')}
                            className="sr-only peer" 
                        />
                        <div className="relative w-11 h-6 bg-gray-300 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-dark-card rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 transition-colors"></div>
                    </label>
                </li>

                {/* Gemini AI BYOK Setting */}
                <li className="py-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-light-text dark:text-dark-text font-medium">Gemini AI (BYOK)</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {savedKey 
                                    ? 'API key kustom aktif' 
                                    : hasServerKey 
                                        ? 'Menggunakan kunci server bawaan' 
                                        : 'Belum ada API key terpasang'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowKeyInput(prev => !prev)}
                            className="min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
                        >
                            {showKeyInput ? 'Tutup' : savedKey ? 'Ubah Kunci' : 'Atur Kunci'}
                        </button>
                    </div>

                    {showKeyInput && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Google Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={byokKey}
                                onChange={(e) => setByokKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full min-h-[40px] px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 mb-2 font-mono"
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Dapatkan gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google AI Studio</a>.
                                </p>
                                <div className="flex space-x-2">
                                    {savedKey && (
                                        <button
                                            type="button"
                                            onClick={handleClearKey}
                                            className="min-h-[36px] px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleSaveKey}
                                        className="min-h-[36px] px-4 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                            {keySavedMessage && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                                    Pengaturan API key berhasil diperbarui!
                                </p>
                            )}
                        </div>
                    )}
                </li>
            </ul>
        </div>
    );
};
