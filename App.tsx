
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { RecordPage } from './pages/RecordPage';
import { LockScreen } from './pages/LockScreen';
import { BottomNav } from './components/BottomNav';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AchievementToast } from './components/AchievementToast';
import { NOTIFICATION_ICON_URL } from './constants';
import { GalleryPage } from './pages/GalleryPage';


const MainApp: React.FC = () => {
    const { measurements, newlyUnlockedAchievements, dismissNewAchievements } = useData();
    const { t } = useLocalization();
    const [remindersEnabled] = useLocalStorage('ukuraga_reminders', false);
    const [lastReminder, setLastReminder] = useLocalStorage('ukuraga_last_reminder', '');
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (remindersEnabled && Notification.permission === 'granted') {
            const lastMeasurementDate = measurements.length > 0
                ? new Date(measurements[measurements.length - 1].date)
                : null;
            
            const now = new Date();
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            const lastReminderDate = lastReminder ? new Date(lastReminder) : null;

            if (lastMeasurementDate && (now.getTime() - lastMeasurementDate.getTime()) > sevenDays) {
                if (!lastReminderDate || (now.getTime() - lastReminderDate.getTime()) > sevenDays) {
                    new Notification(t('notifications.reminderTitle'), {
                        body: t('notifications.reminderBody'),
                        icon: NOTIFICATION_ICON_URL,
                    });
                    setLastReminder(now.toISOString());
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remindersEnabled, measurements]);

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
            <main className="pb-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/record" element={<RecordPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
                <AchievementToast 
                    newAchievements={newlyUnlockedAchievements}
                    onDismiss={dismissNewAchievements}
                />
            </main>
            <BottomNav />
        </div>
    );
};

const AppContent: React.FC = () => {
    const { isLocked } = useAuth();

    return isLocked ? <LockScreen /> : <MainApp />;
}

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LocalizationProvider>
                <DataProvider>
                    <AuthProvider>
                        <HashRouter>
                            <AppContent />
                        </HashRouter>
                    </AuthProvider>
                </DataProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default App;
