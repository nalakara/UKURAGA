
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import type { Profile } from '../types';
import { Gender, ActivityLevel } from '../types';
import { calculateAge } from '../lib/utils';

export const ProfileCard: React.FC = () => {
    const { profile, setProfile } = useData();
    const { t } = useLocalization();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Profile>(profile);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleEditToggle = () => {
        if (isEditing) { // when saving
             if (formData.name.trim()) {
                setProfile(formData);
             } else {
                setFormData(profile); // revert changes if name is empty
             }
        }
        setIsEditing(!isEditing);
    };
    
    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'height' ? parseInt(value, 10) || 0 : value
        });
    };

    const age = calculateAge(profile.birthDate);
    const profileDetails = [];
    if (age !== null) profileDetails.push(`${age} ${t('profile.ageUnit')}`);
    if (profile.gender !== Gender.UNSPECIFIED) profileDetails.push(t(`general.${profile.gender}`));
    if (profile.height && profile.height > 0) profileDetails.push(`${profile.height} ${t('general.unitCm')}`);
    if (profile.activityLevel !== ActivityLevel.UNSPECIFIED) profileDetails.push(t(`activityLevels.${profile.activityLevel}`));

    return (
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-sm">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    {isEditing ? (
                        <div className="space-y-3 flex-1 min-w-0">
                            <div>
                                <label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('general.name')}</label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoFocus
                                    className="w-full min-h-[44px] px-3 py-2 text-base font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="birthDate" className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('general.birthDate')}</label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('general.height')} ({t('general.unitCm')})</label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        value={formData.height || ''}
                                        onChange={handleChange}
                                        placeholder={t('profile.heightPlaceholder')}
                                        className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="gender" className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('general.gender')}</label>
                                    <select 
                                        id="gender"
                                        name="gender" 
                                        value={formData.gender} 
                                        onChange={handleChange}
                                        className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                    >
                                        <option value={Gender.UNSPECIFIED}>{t('general.pickOne')}</option>
                                        <option value={Gender.MALE}>{t('general.male')}</option>
                                        <option value={Gender.FEMALE}>{t('general.female')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="activityLevel" className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('general.activityLevel')}</label>
                                    <select
                                        id="activityLevel"
                                        name="activityLevel"
                                        value={formData.activityLevel}
                                        onChange={handleChange}
                                        className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                    >
                                        <option value={ActivityLevel.UNSPECIFIED}>{t('general.pickOne')}</option>
                                        <option value={ActivityLevel.SEDENTARY}>{t('activityLevels.sedentary')}</option>
                                        <option value={ActivityLevel.LIGHTLY_ACTIVE}>{t('activityLevels.lightly_active')}</option>
                                        <option value={ActivityLevel.MODERATELY_ACTIVE}>{t('activityLevels.moderately_active')}</option>
                                        <option value={ActivityLevel.VERY_ACTIVE}>{t('activityLevels.very_active')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-light-text dark:text-dark-text truncate">{profile.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                                {profileDetails.length > 0 ? profileDetails.join(' • ') : t('profile.incompleteProfile')}
                            </p>
                        </div>
                    )}
                </div>
                {isEditing ? (
                    <div className="flex flex-col space-y-2 shrink-0 ml-3">
                        <button 
                            type="button"
                            onClick={handleEditToggle} 
                            className="min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 shadow-sm"
                        >
                            {t('general.save')}
                        </button>
                        <button 
                            type="button"
                            onClick={handleCancel} 
                            className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                        >
                            {t('general.cancel')}
                        </button>
                    </div>
                ) : (
                    <button 
                        type="button"
                        onClick={handleEditToggle} 
                        className="min-h-[44px] px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 shrink-0 ml-2"
                    >
                        {t('general.edit')}
                    </button>
                )}
            </div>
        </div>
    );
};
