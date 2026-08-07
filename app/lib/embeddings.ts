import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env.local");
}

const ai = new GoogleGenAI({apiKey});

export async function createEmbedding(
    text:string
):Promise<number[]>{
    const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents:text,
        config:{
            taskType:"RETRIEVAL_DOCUMENT",
            outputDimensionality:768
        }
    });

    const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Embedding was not created");
  }

    return embedding;



}
export async function createQuestionEmbedding(
        question:string
    ):Promise<number[]>{
        const cleanedQuestion = question.trim();

          if (!cleanedQuestion) {
    throw new Error("Question cannot be empty");
  }

  return createEmbedding(cleanedQuestion);
    }