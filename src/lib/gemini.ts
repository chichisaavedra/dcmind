import { GoogleGenAI } from '@google/genai';

const apiSecret = import.meta.env.VITE_GEMINI_API_KEY;

let aiInstance: any = null;

const getAI = () => {
    if (!aiInstance) {
        try {
            if (!apiSecret) {
                console.error("Gemini API Key missing in environment variables.");
                throw new Error("API key not found. Please check your .env file.");
            }
            // Unified SDK initialization
            aiInstance = new GoogleGenAI({ apiKey: apiSecret });
        } catch (error) {
            console.error("FATAL: Could not initialize GoogleGenAI:", error);
            throw error;
        }
    }
    return aiInstance;
};

export const askGemini = async (prompt: string, files: File[] = []): Promise<string> => {
    try {
        const ai = getAI();
        const parts: any[] = [{ text: prompt }];

        for (const file of files) {
            const base64Data = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
                reader.readAsDataURL(file);
            });

            parts.push({
                inline_data: {
                    mime_type: file.type || 'application/pdf',
                    data: base64Data
                }
            });
        }

        const result = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: [{ role: 'user', parts }]
        });

        // Use direct text() method on response for current SDK version
        const text = result.text();
        if (!text) throw new Error("No response from Gemini");

        return text;
    } catch (error: any) {
        console.error("Error in askGemini:", error);

        const msg = typeof error.message === 'string' ? error.message : JSON.stringify(error);

        if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
            throw new Error("Cuota agotada. Por favor, intenta de nuevo más tarde o revisa tu plan en Google AI Studio.");
        }
        if (msg.includes("404") || msg.includes("NOT_FOUND")) {
            throw new Error("Modelo no encontrado o no disponible. Intenta usar gemini-flash-latest.");
        }

        throw error;
    }
};
