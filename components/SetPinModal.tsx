import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { CloseIcon } from './Icons';

interface SetPinModalProps {
  onClose: () => void;
  onSetPin: (pin: string) => void;
}

export const SetPinModal: React.FC<SetPinModalProps> = ({ onClose, onSetPin }) => {
  const { t } = useLocalization();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1 for setting, 2 for confirming
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleInput = (num: string) => {
    if (step === 1 && pin.length < 4) {
      setPin(pin + num);
    } else if (step === 2 && confirmPin.length < 4) {
      setConfirmPin(confirmPin + num);
    }
  };

  const handleBackspace = () => {
    if (step === 1) {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleNext = () => {
    if (pin.length === 4) {
      setStep(2);
      setError('');
    }
  };

  const handleConfirm = () => {
    if (pin === confirmPin) {
      onSetPin(pin);
    } else {
      setError(t('pinModal.pinMismatch'));
      setTimeout(() => {
        setPin('');
        setConfirmPin('');
        setStep(1);
        setError('');
      }, 1500);
    }
  };

  const PinDots: React.FC<{ length: number }> = ({ length }) => (
    <div className="flex justify-center space-x-4 my-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-3.5 h-3.5 rounded-full transition-colors duration-200 ${
            length > i ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        ></div>
      ))}
    </div>
  );
  
  const KeypadButton: React.FC<{ value: string; onClick: (val: string) => void; isIcon?: boolean; ariaLabel?: string }> = ({ value, onClick, isIcon = false, ariaLabel }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      aria-label={ariaLabel || value}
      className="w-16 h-16 rounded-full bg-light-bg dark:bg-dark-bg text-2xl font-medium text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card active:scale-95 transition-transform"
    >
       {isIcon ? <div className="w-7 h-7 mx-auto flex items-center justify-center" dangerouslySetInnerHTML={{__html: value}} /> : value}
    </button>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div 
        className="bg-light-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 w-full max-w-xs relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          aria-label={t('general.close') || 'Close'}
          className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2 id="pin-modal-title" className="text-lg font-bold mb-2 text-light-text dark:text-dark-text pt-2">
          {step === 1 ? t('pinModal.createTitle') : t('pinModal.confirmTitle')}
        </h2>
        
        <PinDots length={step === 1 ? pin.length : confirmPin.length} />

        {error && <p className="text-red-500 h-5 text-sm my-1">{error}</p>}
        {!error && <div className="h-5 my-1" />}

        <div className="grid grid-cols-3 gap-4 justify-items-center">
            {'123456789'.split('').map(num => <KeypadButton key={num} value={num} onClick={handleInput} />)}
            <div/>
            <KeypadButton value="0" onClick={handleInput} />
            <KeypadButton 
              value='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>' 
              onClick={handleBackspace} 
              isIcon 
              ariaLabel="Backspace"
            />
        </div>
        
        <button 
          onClick={step === 1 ? handleNext : handleConfirm}
          disabled={(step === 1 && pin.length !== 4) || (step === 2 && confirmPin.length !== 4)}
          className="w-full mt-6 min-h-[44px] bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card transition-colors"
        >
          {step === 1 ? t('general.continue') : t('general.confirm')}
        </button>
      </div>
    </div>
  );
};