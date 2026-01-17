import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const moderateContentWithAI = async (text) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not loaded");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Define the structure you want the AI to follow
    const schema = {
      description: "Content moderation response",
      type: SchemaType.OBJECT,
      properties: {
        safe: {
          type: SchemaType.BOOLEAN,
          description: "Whether the content is safe or not",
        },
        reason: {
          type: SchemaType.STRING,
          description: "Short explanation of the safety determination",
        },
      },
      required: ["safe", "reason"],
    };

    // Use gemini-1.5-flash (faster and cheaper for moderation)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Analyze the following text for safety and moderation: "${text}"`;

    const result = await model.generateContent(prompt);
    
    // With responseSchema, result.response.text() is guaranteed to be valid JSON 
    // matching your schema format.
    const parsedResponse = JSON.parse(result.response.text());

    return parsedResponse;

  } catch (error) {
    console.error("AI moderation error:", error.message);

    return {
      safe: false,
      reason: "AI moderation failed, sent for manual review",
    };
  }
};