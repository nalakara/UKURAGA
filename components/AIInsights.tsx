
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useLocalization } from '../context/LocalizationContext';
import { TrendingUpIcon } from './Icons';
import { calculateAge } from '../lib/utils';
import { generateAIContent, getUserApiKey, setUserApiKey, checkServerKeyStatus } from '../lib/ai';

// A simple function to handle basic markdown: bold and lists.
const renderMarkdown = (text: string) => {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-light-text dark:text-dark-text">$1</strong>');
  
  html = html.split('\n').map(line => {
    // Handle numbered lists
    if (line.match(/^\d+\.\s/)) {
        return `<li class="list-decimal list-inside ml-4 mb-1">${line.replace(/^\d+\.\s/, '')}</li>`;
    }
    if (line.startsWith('* ')) {
      return `<li class="list-disc list-inside ml-4 mb-1">${line.substring(2)}</li>`;
    }
    return line.trim() ? `<p class="mb-2">${line}</p>` : '<br/>';
  }).join('');
  
  // Wrap list items in ul/ol
  html = html.replace(/(<li class="list-disc.*?<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/(<li class="list-decimal.*?<\/li>)/gs, '<ol>$1</ol>');

  // Clean up stray <br/> tags and extra paragraphs
  html = html.replace(/<br\/><br\/>/g, '<br/>');

  return html;
};

export const AIInsights: React.FC = () => {
    const { profile, measurements, getMeasurementConfig } = useData();
    const { t, getLocale } = useLocalization();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [showKeyPrompt, setShowKeyPrompt] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [hasKey, setHasKey] = useState(false);

    useEffect(() => {
        const checkKey = async () => {
            const userKey = getUserApiKey();
            if (userKey) {
                setHasKey(true);
                setApiKeyInput(userKey);
                return;
            }
            const serverHasKey = await checkServerKeyStatus();
            setHasKey(serverHasKey);
        };
        checkKey();
    }, []);

    const handleSaveKey = () => {
        if (!apiKeyInput.trim()) return;
        setUserApiKey(apiKeyInput.trim());
        setHasKey(true);
        setShowKeyPrompt(false);
        setError('');
        getAIInsights();
    };

    const getAIInsights = async () => {
        setIsLoading(true);
        setError('');
        setResult('');

        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentMeasurements = measurements
                .filter(m => new Date(m.date) >= thirtyDaysAgo)
                .reduce((acc, m) => {
                    const typeName = getMeasurementConfig(m.type).name;
                    if (!acc[typeName]) {
                        acc[typeName] = [];
                    }
                    acc[typeName].push({ date: new Date(m.date).toLocaleDateString(getLocale()), value: m.value });
                    return acc;
                }, {} as Record<string, {date: string, value: number}[]>);
            
            const age = calculateAge(profile.birthDate);

            const prompt = `
Analyze the user's measurement data objectively, concisely, and practically. Do not use generic praise or filler marketing adjectives. Base all observations strictly on the numerical data provided. Do not use em dashes.

Generate a structured report with these three exact sections:
1. **Trend Analysis:** Summarize metric trajectories based strictly on logged numbers over the last 30 days.
2. **Metric Correlations:** Note direct relationships between recorded indicators (such as body weight, waist circumference, or muscle mass changes).
3. **Summary & Actionable Guidance:** Provide 1-2 realistic, non-medical daily habits relevant to their data.

**User Profile:**
- Name: ${profile.name}
- Age: ${age || 'Not set'}
- Gender: ${t(`general.${profile.gender}`)}
- Height: ${profile.height || 'Not set'} cm
- Activity Level: ${t(`activityLevels.${profile.activityLevel}`)}

**Recent Measurements (last 30 days):**
${Object.keys(recentMeasurements).length > 0 ? Object.entries(recentMeasurements).map(([type, values]) =>
    `- ${type}: ${values.map(v => `${v.value} on ${v.date}`).join(', ')}`
).join('\n') : "No recent measurements recorded."}
`;
            
            const systemInstruction = "You are a health metric assistant named 'UKURAGA Insight'. Deliver concise, clear, and objective observations based on recorded data. Never use em dashes. Never provide medical advice, diagnosis, or prescription. Always conclude with this exact line: **Disclaimer:** This is an automated analytical summary and not medical advice. Consult a healthcare professional for clinical concerns.";

            const aiText = await generateAIContent({
                prompt,
                systemInstruction,
            });

            setResult(aiText);
        } catch (e: any) {
            console.error(e);
            if (e.message === 'NO_API_KEY') {
                setShowKeyPrompt(true);
                setError('Gemini API key belum disetel. Masukkan API key Anda (BYOK) di bawah ini:');
            } else {
                setError(t('ai.error', { message: e.message || 'Gagal mengambil wawasan AI.' }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mt-8">
            <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3 px-1 text-left">{t('ai.title')}</h2>
            <div className="bg-light-card dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">{t('ai.description')}</p>

                {showKeyPrompt ? (
                    <div className="mb-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left">
                        <label className="block text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                            Masukkan Gemini API Key (BYOK)
                        </label>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Kunci disimpan secara privat di browser Anda dan hanya dikirim ke endpoint analitik AI. Dapatkan gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Google AI Studio</a>.
                        </p>
                        <input
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full min-h-[40px] px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-light-text dark:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 mb-2"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveKey}
                                disabled={!apiKeyInput.trim()}
                                className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors"
                            >
                                Simpan & Analisis
                            </button>
                            <button
                                onClick={() => setShowKeyPrompt(false)}
                                className="min-h-[40px] px-3 py-2 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={getAIInsights}
                        disabled={isLoading}
                        className="w-full min-h-[44px] flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TrendingUpIcon className="h-5 w-5" />
                        <span>{isLoading ? t('ai.loading') : t('ai.button')}</span>
                    </button>
                )}
                
                {isLoading && !result && (
                    <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('ai.loading')}</p>
                    </div>
                )}
                
                {result && (
                    <div className="mt-6 p-4 bg-light-bg dark:bg-gray-800/80 rounded-lg text-sm text-light-text dark:text-dark-text text-left border border-gray-200 dark:border-gray-700">
                       <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
                    </div>
                )}

                {error && !showKeyPrompt && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};