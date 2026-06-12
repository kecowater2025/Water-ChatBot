import { NextRequest, NextResponse } from "next/server";
import { normalizeQuestion } from "@/lib/chat/helpers";
import { isRestrictedQuestion } from "@/lib/chat/guards";
import { findFaqResponse, shouldRenderProcessFlow } from "@/lib/chat/retrieval";
import {
  createEmptyQuestionResponse,
  createFallbackResponse,
  createRestrictedResponse
} from "@/lib/chat/responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question = normalizeQuestion(body.question);

    if (!question) {
      return NextResponse.json(
        { data: createEmptyQuestionResponse() },
        { status: 200 }
      );
    }

    if (isRestrictedQuestion(question)) {
      return NextResponse.json(
        { data: createRestrictedResponse() },
        { status: 200 }
      );
    }

    if (shouldRenderProcessFlow(question)) {
      return NextResponse.json(
        {
          data: {
            type: "process_flow"
          }
        },
        { status: 200 }
      );
    }

    const faq = findFaqResponse(question);

    if (faq) {
      return NextResponse.json(
        {
          data: {
            type: "answer_card",
            title: faq.title,
            summary: faq.summary,
            sections: faq.sections
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: createFallbackResponse(question) },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        data: {
          type: "text",
          content: "요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        }
      },
      { status: 500 }
    );
  }
}