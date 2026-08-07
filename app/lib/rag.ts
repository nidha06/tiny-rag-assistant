import { createEmbedding } from "./embeddings";
import { cosineSimilarity } from "./similarity";
import { loadVectors } from "./vectorStore";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAi = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
);
const chatModel = genAi.getGenerativeModel({
    model:"gemini-3.5-flash",
})

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
};

export async function generateRagAnswer(question:string) {
     const relevantChunks = await findReleventChunks(question);

     if(relevantChunks.length===0){
        return{
            answer:"pooyi doc upload aakkedoooo!!",
            relevantChunks:[],
        };
     }

     const context = relevantChunks
     .map((chunk,index)=>`source ${index + 1}: \n${chunk.content}`)
     .join("\n\n");

     const prompt = `
     You are a PDF question-answering assistant.

Answer the user's question using ONLY the provided document context.
If the answer is not available in the context, say:
"Eee paranja sadanam ee pdf il kaanunnilla maatti pidi"

Document context:
${context}

User question:
${question}

Give a clear and short answer.`;

const result = await chatModel.generateContent(prompt);
console.log("LAST RESULT : ", result.response.text())

return{
    answer: result.response.text(),
    relevantChunks,   
}
}