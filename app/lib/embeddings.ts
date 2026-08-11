import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env.local");
}

const ai = new GoogleGenAI({ apiKey });

export async function  createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        taskType:
        //  "RETRIEVAL_DOCUMENT",
         "RETRIEVAL_DOCUMENT",
        outputDimensionality: 1536,
      },
    });

   

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error("Embedding was not created");
    }

    return embedding;
  } catch (error) {
    console.error("Embedding creation failed:", error);

    throw new Error("Could not create embedding");
  }
}

export async function createQuestionEmbedding(
  question: string
): Promise<number[]> {
  try {
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion) {
      throw new Error("Question cannot be empty");
    }

    return await createEmbedding(cleanedQuestion);
  } catch (error) {
    console.error("Question embedding failed:", error);

    throw error;
  }
}