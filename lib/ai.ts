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
        const data = await res.json();
        return Boolean(data.hasServerKey);
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

export async function generateAIContent({
    prompt,
    systemInstruction,
    responseMimeType,
    model = 'gemini-2.5-flash',
}: GenerateAIOptions): Promise<string> {
    const userKey = getUserApiKey();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (userKey) {
        headers['x-gemini-api-key'] = userKey;
    }

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

    const data = await response.json();

    if (!response.ok) {
        if (data.error === 'NO_API_KEY') {
            throw new Error('NO_API_KEY');
        }
        throw new Error(data.message || 'Gagal menghubungi layanan AI.');
    }

    return data.text || '';
}
