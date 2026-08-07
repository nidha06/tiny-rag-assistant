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
  message: string;
  content: string;
  answer: string;
  score: string;
};

export default function Homepage() {
  const [result, setResult] = useState<IngestResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [releventChunks, setReleventChunks] = useState<ReleventChunks | []>([]);

  async function handleUpload(selectedFile: File) {
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
  const embeddingContent = result?.firstChunk;

  async function handleAsk(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Click");

    if (file === null) {
      console.log("Clic2k");

      return setAnswer("PDF upload cheythitt samsarikkunnathalle maryatha?");
    }
    setAnswer("");
    setReleventChunks([]);

    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    console.log(response, "response");
    const data = await response.json();

    console.log("RESPONES FROM RAG : ", data);

    setReleventChunks(data.relevantChunks);
    setAnswer(data.answer);
  }
  return (
    <>
      <div style={{ background: "yellow", margin: 0 }}>
        <h1 style={{ marginLeft: 520 }}>upload pdf</h1>

        {result ? (
          <>
            <h2>AI answer : </h2>
            <h3>{answer}</h3>
          </>
        ) : (
          <h3>{answer}</h3>
        )}

        <form style={{ marginLeft: 420 }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] ?? null;

              setFile(selectedFile);

              if (selectedFile) {
                handleUpload(selectedFile);
              }
            }}
          />
        </form>
        <form onSubmit={handleAsk} style={{ marginTop: 455, marginLeft: 465 }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="ask about uploaded doc"
          />
          <button type="submit">SEND</button>
        </form>
      </div>
    </>
  );
}
