import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatResponse = async (message: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful and empathetic AI therapist. Provide supportive responses while maintaining professional boundaries. Do not provide medical advice or diagnoses."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0]?.message?.content || "I apologize, but I'm having trouble processing your message. Could you please try rephrasing it?";
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
  }
};