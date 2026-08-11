import { NextResponse } from "next/server";
import { findReleventChunks, generateRagAnswer } from "../../lib/rag";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Please enter a question" },
        { status: 400 },
      );
    }

     const result = await generateRagAnswer(question);
    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          
          if (!result.stream) {
            controller.enqueue(encoder.encode(result.answer));
            controller.close();
            return;
          }

          for await (const chunk of result.stream) {
            const text = chunk.text();

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.log(error);

    return new Response("Could not generate answer", {
      status: 500,
    });
  }
}
