import { NextResponse } from "next/server";
import { findReleventChunks, generateRagAnswer } from "../../lib/rag";

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

    const relevantChunks = await findReleventChunks(question);

    const result = await generateRagAnswer(question);
    console.log(result.answer, "reslut from ask route");

    return NextResponse.json({
      question,
      answer: result.answer,
      relevantChunks,
    });
  } catch (error) {
    console.log(error);
  }
}
