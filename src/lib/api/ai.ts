// AI Features disabled temporarily to resolve rendering issues
export const summarizeNote = async (title: string, content: string): Promise<string> => {
  return "AI Summarization is currently disabled. Please configure VITE_GEMINI_API_KEY to enable.";
};

export const chatWithNote = async (title: string, content: string, userMessage: string, history: any[]): Promise<string> => {
  return "AI Chat is currently disabled.";
};
