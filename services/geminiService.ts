
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

export const analyzeFoodImage = async (base64Image: string, description?: string): Promise<NutritionData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = "gemini-3-flash-preview";

  let prompt = `Identifique a comida na imagem e estime as calorias e macronutrientes. Seja direto.`;
  
  if (description) {
    prompt += ` O usuário descreveu o prato como: "${description}". Use essa informação para ser mais preciso.`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mealName: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          observations: { type: Type.STRING }
        },
        required: ["mealName", "calories", "carbs", "protein", "fats", "observations"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Resposta vazia da IA");
  return JSON.parse(text) as NutritionData;
};
