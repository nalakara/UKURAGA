import { PhotoEntry } from '../types';

const DB_NAME = 'ukuraga_db';
const DB_VERSION = 1;
const STORE_PHOTOS = 'photos';

function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            reject(new Error('IndexedDB is not supported in this environment.'));
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
                db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllPhotosFromDB(): Promise<PhotoEntry[]> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_PHOTOS, 'readonly');
            const store = tx.objectStore(STORE_PHOTOS);
            const request = store.getAll();

            request.onsuccess = () => {
                const photos = (request.result as PhotoEntry[]) || [];
                // Sort newest date first
                photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                resolve(photos);
            };
            request.onerror = () => reject(request.error);
        });
    } catch (err) {
        console.error('Failed to load photos from IndexedDB:', err);
        return [];
    }
}

export async function savePhotoToDB(photo: PhotoEntry): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PHOTOS, 'readwrite');
        const store = tx.objectStore(STORE_PHOTOS);
        const request = store.put(photo);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function deletePhotoFromDB(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PHOTOS, 'readwrite');
        const store = tx.objectStore(STORE_PHOTOS);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function clearAllPhotosFromDB(): Promise<void> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_PHOTOS, 'readwrite');
            const store = tx.objectStore(STORE_PHOTOS);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (err) {
        console.error('Failed to clear photos from IndexedDB:', err);
    }
}

/**
 * Migrates any legacy photos stored in localStorage to IndexedDB once,
 * then cleans up the localStorage key to free up precious quota.
 */
export async function migrateLegacyPhotos(): Promise<PhotoEntry[]> {
    if (typeof window === 'undefined') return [];

    try {
        const legacyData = window.localStorage.getItem('ukuraga_photos');
        if (legacyData) {
            const parsed: PhotoEntry[] = JSON.parse(legacyData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                for (const photo of parsed) {
                    await savePhotoToDB(photo);
                }
            }
            window.localStorage.removeItem('ukuraga_photos');
        }
    } catch (e) {
        console.warn('Error during legacy photo migration:', e);
    }

    return getAllPhotosFromDB();
}

/**
 * Compresses and resizes an uploaded image using HTML Canvas
 * to prevent quota issues and optimize rendering performance.
 */
export function compressImage(
    file: File,
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.8
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    // Fallback to original if canvas context not available
                    resolve(img.src);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Prefer image/webp if supported, otherwise image/jpeg
                try {
                    const dataUrl = canvas.toDataURL('image/webp', quality);
                    if (dataUrl.startsWith('data:image/webp')) {
                        resolve(dataUrl);
                        return;
                    }
                } catch {
                    // Ignore and fallback to JPEG
                }

                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}
