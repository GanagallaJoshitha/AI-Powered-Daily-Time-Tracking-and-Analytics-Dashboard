import { GoogleGenAI, Type } from "@google/genai";
import { Activity, AnalysisResult } from "../types";

// Helper to get API key from Vite env or Process env
const getApiKey = () => {
  try {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  } catch (e) {
    return process.env.API_KEY || '';
  }
};

const apiKey = getApiKey();

export const geminiService = {
  analyzeDay: async (activities: Activity[]): Promise<AnalysisResult> => {
    if (!apiKey) {
        console.warn("No API Key found. Returning mock analysis.");
        return {
            productivityScore: 85,
            summary: "API Key missing. This is a simulated analysis. Your day looks balanced with a good mix of work and rest.",
            suggestions: ["Configure your VITE_API_KEY in .env to get real AI insights.", "Keep up the consistency!"]
        };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const activitySummary = activities
        .map(a => `- ${a.minutes} mins on ${a.title} (${a.category})`)
        .join('\n');

      const prompt = `Analyze the following daily activity log and provide productivity insights.
      
      Activities:
      ${activitySummary}
      
      Return a JSON object with:
      1. productivityScore (0-100 integer)
      2. summary (2-3 sentences max)
      3. suggestions (array of 3 short bullet points for improvement)`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productivityScore: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      
      return JSON.parse(text) as AnalysisResult;

    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return {
        productivityScore: 0,
        summary: "Could not generate analysis at this time.",
        suggestions: ["Try again later."]
      };
    }
  }
};