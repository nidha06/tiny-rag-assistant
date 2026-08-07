import { createEmbedding } from "./embeddings";
import { cosineSimilarity } from "./similarity";
import { loadVectors } from "./vectorStore";

export async function findReleventChunks(question:string){
    const questionEmbedding = await createEmbedding(question);

    const storedChunks = await loadVectors();

    const result = storedChunks.map((chunk)=>(
        {
        content:chunk.content,
        score:cosineSimilarity(
            questionEmbedding,
            chunk.embedding
        )
    }
    ));
    return result
           .sort((a,b)=>b.score - a.score)
           .slice(0,3)
}