import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getChatResponse = async (message: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "I need someone to talk to about my mental health.",
        },
        {
          role: "model",
          parts: "I'm here to listen and provide support. While I can't provide medical advice or diagnosis, I can offer a compassionate ear and general guidance. How are you feeling today?",
        },
      ],
      generationConfig: {
        maxOutputTokens: 250,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
  }
};