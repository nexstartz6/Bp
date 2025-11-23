import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Chatbot Functionality ---
let chatInstance: Chat | null = null;

const getChatInstance = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: 'You are a friendly and knowledgeable health assistant. Provide helpful and safe information regarding general health, nutrition, and wellness based on the user\'s queries. Do not provide medical advice, diagnoses, or prescriptions. Always advise users to consult a healthcare professional for personal health concerns.',
            },
        });
    }
    return chatInstance;
};

export const getChatResponse = async (prompt: string): Promise<string> => {
    try {
        const chat = getChatInstance();
        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

// --- Image Analysis Functionality ---
export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: prompt,
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Sorry, I couldn't analyze the image. Please try another one.";
    }
};

// --- Quick Analysis Functionality ---
export const getQuickAnalysis = async (prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting quick analysis:", error);
        return "Sorry, I couldn't get a quick analysis. Please try again.";
    }
};