
import React from 'react';

interface IconProps {
  className?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m-7 8a9 9 0 1118 0 9 9 0 01-18 0z" transform="scale(0.6) translate(6.5, 6.5)" />
    </svg>
);

export const FingerprintIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.588 8.26l-6.522-6.522a.75.75 0 00-1.06 0l-1.95 1.95-1.95-1.95a.75.75 0 00-1.06 0l-2.122 2.122a.75.75 0 000 1.06l2.122 2.122 2.122-2.122a.75.75 0 001.06 0l1.95 1.95-1.95 1.95a.75.75 0 000 1.06l6.522 6.522a7.5 7.5 0 01-18.26-1.588 7.5 7.5 0 012.87-5.545" />
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

export const ScaleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const TapeMeasureIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm.75 4.5c0 .414-.168.75-.375.75S9.75 14.664 9.75 14.25s.168-.75.375-.75.375.336.375.75zm4.5-.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm.75-4.5c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
    </svg>
);

export const HeartPulseIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l-2.25 2.25-1.5-1.5-2.25 2.25" />
    </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.25 2.25c.341 0 .616.275.616.616v1.232c0 .341-.275.616-.616.616a.616.616 0 01-.616-.616V2.866c0-.341.275-.616.616-.616zM5.616 4.384a.616.616 0 01.872 0l.871.871a.616.616 0 010 .872l-.871.871a.616.616 0 01-.872 0l-.871-.871a.616.616 0 010-.872l.871-.871zM16.884 4.384a.616.616 0 01.872.872l-.871.871a.616.616 0 01-.872 0l-.871-.871a.616.616 0 010-.872l.871-.871a.616.616 0 01.872 0zM19.5 11.25c0 .341-.275.616-.616.616h-1.232a.616.616 0 01-.616-.616c0-.341.275-.616.616-.616h1.232c.341 0 .616.275.616.616zM4.5 11.25c0 .341-.275.616-.616.616H2.652a.616.616 0 01-.616-.616c0-.341.275-.616.616-.616h1.232c.341 0 .616.275.616.616zM11.25 10.5c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75.784-1.75 1.75-1.75zM12 5.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75zM16.5 8.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75zM7.5 8.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75zM12 18.75a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75zM16.5 15.75a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75zM7.5 15.75a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75z" />
    </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 207.82 204.47" className={className}>
      <defs>
        <style>
          {`.st0 { fill: currentColor; }`}
        </style>
      </defs>
      <path className="st0" d="M207.05,93.74c-5.09-2.08-15.22-2.74-21.01-1.97-9.44-1.21-20.94-7.39-30.39-9.27-9.51-5.22-12.95-3.98-23.04-3.24-11.34.4-14.52-1.63-6.99-11.49,4.36-10.02,1.8-13.67-1.24-23.72-8.36-21.1-33.06-19.71-40.48,1.48-3.33,10.41-4.58,13.16-.36,23.38,1.94,2.06,4.7,5.71,3.81,8.79-5.65,3.09-12.03,1.44-18.15.54-10.97.3-17.85,5.9-28.34,7.66-8.39,2.83-15.94,5.1-25.59,5.33-3.36.08-11.84.99-14.41,2.5-1.05.62-.85,4.78-.85,6.01.5.49,11.7-2.36,13.74-2.49,8.6-.53,11.13.75,20.21-2.27,8.69-2.89,17.37-6.62,25.99-9.47,13.68-3.83,42.22,7.33,30.98-18.38-.41-.66-1.6-.2-2.41-1.71-.33-.61-2.08-7.3-2.01-7.77,5.92-31.12,31.43-29.7,35.73.81-.02.38-1.92,6.98-2.11,7.31-.64,1.07-1.89.77-2.28,1.33-11.33,26.42,17.91,13.94,32,18.92,8.94,3.31,18.39,7.12,27.58,9.88,11.18,2.57,19.59.35,30.36,3.85-.12-1.55.46-4.91-.73-6Z"/>
      <path className="st0" d="M29.75,84.78c12.15-3.2,22.18-8.39,34.51-11.44,5.82-.59,10.99.72,16.67.94-7.08-9.97-5.95-21.16-1.24-31.95,18.16-43.97,69.37-.67,48.19,31.95,18.76-4.36,35.29,5.66,52.68,11,9.64,2.25,16.89-.09,26.23,2.98-.61-1.4-.47-4.99-1.24-5.99-5.71-2.73-14.12-.96-19.86-1.61-14.55-2.69-32.37-14.77-48.32-13.37,6.24-23.11-11.98-53.93-38.65-48.88-20.09,3.99-33.24,29.98-27.28,48.88-16.55-.96-32.82,9.52-48.31,13.37-6.05-.12-14.7-.66-20.5,1.46-1.03.47-1.22,4.8-1.6,6.15,3.82-.19,7.43-1.74,11.24-1.99,7.37-.48,9.57,1.09,17.49-1.49Z"/>
      <path className="st0" d="M23.62,75.15c13.03-4.09,26.98-11.29,40.77-12.92,1.4-65.57,78.44-65.39,80.26.11,13.99,1.62,27.78,8.98,40.96,12.89,5.96.18,12.25-.18,18.19,1.04.41-.41-1.27-5.82-1.99-6.25-3.87-1.12-10.55-.44-14.5-.44-11.65-3.42-24.72-9.64-36.84-12.4C146.24,2.87,81.23-14.73,62.32,40.92c-1.64,4.99-2.54,14.15-7.1,16.88-10.82,3.07-23.21,8.67-33.72,11.78-4.35-.05-11.28-.74-15.61.71-.93.42-2.25,5.62-1.88,5.98,6.42-1.07,13.17-.88,19.61-1.12Z"/>
      <path className="st0" d="M22.12,64.16c9.85-4.11,21.1-7.63,31.33-11.12,10.92-67.88,90.63-68.27,101.64-.25,6.48,1.92,26.63,10.17,31.97,11.49h12.74c-1.77-8.7-5.36-5.45-12.12-6.11-8.23-3.69-19.11-5.88-27.12-9.84-1.44-1.06-2.91-8.98-3.71-11.28-5.74-16.4-16.87-34.16-35.86-35.56C88.54-2.61,65.99-.17,53.07,33.68c-5.44,18.87-2.75,14.46-21.59,20.37-2.89.97-7.9,3.66-10.36,4.12-6.74.73-12.36-2.49-13.12,6.61,4.51-1.3,9.61.22,14.11-.61Z"/>
      <path className="st0" d="M62.95,111.48c-4.21-5.12-10.14-.8-15.23-.24-15.85-.81-31.84,2.32-47.7,2,1.03,4.91-.59,5.72,5.22,6.01,13.98-.8,28-2.67,41.97-2.02,15.22-3.67,10.28-2.66,19,11.98,9.68,22.57,7.34,49.07,4.22,72.69-.09,1.43,5.01,2.91,5.51,2.53.99-1.73.31-4.04.49-6.02,5.09-28.99,4.2-61.98-13.49-86.91Z"/>
      <path className="st0" d="M161.59,111.23c-6.1-.58-11.35-5.07-16.22.77-12.46,17.36-16.78,42.96-15.99,63.91.62,9.21,3.44,18.81,2.99,28.22l6.03-1.81c-.74-10.05-2.39-20.43-3.56-30.38-.5-9.59,3.23-31.24,6.63-40.36,1.98-5.29,5.89-10.5,8.34-15.63,1.88-1.91,8.87,1.02,11.77,1.27,6.27.53,13.17-.41,19.49-.01,7.03.44,15.35,2.49,22.47,2.04,4.79-.3,3.7-1.91,3.73-6.02-15.37.34-30.39-3.03-45.7-2Z"/>
      <path className="st0" d="M55.91,120.76c-8.54,2.53-17.46.93-26.19,1.44-9.05.96-18.49,2.58-27.7,2.02-.06.92.54,5.83,1.33,6.01,8.65.58,17.39-1.58,25.87-2.04,7.85-.43,15.82.53,23.64-.37,5.13,7.81,6.99,18.06,8.45,27.25,2.48,15.64-.66,23.24-1.36,37.83-.26,5.35-.48,6.91,5.49,7.73.15-12.3,3.79-24.35,2.99-36.7-1.05-14.47-4.83-30.8-12.53-43.17Z"/>
      <path className="st0" d="M143.36,200.63l5.52-2.31c.5-7.58-1.77-14.98-2.52-22.42-.71-14.19,1.36-35.45,9.23-47.7,16.06-.52,32.48,1.86,48.9,2.03l1.31-6.02-53.19-3.01c-15.18,22.94-12.94,53.55-9.24,79.42Z"/>
      <path className="st0" d="M43.74,133.73c-13.21-1.72-26,2.07-39.23,1.48.61,1.54,1.06,5.67,2.74,5.99,3.79-.45,7.71-.19,11.49-.51,9.11-1.92,18.38-1.62,27.65-1.42,2.92,11.06,5.86,23.1,5.06,34.64-.44,5.67-3.2,14.14-1.49,19.48.46.56,4.5,2.76,4.99,2.25-.36-7.83,2.09-15.49,2.49-23.23.47-9.02-2.35-26.94-5.47-35.47-2.09-5.72-3.6-3.29-8.24-3.2Z"/>
      <path className="st0" d="M178.09,133.18c-6.81.48-12.97.63-19.67.11-5.12,12.25-7.46,27.4-7.07,40.62.48,6.88,2.6,14.19,2.49,21.23.48.5,5.4-2.05,5.49-3.24,0,0-2.52-23.95-2.52-23.95,1.03-8.36,2.83-20.6,5.25-28.26,12.55-2.45,26.12,1.73,38.88,1.53.75-.19,2.22-5.63,1.84-6.01-8.25.87-16.69-1.63-24.7-2.02Z"/>
      <path className="st0" d="M9.01,146.2c-.31.3,1.75,6.21,3.27,6,8.1-.03,17.66-3.52,25.45-1.52,1.76,2.08,2.93,18.39,2.73,21.73-.14,2.48-2.21,12.2-1.38,13.64.38.15,4.84,3.97,5.15,2.62,2.83-14.11,2.53-29.86-1.49-43.49-10.75-2.07-22.73,1.61-33.73,1.02Z"/>
      <path className="st0" d="M167.08,144.69l-1.01.49c-4.31,14.33-4.11,28.86-1.73,43.46,8.59-3.12,4.5-8.27,4-15.74-.45-7.68.88-15.23,2.54-22.67l25.1,1.9c.8-.23,3.25-5.52,2.82-5.94-2.39.42-28.49-1.14-31.72-1.51Z"/>
      <path className="st0" d="M28.23,49.79c3.13-1.02,14.54-3.92,16.24-5.74,3.23-12.61,8.53-24.28,16.98-34.71-14.25,3.82-18.36,17.44-21.58,30.35-7.64,2.88-15.53,5.41-23.36,7.86l-3,5.74c5.73,1.04,9.67-1.85,14.72-3.5Z"/>
      <path className="st0" d="M164.35,44.04c2.01,2.08,13.51,4.91,16.95,6.03,1.31.42,12.82,5.69,12.99,2.48.02-.29-2.75-4.7-2.95-4.9-6.19-3.18-15.89-4.87-22.38-7.97-2.92-11.79-7.53-26.29-20.6-29.34,4.48,7.17,9.94,14.39,12.49,22.71.74,2,2.75,10.21,3.5,10.98Z"/>
      <path className="st0" d="M14.5,157.18c-.26.21,2.61,5.16,3.33,5.41,2.5.85,9.47-1.74,10.69-.2,3.58,6.21-3.83,14.95,5.46,18.26,1.82-7.32,1.9-17.5-.22-24.49-1.25-1.78-16.32,1.33-19.25,1.02Z"/>
      <path className="st0" d="M175.29,155.39c-2.43,8.07-2.26,16.04-.96,24.27.71.75,5.17-3.17,5.41-4.37-.11-3.52-.59-9.64.08-13.62.35-.37,8.35,1.54,10.16.92.69-.24,3.58-5.13,3.33-5.41l-18.01-1.8Z"/>
      <path className="st0" d="M39.97,22.83c-5.14,2.06-14.77,12.04-17.48,16.98,4.41-.53,8.51-2.71,12.88-3.6l4.6-13.37Z"/>
      <path className="st0" d="M184.81,39.81c-.91-3.85-11.72-14.48-15.48-15.98,5.84,16-.06,10.56,15.48,15.98Z"/>
    </svg>
  );

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.644.87l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.127.331-.183.581-.495.644-.87l.213-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
