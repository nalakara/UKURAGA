
export interface CustomMeasurementType {
    id: string;
    name: string;
    unit: string;
}

export interface Measurement {
    id: string;
    date: string;
    type: string; // Was MeasurementType enum
    value: number;
    note?: string;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    UNSPECIFIED = 'unspecified',
}

export enum Language {
    ID = 'id',
    EN = 'en',
}

export enum ActivityLevel {
    UNSPECIFIED = 'unspecified',
    SEDENTARY = 'sedentary', // little or no exercise
    LIGHTLY_ACTIVE = 'lightly_active', // light exercise/sports 1-3 days/week
    MODERATELY_ACTIVE = 'moderately_active', // moderate exercise/sports 3-5 days/week
    VERY_ACTIVE = 'very_active', // hard exercise/sports 6-7 days a week
}

export interface Profile {
    name: string;
    gender: Gender;
    birthDate: string; // YYYY-MM-DD
    height?: number; // in cm
    activityLevel: ActivityLevel;
}

export interface MeasurementConfig {
    name: string;
    unit: string;
}

export type AchievementId = 'FIRST_ENTRY' | 'EXPLORER' | 'CONSISTENT_WEEK' | 'PROFILER';

export interface Achievement {
    id: AchievementId;
    icon: string;
}

export type AuthMethod = 'none' | 'pin' | 'biometric';

export interface AuthData {
    method: AuthMethod;
    pinHash?: string; // For PIN
    credentialId?: string; // For Biometric
}

export interface Goal {
  id: string;
  type: string; // Was MeasurementType
  targetValue: number;
  startingValue: number;
  startDate: string; // ISO date string
}

export interface PhotoEntry {
    id: string;
    date: string; // YYYY-MM-DD
    image: string; // base64 data URL
    note?: string;
}