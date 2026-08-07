import { NextResponse } from "next/server";
import { findReleventChunks } from "../../lib/rag";

export async function POST(request:Request){
    try{
        const body = await request.json();
        const question = body.question;

        if(!question || typeof question !== "string"){
            return NextResponse.json(
                { error: "Please enter a question" },
                { status: 400 }
            )
        }

        const relevantChunks = await findReleventChunks(question);

        return NextResponse.json({
            question,
            relevantChunks, 
        })
    }catch(error){
        console.log(error);
    }
}