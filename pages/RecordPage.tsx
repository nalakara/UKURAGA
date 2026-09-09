
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { useData } from '../context/DataContext';
import { MeasurementRow } from '../components/MeasurementRow';
import { Calendar } from '../components/Calendar';

export const RecordPage: React.FC = () => {
    const { t } = useLocalization();
    const { measurements, allMeasurementTypes } = useData();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const highlightedDates = useMemo(() => {
        const datesWithData = new Set(measurements.map(m => new Date(m.date).toISOString().split('T')[0]));
        return Array.from(datesWithData);
    }, [measurements]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">{t('record.title')}</h1>
            
            <div className="mb-6">
                <Calendar 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    highlightedDates={highlightedDates}
                />
            </div>
            
            <div className="space-y-3">
                {allMeasurementTypes.map(type => (
                    <MeasurementRow 
                        key={type.id}
                        type={type.id}
                        selectedDate={selectedDate}
                    />
                ))}
            </div>
        </div>
    );
};