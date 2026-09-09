import React, { useState, useMemo, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
  highlightedDates: string[]; // array of YYYY-MM-DD strings
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, highlightedDates }) => {
  const { getLocale } = useLocalization();
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate + 'T00:00:00'));

  useEffect(() => {
    // When the selected date prop changes, update the calendar's view to that month.
    setViewDate(new Date(selectedDate + 'T00:00:00'));
  }, [selectedDate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const toISODateString = (date: Date) => date.toISOString().split('T')[0];

  const days = useMemo(() => {
    const daysInMonth = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    
    // Days from previous month
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    for (let i = startingDayOfWeek; i > 0; i--) {
        const day = new Date(year, month, 1 - i);
        daysInMonth.push({ date: day, isCurrentMonth: false });
    }

    // Days from current month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const day = new Date(year, month, i);
        daysInMonth.push({ date: day, isCurrentMonth: true });
    }
    
    // Days from next month & padding to 6 weeks for consistent height
    while(daysInMonth.length < 42) {
      const lastDay = daysInMonth[daysInMonth.length - 1].date;
      const nextDay = new Date(lastDay);
      nextDay.setDate(lastDay.getDate() + 1);
      daysInMonth.push({ date: nextDay, isCurrentMonth: false });
    }

    return daysInMonth;
  }, [viewDate]);
  
  const changeMonth = (offset: number) => {
    setViewDate(current => {
        const newDate = new Date(current);
        newDate.setMonth(newDate.getMonth() + offset);
        return newDate;
    });
  };

  const weekDayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(getLocale(), { weekday: 'short' });
    const sunday = new Date(2023, 0, 1); // A known Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      return formatter.format(day)
    });
  }, [getLocale]);

  return (
    <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h3 className="font-semibold text-lg text-light-text dark:text-dark-text capitalize">
          {viewDate.toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' })}
        </h3>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Next month"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-y-1">
        {weekDayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">{day}</div>
        ))}
        
        {days.map(({ date, isCurrentMonth }, index) => {
          const dateStr = toISODateString(date);
          const isSelected = dateStr === selectedDate;
          const isTodayDate = toISODateString(today) === dateStr;
  
          const hasData = highlightedDates.includes(dateStr);
          const isFuture = date > today;

          const buttonClasses = [
            'w-10 h-10 rounded-full flex items-center justify-center relative mx-auto text-sm font-medium',
            'transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
            isCurrentMonth ? 'text-light-text dark:text-dark-text' : 'text-gray-500 dark:text-gray-400 font-normal',
            isFuture ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            isSelected ? 'bg-indigo-600 text-white font-bold shadow-sm' : '',
            !isSelected && isTodayDate ? 'border-2 border-indigo-600' : ''
          ].filter(Boolean).join(' ');

          return (
            <div key={index} className="min-h-[44px] min-w-[44px] flex justify-center items-center">
              <button
                type="button"
                disabled={isFuture}
                onClick={() => onDateSelect(dateStr)}
                className={buttonClasses}
                aria-pressed={isSelected}
                aria-label={date.toLocaleDateString(getLocale(), { day: 'numeric', month: 'long', year: 'numeric' })}
              >
                {date.getDate()}
                {hasData && !isSelected && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};