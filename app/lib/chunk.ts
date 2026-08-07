export type TextChunk = {
    id:string;
    chunkIndex:number;
    content:string;
}

export function createChunks(
    text:string,
    chunkSize = 500,
    overlapSize = 150,
):TextChunk[]{
    const cleanText = text.replace(/\s+/g, " ").trim();
    
    const sentences = 
    cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()) ??
    [];

    const chunks: TextChunk[]=[];
    let currentChunk ="";

    for(const sentence of sentences){
        const nextChunk = `${currentChunk} ${sentence}`.trim();

        if(nextChunk.length<=chunkSize){
            console.log(nextChunk, "nextChunk");
            
            currentChunk = nextChunk;   
            continue;
        }

        if(currentChunk){
            chunks.push({
                id:`chunk- ${chunks.length +1}`,
                chunkIndex:chunks.length,
                content:currentChunk


            })
        }

        const overlap = currentChunk.slice(-overlapSize);

        currentChunk = `${overlap} ${sentence}`.trim();
    }

    if(currentChunk){
        chunks.push({
            id:`chunk-${chunks.length +1}`,
            chunkIndex:chunks.length,
            content:currentChunk
        })
    }

    return chunks
}