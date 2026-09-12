import { GoogleGenAI } from '@google/genai';

const BYOK_STORAGE_KEY = 'ukuraga_byok_gemini_key';

export function getUserApiKey(): string {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(BYOK_STORAGE_KEY) || '';
}

export function setUserApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    const trimmed = key.trim();
    if (trimmed) {
        window.localStorage.setItem(BYOK_STORAGE_KEY, trimmed);
    } else {
        window.localStorage.removeItem(BYOK_STORAGE_KEY);
    }
}

export async function checkServerKeyStatus(): Promise<boolean> {
    try {
        const res = await fetch('/api/gemini/status');
        if (!res.ok) return false;
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return Boolean(data?.hasServerKey);
        } catch {
            return false;
        }
    } catch {
        return false;
    }
}

export interface GenerateAIOptions {
    prompt: string;
    systemInstruction?: string;
    responseMimeType?: string;
    model?: string;
}

// Client-side direct generation fallback using user's BYOK key
async function generateWithClientKey(
    apiKey: string,
    options: GenerateAIOptions
): Promise<string> {
    const { prompt, systemInstruction, responseMimeType, model = 'gemini-2.5-flash' } = options;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType,
        },
    });
    return response.text || '';
}

export async function generateAIContent(options: GenerateAIOptions): Promise<string> {
    const { prompt, systemInstruction, responseMimeType, model = 'gemini-2.5-flash' } = options;
    const userKey = getUserApiKey();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (userKey) {
        headers['x-gemini-api-key'] = userKey;
    }

    try {
        const response = await fetch('/api/gemini/generate', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                prompt,
                systemInstruction,
                responseMimeType,
                model,
            }),
        });

        // Safe body parsing: read as text first to avoid uncaught SyntaxError when server returns HTML error page
        const rawText = await response.text();
        let data: any = null;
        try {
            data = JSON.parse(rawText);
        } catch {
            // Response was not JSON (e.g. 404, 502, 504 HTML page from proxy or Cloud Run)
        }

        if (response.ok && data?.text !== undefined) {
            return data.text;
        }

        // Handle specific server-provided errors
        if (data?.error === 'NO_API_KEY') {
            if (userKey) {
                return await generateWithClientKey(userKey, options);
            }
            throw new Error('NO_API_KEY');
        }

        if (data?.message) {
            throw new Error(data.message);
        }

        // If the server proxy failed (404, 502, 503, 504) and the user has a BYOK key, fall back to client SDK
        if (userKey) {
            console.warn('Server proxy unavailable, falling back to direct client-side Gemini generation.');
            return await generateWithClientKey(userKey, options);
        }

        if (response.status === 404) {
            throw new Error('NO_API_KEY');
        }

        if (response.status >= 500) {
            throw new Error(`Server AI sedang sibuk atau tidak merespons (HTTP ${response.status}). Silakan coba beberapa saat lagi atau masukkan API Key Anda sendiri.`);
        }

        throw new Error(`Gagal menghubungi layanan AI (HTTP ${response.status}).`);
    } catch (err: any) {
        if (err.message === 'NO_API_KEY') {
            throw err;
        }

        // If network failed completely (e.g. offline, static PWA export) and user has a BYOK key
        if (userKey) {
            try {
                return await generateWithClientKey(userKey, options);
            } catch (clientErr: any) {
                throw new Error(clientErr.message || 'Gagal memproses dengan API Key yang Anda masukkan.');
            }
        }

        // Clean user-friendly message for fetch connection failure
        if (err.name === 'TypeError' && err.message?.includes('fetch')) {
            throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau gunakan API Key Gemini sendiri.');
        }

        throw err;
    }
}
