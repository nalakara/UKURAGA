
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { PhotoEntry } from '../types';
import { AddPhotoModal } from '../components/AddPhotoModal';
import { ViewPhotoModal } from '../components/ViewPhotoModal';
import { FAB } from '../components/FAB';
import { PlusIcon, CameraIcon } from '../components/Icons';

export const GalleryPage: React.FC = () => {
    const { photos, addPhoto, deletePhoto } = useData();
    const { t, getLocale } = useLocalization();
    const [modalState, setModalState] = useState<{ type: 'add' | 'view' | null, photo?: PhotoEntry }>({ type: null });

    const handleSavePhoto = (data: Omit<PhotoEntry, 'id'>) => {
        addPhoto(data);
        setModalState({ type: null });
    };

    const handleDeletePhoto = (id: string) => {
        deletePhoto(id);
        setModalState({ type: null });
    };

    const sortedPhotos = useMemo(() => {
        return [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [photos]);

    return (
        <div className="p-4">
             {modalState.type === 'add' && (
                <AddPhotoModal 
                    onClose={() => setModalState({ type: null })}
                    onSave={handleSavePhoto}
                />
            )}
            {modalState.type === 'view' && modalState.photo && (
                <ViewPhotoModal
                    photo={modalState.photo}
                    onClose={() => setModalState({ type: null })}
                    onDelete={handleDeletePhoto}
                />
            )}

            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">{t('gallery.title')}</h1>

            {sortedPhotos.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {sortedPhotos.map(photo => (
                        <button 
                            key={photo.id} 
                            type="button"
                            onClick={() => setModalState({ type: 'view', photo })} 
                            aria-label={`${t('photoLog.photoNote')} - ${new Date(photo.date + 'T00:00:00').toLocaleDateString(getLocale(), { month: 'short', day: 'numeric', year: 'numeric' })}`}
                            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg"
                        >
                            <img src={photo.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end p-2">
                                <p className="text-white text-xs font-semibold">
                                    {new Date(photo.date + 'T00:00:00').toLocaleDateString(getLocale(), { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500 dark:text-gray-400">
                    <CameraIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold">{t('gallery.noPhotos')}</h3>
                    <p className="max-w-xs">{t('gallery.addFirstPhoto')}</p>
                </div>
            )}

            <FAB onClick={() => setModalState({ type: 'add' })} aria-label={t('gallery.addPhoto')}>
                <PlusIcon className="h-7 w-7" />
            </FAB>
        </div>
    );
};
