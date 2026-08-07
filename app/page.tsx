"use client";

import { useState } from "react";
type IngestResult = {
  message: string;
  fileName: string;
  fileSize: number;
  textLength: number;
  textPreview: string;
  chunks: string;
  firstChunk: {
    id: string;
    content: string;
    embeddingPreview: number[];
  };
};

type ReleventChunks = {
  content:string;
  score:string;
}

export default function Homepage() {
  const [result, setResult] = useState<IngestResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [question,setQuestion] = useState("");
  const [releventChunks,setReleventChunks] = useState<ReleventChunks | []>([]);

  async function handleUpload(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.log(error);
    }
  }

  const chunk = result?.chunks;
  const embeddingContent = result?.firstChunk
  
  console.log(
    chunk,
    "chunk",
    result,
    "result",
    // result.chunks,
    // "result cheunks",
  );

  async function handleAsk(e: React.SyntheticEvent<HTMLFormElement>){
        e.preventDefault();
        setReleventChunks([]);

        const response = await fetch("/api/ask",{
          method:"POST",
          headers:{
             "Content-Type": "application/json",  
          },
           body: JSON.stringify({
          question: question,
        }),
        })

        console.log(response, "response");
        const data = response.json();

        setReleventChunks(data.relevantChunks);
  }
  return (
    <>
      <h1>upload pdf</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
          }}
        />

        <button type="submit" style={{ marginLeft: 12 }}>
          upload file
        </button>
      </form>
      <form onSubmit={handleAsk}>
        <input type="text"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
        placeholder="ask about uploaded doc"

         />
         <button type="submit"
         >SEND</button>
      </form> 

      {result && (
        <>
          <h2>result</h2>
          <p>file : {result.fileName}</p>
          <h3>Text Preview : {result.textPreview}</h3>
          {/* <h4>{chunk.content}</h4> */}
          <h4>{embeddingContent.embeddingPreview}</h4>
        </>
      )}

      {/* {releventChunks.length >0 &&(
        <>
        <h2>releventChunks</h2>

        {releventChunks.map((chunk,index)=>{
         <> <p>{chunk.content}</p>

          <small>SIMILARITY SEARCH : {chunk.score.toFixed(3)}</small></>
        })}
        </>
      )} */}
    </>
  );
}
