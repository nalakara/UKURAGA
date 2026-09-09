
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Measurement, Profile, AchievementId, Gender, Goal, PhotoEntry, CustomMeasurementType, MeasurementConfig } from '../types';
import { ActivityLevel } from '../types';
import { checkNewAchievements } from '../lib/achievements';
import { DEFAULT_MEASUREMENT_CONFIG } from '../constants';
import { useLocalization } from './LocalizationContext';
import { savePhotoToDB, deletePhotoFromDB, clearAllPhotosFromDB, migrateLegacyPhotos } from '../lib/storage';

interface DataContextType {
  measurements: Measurement[];
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => void;
  upsertMeasurement: (data: { type: string; date: string; value: number | null; }) => void;
  profile: Profile;
  setProfile: (profile: Profile) => void;
  getLatestMeasurement: (type: string) => Measurement | undefined;
  getHistoryForType: (type: string) => Measurement[];
  unlockedAchievements: AchievementId[];
  newlyUnlockedAchievements: AchievementId[];
  dismissNewAchievements: () => void;
  resetAllData: () => void;
  activeGoal: Goal | null;
  setGoal: (goal: Omit<Goal, 'id'>) => void;
  removeGoal: () => void;
  photos: PhotoEntry[];
  addPhoto: (photo: Omit<PhotoEntry, 'id'>) => void;
  deletePhoto: (id: string) => void;
  customMeasurementTypes: CustomMeasurementType[];
  addCustomMeasurementType: (type: Omit<CustomMeasurementType, 'id'>) => void;
  updateCustomMeasurementType: (type: CustomMeasurementType) => void;
  deleteCustomMeasurementType: (id: string) => void;
  getMeasurementConfig: (type: string) => MeasurementConfig;
  allMeasurementTypes: CustomMeasurementType[];
  removedDefaultTypes: string[];
  toggleDefaultMeasurementTypeVisibility: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLocalization();
  const [measurements, setMeasurements] = useLocalStorage<Measurement[]>('ukuraga_measurements', []);
  const [profile, setProfileState] = useLocalStorage<Profile>('ukuraga_profile', { name: 'User', gender: 'unspecified' as Gender, birthDate: '', height: undefined, activityLevel: ActivityLevel.UNSPECIFIED });
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<AchievementId[]>('ukuraga_achievements', []);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<AchievementId[]>([]);
  const [activeGoal, setActiveGoal] = useLocalStorage<Goal | null>('ukuraga_goal', null);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [customMeasurementTypes, setCustomMeasurementTypes] = useLocalStorage<CustomMeasurementType[]>('ukuraga_custom_types', []);
  const [removedDefaultTypes, setRemovedDefaultTypes] = useLocalStorage<string[]>('ukuraga_removed_defaults', []);

  // Load & migrate photos from IndexedDB on startup
  useEffect(() => {
    migrateLegacyPhotos().then(loadedPhotos => {
      setPhotos(loadedPhotos);
    }).catch(err => {
      console.error('Failed to initialize photos from IndexedDB:', err);
    });
  }, []);


  const checkAndUnlockAchievements = (currentMeasurements: Measurement[], currentProfile: Profile) => {
    const newAchievements = checkNewAchievements(currentMeasurements, currentProfile, unlockedAchievements);
    if (newAchievements.length > 0) {
      const allNew = [...unlockedAchievements, ...newAchievements];
      setUnlockedAchievements(allNew);
      setNewlyUnlockedAchievements(newAchievements);
    }
  };
  
  const addMeasurement = (measurement: Omit<Measurement, 'id'>) => {
    const newMeasurement: Measurement = {
      ...measurement,
      id: measurement.date + Math.random(),
    };
    const updatedMeasurements = [...measurements, newMeasurement].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setMeasurements(updatedMeasurements);
    checkAndUnlockAchievements(updatedMeasurements, profile);
  };

  const upsertMeasurement = (data: { type: string; date: string; value: number | null; }) => {
    const { type, date, value } = data;
    const dateString = new Date(date).toISOString().split('T')[0];

    const existingIndex = measurements.findIndex(m => 
        m.type === type && new Date(m.date).toISOString().split('T')[0] === dateString
    );

    let updatedMeasurements = [...measurements];

    if (value === null || isNaN(value)) { // Handle deletion
        if (existingIndex > -1) {
            updatedMeasurements.splice(existingIndex, 1);
        }
    } else { // Handle add/update
        const measurementData = {
            type,
            value,
            date,
            note: '', // Note editing is removed from this simplified UI
        };

        if (existingIndex > -1) {
            updatedMeasurements[existingIndex] = { 
                ...updatedMeasurements[existingIndex],
                ...measurementData,
            };
        } else {
            const newMeasurement: Measurement = {
                ...measurementData,
                id: date + type + Math.random(),
            };
            updatedMeasurements.push(newMeasurement);
        }
    }
    
    const sortedMeasurements = updatedMeasurements.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setMeasurements(sortedMeasurements);
    checkAndUnlockAchievements(sortedMeasurements, profile);
  };

  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
    checkAndUnlockAchievements(measurements, newProfile);
  }
  
  const getLatestMeasurement = (type: string): Measurement | undefined => {
    return measurements
      .filter(m => m.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const getHistoryForType = (type: string): Measurement[] => {
      return measurements
        .filter(m => m.type === type)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const dismissNewAchievements = useCallback(() => {
    setNewlyUnlockedAchievements([]);
  }, []);

  const setGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
        ...goal,
        id: `${goal.type}-${new Date().getTime()}`,
    };
    setActiveGoal(newGoal);
  }, [setActiveGoal]);

  const removeGoal = useCallback(() => {
    setActiveGoal(null);
  }, [setActiveGoal]);

  const addPhoto = useCallback((photo: Omit<PhotoEntry, 'id'>) => {
    const newPhoto: PhotoEntry = {
        ...photo,
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
    savePhotoToDB(newPhoto).catch(err => {
      console.error('Failed to save photo to IndexedDB:', err);
    });
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== id));
    deletePhotoFromDB(id).catch(err => {
      console.error('Failed to delete photo from IndexedDB:', err);
    });
  }, []);

    const addCustomMeasurementType = useCallback((type: Omit<CustomMeasurementType, 'id'>) => {
        const newType: CustomMeasurementType = {
            ...type,
            id: `custom_${new Date().getTime()}`
        };
        setCustomMeasurementTypes(prev => [...prev, newType]);
    }, [setCustomMeasurementTypes]);

    const updateCustomMeasurementType = useCallback((type: CustomMeasurementType) => {
        setCustomMeasurementTypes(prev => prev.map(t => t.id === type.id ? type : t));
    }, [setCustomMeasurementTypes]);

    const deleteCustomMeasurementType = useCallback((id: string) => {
        // First, remove the type definition
        setCustomMeasurementTypes(prev => prev.filter(t => t.id !== id));
        // Then, remove all measurement entries associated with this type
        setMeasurements(prev => prev.filter(m => m.type !== id));
    }, [setCustomMeasurementTypes, setMeasurements]);
    
    const toggleDefaultMeasurementTypeVisibility = useCallback((id: string) => {
        setRemovedDefaultTypes(prev => {
            const isRemoved = prev.includes(id);
            if (isRemoved) { // re-adding
                return prev.filter(item => item !== id);
            } else { // removing
                // Also remove all measurement entries associated with this type
                setMeasurements(prevMeasurements => prevMeasurements.filter(m => m.type !== id));
                return [...prev, id];
            }
        });
    }, [setRemovedDefaultTypes, setMeasurements]);
    
    const getMeasurementConfig = useCallback((type: string): MeasurementConfig => {
        const customType = customMeasurementTypes.find(t => t.id === type);
        if (customType) {
            return { name: customType.name, unit: customType.unit };
        }
        if (DEFAULT_MEASUREMENT_CONFIG[type]) {
            return { name: t(`measurements.${type}`), unit: DEFAULT_MEASUREMENT_CONFIG[type].unit };
        }
        return { name: type, unit: '' }; // Fallback
    }, [customMeasurementTypes, t]);

    const allMeasurementTypes = useMemo<CustomMeasurementType[]>(() => {
      const defaults = Object.keys(DEFAULT_MEASUREMENT_CONFIG)
          .filter(id => !removedDefaultTypes.includes(id))
          .map(id => ({
          id,
          name: t(`measurements.${id}`),
          unit: DEFAULT_MEASUREMENT_CONFIG[id].unit,
      }));
      return [...defaults, ...customMeasurementTypes];
    }, [t, customMeasurementTypes, removedDefaultTypes]);


  const resetAllData = useCallback(() => {
    setMeasurements([]);
    setProfileState({ name: 'User', gender: 'unspecified' as Gender, birthDate: '', height: undefined, activityLevel: ActivityLevel.UNSPECIFIED });
    setUnlockedAchievements([]);
    setActiveGoal(null);
    setPhotos([]);
    clearAllPhotosFromDB();
    setCustomMeasurementTypes([]);
    setRemovedDefaultTypes([]);
    window.localStorage.removeItem('ukuraga_goal');
    window.localStorage.removeItem('ukuraga_reminders');
    window.localStorage.removeItem('ukuraga_last_reminder');
    window.localStorage.removeItem('ukuraga_theme');
    window.localStorage.removeItem('ukuraga_language');
    window.localStorage.removeItem('ukuraga_photos');
    window.localStorage.removeItem('ukuraga_custom_types');
    window.localStorage.removeItem('ukuraga_removed_defaults');
  }, [setMeasurements, setProfileState, setUnlockedAchievements, setActiveGoal, setPhotos, setCustomMeasurementTypes, setRemovedDefaultTypes]);


  return (
    <DataContext.Provider value={{ 
        measurements, addMeasurement, upsertMeasurement, 
        profile, setProfile, 
        getLatestMeasurement, getHistoryForType, 
        unlockedAchievements, newlyUnlockedAchievements, dismissNewAchievements, 
        resetAllData, 
        activeGoal, setGoal, removeGoal, 
        photos, addPhoto, deletePhoto,
        customMeasurementTypes, addCustomMeasurementType, updateCustomMeasurementType, deleteCustomMeasurementType,
        getMeasurementConfig, allMeasurementTypes,
        removedDefaultTypes, toggleDefaultMeasurementTypeVisibility
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};