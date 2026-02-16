
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Safe method to access Gemini API following strict developer guidelines.
   * Uses process.env.API_KEY which is injected by Vercel.
   */
  private getClient() {
    // Shimming process.env for browser context if needed, 
    // though system provides it pre-configured.
    const apiKey = (window as any).process?.env?.API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error("Gemini API Key missing! Vercel Settings-এ গিয়ে API_KEY যোগ করুন।");
    }
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Edits an image based on a prompt using gemini-2.5-flash-image.
   */
  async editImage(base64Image: string, mimeType: string, prompt: string): Promise<string | null> {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error: any) {
      console.error("Gemini Edit Image Error:", error);
      throw new Error(error.message || "AI image processing failed.");
    }
  }
}

export const geminiService = new GeminiService();
