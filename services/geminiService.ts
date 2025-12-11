import { GoogleGenAI } from "@google/genai";

export const generateSilhouetteImage = async (prompt: string, apiKey: string): Promise<string> => {
  const finalApiKey = apiKey || process.env.API_KEY;
  
  if (!finalApiKey) {
    throw new Error("API 키가 필요합니다. 설정에서 API 키를 입력해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey: finalApiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("이미지 데이터를 찾을 수 없습니다.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "실루엣 생성에 실패했습니다.");
  }
};
