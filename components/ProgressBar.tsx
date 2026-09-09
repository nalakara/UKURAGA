
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
            className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
        ></div>
    </div>
);
