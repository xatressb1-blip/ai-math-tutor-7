import { NextResponse } from "next/server";
import { answerWithLocalTutor } from "@/services/tutor/local-tutor-engine";
import type { TutorRequest } from "@/types/tutor";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequest;

    if (!body.lessonId || !body.message?.trim() || !body.studentContext) {
      return NextResponse.json(
        { error: "Thiếu lessonId, message hoặc studentContext." },
        { status: 400 },
      );
    }

    // Beta 1.8 deliberately uses the local Teaching Brain so the release works
    // immediately without API keys. A cloud LLM provider can be added behind
    // this route later without changing the Tutor UI or conversation contract.
    return NextResponse.json(answerWithLocalTutor(body));
  } catch {
    return NextResponse.json(
      { error: "AI Tutor chưa xử lý được yêu cầu này." },
      { status: 500 },
    );
  }
}
