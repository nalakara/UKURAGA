import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useLocalization } from '../context/LocalizationContext';
import type { Measurement } from '../types';

interface HistoryChartProps {
    data: Measurement[];
    unit: string;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, unit }) => {
    const { theme } = useTheme();
    const { getLocale, t } = useLocalization();

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString(getLocale(), options);
    };

    const chartData = data.map(m => ({ ...m, date: formatDate(m.date) })).reverse();

    const colors = {
        light: { text: '#374151', stroke: '#4f46e5', grid: '#e5e7eb' },
        dark: { text: '#d1d5db', stroke: '#818cf8', grid: '#374151' }
    };

    const currentColors = colors[theme];

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-light-bg dark:bg-dark-card rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">{t('history.noData')}</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentColors.grid} />
                    <XAxis dataKey="date" tick={{ fill: currentColors.text, fontSize: 12 }} />
                    <YAxis tick={{ fill: currentColors.text, fontSize: 12 }} unit={unit} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    <Line type="monotone" dataKey="value" stroke={currentColors.stroke} strokeWidth={2} name={t('general.value')} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};