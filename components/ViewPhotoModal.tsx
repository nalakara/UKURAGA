
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { CloseIcon, TrashIcon } from './Icons';
import type { PhotoEntry } from '../types';

interface ViewPhotoModalProps {
  photo: PhotoEntry;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const ViewPhotoModal: React.FC<ViewPhotoModalProps> = ({ photo, onClose, onDelete }) => {
    const { t, getLocale } = useLocalization();
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isConfirmingDelete) {
                    setIsConfirmingDelete(false);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, isConfirmingDelete]);

    const handleConfirmDelete = () => {
        onDelete(photo.id);
        onClose();
    };
    
    const formattedDate = new Date(photo.date + 'T00:00:00').toLocaleDateString(getLocale(), {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div 
            className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-detail-date"
        >
            <div 
                className="bg-light-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg relative text-left overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4">
                     <img src={photo.image} alt={photo.note || formattedDate} className="w-full h-auto max-h-[65vh] object-contain rounded-lg bg-black/5 dark:bg-black/40" />
                </div>
               
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {!isConfirmingDelete ? (
                        <div className="flex justify-between items-center gap-3">
                            <div>
                                <p id="photo-detail-date" className="text-sm font-semibold text-light-text dark:text-dark-text">{formattedDate}</p>
                                {photo.note && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{photo.note}</p>}
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsConfirmingDelete(true)} 
                                className="min-h-[44px] flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                            >
                                <TrashIcon className="h-4 w-4" />
                                <span>{t('photoLog.deletePhoto')}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                {t('photoLog.deleteConfirm')}
                            </p>
                            <div className="flex items-center space-x-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmingDelete(false)}
                                    className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                                >
                                    {t('general.cancel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                                >
                                    {t('general.confirm')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute top-3 right-3 min-h-[44px] min-w-[44px] bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors" 
                    aria-label={t('general.close')}
                >
                    <CloseIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
