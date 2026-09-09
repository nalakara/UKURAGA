import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { FingerprintIcon, KeyIcon } from '../components/Icons';

export const LockScreen: React.FC = () => {
  const { authData, unlock, removeAuth } = useAuth();
  const { resetAllData } = useData();
  const { t } = useLocalization();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePinInput = useCallback((num: string) => {
    if (pin.length < 4) {
      setPin(prev => (prev.length < 4 ? prev + num : prev));
    }
  }, [pin.length]);

  const handleBackspace = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (authData.method !== 'pin' || isVerifying) return;
      if (/^[0-9]$/.test(e.key)) {
        handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authData.method, isVerifying, handlePinInput, handleBackspace]);

  const verifyPin = useCallback(async (currentPin: string) => {
    setIsVerifying(true);
    setError('');
    const success = await unlock(currentPin);
    if (!success) {
      setError(t('lock.incorrectPin'));
      setTimeout(() => {
        setPin('');
        setError('');
        setIsVerifying(false);
      }, 1000);
    }
  }, [unlock, t]);

  useEffect(() => {
    if (pin.length === 4) {
      verifyPin(pin);
    }
  }, [pin, verifyPin]);

  useEffect(() => {
    if (authData.method === 'biometric') {
      const attemptBiometric = async () => {
        setIsVerifying(true);
        await unlock();
        setIsVerifying(false);
      };
      attemptBiometric();
    }
  }, [authData.method, unlock]);

  const handleConfirmReset = () => {
    resetAllData();
    removeAuth();
    setShowResetConfirm(false);
  };

  const PinDots = () => (
    <div className="flex justify-center space-x-4 my-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-colors duration-200 ${
            pin.length > i ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        ></div>
      ))}
    </div>
  );

  const KeypadButton: React.FC<{ value: string; onClick: (val: string) => void; isIcon?: boolean; ariaLabel?: string }> = ({ value, onClick, isIcon = false, ariaLabel }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      disabled={isVerifying}
      aria-label={ariaLabel || value}
      className="w-20 h-20 rounded-full bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm text-3xl font-medium text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg disabled:opacity-50 flex items-center justify-center active:scale-95 transition-all"
    >
      {isIcon ? <div dangerouslySetInnerHTML={{__html: value}} /> : value}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4 text-center">
      <div className="flex items-center space-x-3 mb-4">
          {authData.method === 'pin' ? <KeyIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400"/> : <FingerprintIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400"/>}
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{t('lock.title')}</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {authData.method === 'biometric' ? t('lock.unlockBiometric') : t('lock.unlockPin')}
      </p>

      {authData.method === 'pin' && <PinDots />}
      
      {error && <p className="text-red-500 h-6 my-2 font-medium">{error}</p>}
      {!error && isVerifying && <p className="text-indigo-600 dark:text-indigo-400 h-6 my-2 font-medium">{t('lock.verifying')}</p>}
      {!error && !isVerifying && <div className="h-6 my-2" />}

      {authData.method === 'pin' && (
        <div className="grid grid-cols-3 gap-6">
          <KeypadButton value="1" onClick={handlePinInput} />
          <KeypadButton value="2" onClick={handlePinInput} />
          <KeypadButton value="3" onClick={handlePinInput} />
          <KeypadButton value="4" onClick={handlePinInput} />
          <KeypadButton value="5" onClick={handlePinInput} />
          <KeypadButton value="6" onClick={handlePinInput} />
          <KeypadButton value="7" onClick={handlePinInput} />
          <KeypadButton value="8" onClick={handlePinInput} />
          <KeypadButton value="9" onClick={handlePinInput} />
          <div />
          <KeypadButton value="0" onClick={handlePinInput} />
          <KeypadButton 
            value='<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>' 
            onClick={handleBackspace} 
            isIcon 
            ariaLabel="Backspace"
          />
        </div>
      )}

      {!showResetConfirm ? (
        <button 
          type="button"
          onClick={() => setShowResetConfirm(true)} 
          className="mt-8 min-h-[44px] px-4 py-2 text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
        >
          {t('lock.forgotPin')}
        </button>
      ) : (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl max-w-sm w-full">
          <p className="text-sm text-red-700 dark:text-red-300 mb-3 font-medium">{t('lock.resetConfirm')}</p>
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="min-h-[40px] px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              {t('general.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="min-h-[40px] px-4 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              {t('general.confirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};