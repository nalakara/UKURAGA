
import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { CloseIcon } from './Icons';
import type { PhotoEntry } from '../types';
import { compressImage } from '../lib/storage';

interface AddPhotoModalProps {
  onClose: () => void;
  onSave: (data: Omit<PhotoEntry, 'id'>) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ onClose, onSave }) => {
    const { t } = useLocalization();
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        if (file.size > 15 * 1024 * 1024) { // 15MB upload ceiling
            setError('File is too large. Maximum size is 15MB.');
            return;
        }
        setError('');
        setIsCompressing(true);
        try {
            const compressed = await compressImage(file, 1280, 1280, 0.8);
            setImage(compressed);
        } catch (err: any) {
            console.error('Compression failed:', err);
            setError('Failed to process image. Please try another file.');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleSave = () => {
        if (!image || !date) return;
        onSave({ date, image, note });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-photo-title"
        >
            <div 
                className="bg-light-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 w-full max-w-md relative text-left" 
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" 
                    aria-label={t('general.close')}
                >
                    <CloseIcon className="h-5 w-5" />
                </button>

                <h2 id="add-photo-title" className="text-xl font-bold mb-4 text-light-text dark:text-dark-text pr-10">
                    {t('photoLog.addPhoto')}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="photo-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('photoLog.photoDate')}
                        </label>
                        <input
                            type="date"
                            id="photo-date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="mt-1 block w-full min-h-[44px] p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('photoLog.selectImage')}
                        </span>
                        
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
                            className={`min-h-[110px] border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                                isDragging 
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' 
                                    : 'border-gray-300 dark:border-gray-700 hover:border-indigo-500 bg-light-bg dark:bg-dark-bg'
                            }`}
                        >
                            <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            id="photo-file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                        />
                        {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
                    </div>

                    {image && (
                         <div>
                            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('photoLog.imagePreview')}
                            </p>
                            <img src={image} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800" />
                        </div>
                    )}

                    <div>
                         <label htmlFor="photo-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('photoLog.photoNote')}
                         </label>
                         <textarea
                            id="photo-note"
                            rows={2}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder={t('general.note')}
                            className="mt-1 block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                         />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
                    >
                        {t('general.cancel')}
                    </button>
                     <button 
                        type="button"
                        onClick={handleSave}
                        disabled={!image || !date || isCompressing}
                        className="min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card transition-colors flex items-center space-x-2"
                    >
                        {isCompressing && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        )}
                        <span>{isCompressing ? 'Memproses...' : t('general.save')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
