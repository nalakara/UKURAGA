
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { Measurement } from '../types';
import { HistoryChart } from '../components/HistoryChart';
import { DownloadIcon } from '../components/Icons';

export const HistoryPage: React.FC = () => {
    const { measurements, getHistoryForType, allMeasurementTypes, getMeasurementConfig } = useData();
    const { t, getLocale } = useLocalization();
    const [selectedType, setSelectedType] = useState<string>('weight');

    const historyDataForChart = getHistoryForType(selectedType);
    const chartConfig = getMeasurementConfig(selectedType);
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00'); // Ensure date is parsed in local timezone
        return date.toLocaleDateString(getLocale(), {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' })
    }

    const handleExport = () => {
        if (measurements.length === 0) return;

        const headers = `${t('general.date')},${t('general.type')},${t('general.value')},${t('general.unit')},${t('general.note')}`;
        const csvContent = [...measurements]
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(m => {
                const config = getMeasurementConfig(m.type);
                const date = `"${new Date(m.date).toLocaleString(getLocale())}"`;
                const type = config.name;
                const value = m.value;
                const unit = config.unit;
                const note = `"${m.note || ''}"`;
                return [date, type, value, unit, note].join(',');
            })
            .join('\n');
        
        const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `ukuraga_history_all.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const groupedMeasurements = useMemo(() => {
        return [...measurements]
            .reverse() // Most recent first
            .reduce((acc, measurement) => {
            const dateKey = new Date(measurement.date).toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(measurement);
            return acc;
        }, {} as Record<string, Measurement[]>);
    }, [measurements]);

    const sortedDates = useMemo(() => Object.keys(groupedMeasurements), [groupedMeasurements]);

    return (
        <div className="p-4 space-y-6">

            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{t('history.title')}</h1>
            
            <div className="mb-6">
                <label htmlFor="history-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('history.selectData')}</label>
                <select
                    id="history-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                    {allMeasurementTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
            </div>

            <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">{t('history.chartTitle')}</h2>
                <HistoryChart data={historyDataForChart} unit={chartConfig.unit} />
            </div>

            <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">{t('history.dataLog')}</h2>
                    <button 
                        type="button"
                        onClick={handleExport} 
                        disabled={measurements.length === 0} 
                        className="min-h-[44px] px-3 py-2 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <DownloadIcon className="h-4 w-4 mr-1.5"/>
                        {t('history.export')}
                    </button>
                 </div>
                 <div className="flow-root">
                    {sortedDates.length > 0 ? (
                        <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedDates.map(date => (
                                <li key={date} className="py-4">
                                    <div className="mb-3">
                                        <p className="text-base font-semibold text-light-text dark:text-dark-text">{formatDate(date)}</p>
                                    </div>
                                    <ul className="space-y-1 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800">
                                        {groupedMeasurements[date].map(m => {
                                            const config = getMeasurementConfig(m.type);
                                            return (
                                                <li 
                                                    key={m.id}
                                                    onClick={() => setSelectedType(m.type)}
                                                    className="flex items-center justify-between pl-3 py-2 rounded-md -ml-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-light-text dark:text-dark-text">{config.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(m.date)}</p>
                                                    </div>
                                                    <div className="inline-flex items-baseline text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {m.value.toLocaleString(getLocale())}
                                                        <span className="text-sm font-normal ml-1.5 text-gray-500 dark:text-gray-400">{config.unit}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('history.noRecords')}</div>
                    )}
                 </div>
            </div>
        </div>
    );
};
