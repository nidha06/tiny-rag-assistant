import {promises as fs} from "fs";
import path from "path";
import type { TextChunk } from "./chunk";


export type EmbeddedChunk = TextChunk &{
    documentName:string;
    embedding:number[];
}

const vectorsFilePath = path.join(
    process.cwd(),
    "data",
    "vectors.json"
)

export async function saveVectors(
    embeddedChunk:EmbeddedChunk[]
):Promise<void>{
    await fs.mkdir(path.dirname(vectorsFilePath),{
        recursive:true
    });

    await fs.writeFile(
        vectorsFilePath,
        JSON.stringify(embeddedChunk,null,2),
        "utf-8"
    );
}
export async function readVectors():Promise<EmbeddedChunk[]>{
    try{
        const fileContent = await fs.readFile(vectorsFilePath,"utf-8");

        return JSON.parse(fileContent);
    }catch(error){
        console.log("error from vectorStore",error);
        return[];
    }

}

export async function loadVectors():Promise<EmbeddedChunk[]>{
    try{
      const fileContent = await fs.readFile(
        vectorsFilePath,
        "utf-8"
      );

      const storedVectors = JSON.parse(fileContent);

      return storedVectors;

    }catch(error){
       console.log("LOADING VECTOR",error)
    }
}