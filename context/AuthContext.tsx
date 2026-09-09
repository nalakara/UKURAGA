import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AuthData, AuthMethod } from '../types';
import { hashPin, registerBiometric, verifyBiometric } from '../lib/auth';

export interface AuthContextType {
  isLocked: boolean;
  authData: AuthData;
  setupAuth: (method: AuthMethod, pin?: string) => Promise<void>;
  removeAuth: () => void;
  unlock: (pin?: string) => Promise<boolean>;
  lock: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialAuthData: AuthData = { method: 'none' };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useLocalStorage<AuthData>('ukuraga_auth', initialAuthData);
  const [isLocked, setIsLocked] = useState(authData.method !== 'none');

  const setupAuth = useCallback(async (method: AuthMethod, pin?: string) => {
    if (method === 'pin' && pin) {
      const pinHash = await hashPin(pin);
      setAuthData({ method: 'pin', pinHash });
    } else if (method === 'biometric') {
      const cred = await registerBiometric();
      if (cred) {
        setAuthData({ method: 'biometric', credentialId: cred.rawId });
      } else {
         // This alert will be shown in the language selected by the user.
         // This is a simplification. For a better UX, this should be a non-blocking toast/notification
         // managed in the component layer, not the context layer.
         alert('Biometric registration failed. Please try again.');
      }
    }
  }, [setAuthData]);

  const removeAuth = useCallback(() => {
    setAuthData(initialAuthData);
    setIsLocked(false);
  }, [setAuthData]);

  const unlock = useCallback(async (pin?: string): Promise<boolean> => {
    if (authData.method === 'pin' && pin && authData.pinHash) {
      const attemptHash = await hashPin(pin);
      if (attemptHash === authData.pinHash) {
        setIsLocked(false);
        return true;
      }
    } else if (authData.method === 'biometric' && authData.credentialId) {
      const success = await verifyBiometric(authData.credentialId);
      if (success) {
        setIsLocked(false);
        return true;
      }
    }
    return false;
  }, [authData]);
  
  const lock = useCallback(() => {
    if (authData.method !== 'none') {
        setIsLocked(true);
    }
  }, [authData.method]);

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            lock();
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lock]);

  const value = { isLocked, authData, setupAuth, removeAuth, unlock, lock };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};