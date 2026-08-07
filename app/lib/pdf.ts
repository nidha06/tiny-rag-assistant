// @ts-ignore
import { arrayBuffer } from "node:stream/consumers";
import { extractText, getDocumentProxy } from "unpdf";

export async function extractTextFromPdf(arrayBuffer: ArrayBuffer
): Promise<string> {

    const pdf= await getDocumentProxy(new Uint8Array(arrayBuffer));
    try{
        const result = await extractText(pdf,{
            mergePages:true,
        });
        return result.text
        .replace(/\s+/g, " ")
        .trim();
    }finally {
    console.log("yaaayyyyyyy!!!")
  }

    
}