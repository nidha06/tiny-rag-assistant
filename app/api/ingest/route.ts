import { NextResponse } from "next/server";
import { extractTextFromPdf } from "../../lib/pdf";
import { createChunks } from "../../lib/chunk";
import { createEmbedding } from "../../lib/embeddings";
import { saveVectors } from "../../lib/vectorStore";

export const runtime = "nodejs";

export async function POST(request:Request){
    try{
      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
  return NextResponse.json(
    { message: "Please upload a PDF file using field name: file" },
    { status: 400 }
  );
}

      const arrayBuffer = await file.arrayBuffer();
     
      const extractedText = await extractTextFromPdf(arrayBuffer);
                              
      const chunks = createChunks(extractedText);
     
      const embeddedChunks = [];

      for(const chunk of chunks){
       
        const embedding = await createEmbedding(chunk.content);
        console.log(embedding,"embeddings from route ts")

        embeddedChunks.push({
          ...chunk,
          documentName:file.name,
          embedding,
        })
      }
      
      await saveVectors(embeddedChunks);

      return NextResponse.json({
        message:"pdf file successfully extracted",
        fileName:file.name,
        fileSize:file.size,
        textLength:extractedText.length,
        textPreview:extractedText.slice(0,10),
        chunks: chunks.slice(0, 10),
        firstChunk:{
          id:embeddedChunks[0]?.id,
          content:embeddedChunks[0]?.content,
          embeddingPreview:embeddedChunks[0]?.embedding.slice(0,10),
        }
      })

    }catch(error){
       console.log("ingest error :",error);

        return NextResponse.json(
      { message: "Failed to process the PDF" },
      { status: 500 }
    );
    }
}