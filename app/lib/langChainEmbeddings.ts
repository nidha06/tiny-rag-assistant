import { Embeddings } from "@langchain/core/embeddings";
import {
  createEmbedding,
  createQuestionEmbedding,
} from "./embeddings";

export class GeminiEmbeddings extends Embeddings {
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return Promise.all(
      texts.map((text) => createEmbedding(text))
    );
  }

  async embedQuery(question: string): Promise<number[]> {
    return createQuestionEmbedding(question);
  }
  
}