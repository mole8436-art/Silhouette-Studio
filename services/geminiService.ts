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
    
    // Parse error message for better user feedback
    let userMessage = "실루엣 생성에 실패했습니다.";
    
    if (error.message) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes("quota") || errorMsg.includes("exceeded") || errorMsg.includes("resource_exhausted")) {
        userMessage = "⚠️ API 할당량 초과: Gemini API의 무료 사용량을 초과했습니다. 잠시 후 다시 시도하거나, Google AI Studio에서 사용량을 확인하세요.";
      } else if (errorMsg.includes("api key") || errorMsg.includes("invalid") || errorMsg.includes("unauthorized")) {
        userMessage = "🔑 API 키 오류: API 키가 유효하지 않습니다. 오른쪽 상단에서 올바른 API 키를 입력해주세요.";
      } else if (errorMsg.includes("rate limit")) {
        userMessage = "⏱️ 요청 제한: 너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
      } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
        userMessage = "🌐 네트워크 오류: 인터넷 연결을 확인해주세요.";
      } else {
        userMessage = `오류: ${error.message}`;
      }
    }
    
    throw new Error(userMessage);
  }
};
