"use client";

import { useState } from "react";

// Controls the visible typewriter effect without changing the server stream.
const DISPLAY_CHARS_PER_TICK = 2;
const DISPLAY_TICK_MS = 25;

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
  const [isAnswering, setIsAnswering] = useState(false);

  async function handleUpload(selectedFile: File) {
    try {
      setResult(null);

      const formData = new FormData();

      // selectedFile is the exact PDF the user just chose.
      formData.append("file", selectedFile);

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data, "upload result");

      setResult(data);
    } catch (error) {
      console.log(error);
    }
  }
  const chunk = result?.chunks;
  const embeddingContent = result?.firstChunk;

  async function handleAsk(e: React.SyntheticEvent) {
    e.preventDefault();

    if (file === null) {
      setAnswer("PDF upload cheythitt samsarikkunnathalle maryatha?");
      return;
    }

    if (!question.trim()) return;

    try {
      setAnswer("");
      setIsAnswering(true);

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Could not get an answer stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = "";

      const displayText = async (text: string) => {
        for (let index = 0; index < text.length; index += DISPLAY_CHARS_PER_TICK) {
          fullAnswer += text.slice(index, index + DISPLAY_CHARS_PER_TICK);
          setAnswer(fullAnswer);

          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, DISPLAY_TICK_MS);
          });
        }
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        await displayText(decoder.decode(value, { stream: true }));
      }

      await displayText(decoder.decode());
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong while generating the answer.");
    } finally {
      setIsAnswering(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#EFFF00",
        color: "#000000",
        padding: "60px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: "42px", fontWeight: 800 }}>
          Tiny RAG Cat 🐱
        </h1>

        <p style={{ margin: "8px 0 35px", fontSize: "18px" }}>
          Upload a PDF and ask questions from it.
        </p>

        <label
          style={{
            display: "inline-block",
            background: "#000000",
            color: "#EFFF00",
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: 700,
            borderRadius: "4px",
            maxWidth: "280px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {result?.fileName ? `📄 ${result.fileName}` : "Choose PDF"}

          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] ?? null;
              setFile(selectedFile);

              if (selectedFile) {
                handleUpload(selectedFile);
              }
            }}
          />
        </label>

        <form
          onSubmit={handleAsk}
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "28px",
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your PDF..."
            style={{
              flex: 1,
              padding: "14px",
              border: "2px solid #000000",
              borderRadius: "4px",
              outline: "none",
              background: "#EFFF00",
              color: "#000000",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "14px 22px",
              background: "#000000",
              color: "#EFFF00",
              fontWeight: 700,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Ask
          </button>
        </form>

        <section
          style={{
            marginTop: "38px",
            paddingTop: "20px",
            borderTop: "2px solid #000000",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px" }}>Answer</h2>

          {isAnswering && !answer && <p>Thinking...</p>}
          <p
            style={{
              marginTop: "12px",
              whiteSpace: "pre-wrap",
              fontSize: "17px",
              lineHeight: 1.6,
            }}
          >
            {answer || "Your answer will appear here..."}
          </p>
        </section>
      </div>
    </main>
  );
}
