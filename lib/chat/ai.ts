import { openai } from "@/lib/openai";

export async function rewriteGroundedAnswer(input: {
  title: string;
  summary: string;
  sections: { label: string; items: any[] }[];
}) {
  try {
    // 섹션 데이터를 텍스트로 변환하여 AI에게 전달할 '참고 자료' 생성
    const context = input.sections
      .map(s => `[${s.label}]\n${s.items.map(i => (typeof i === 'string' ? i : i.text)).join('\n')}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 비용 절감을 위한 핵심 선택
      messages: [
        {
          role: "system",
          content: `당신은 한국환경공단의 '물관리 부합성 심의' 전문가입니다. 
          제공된 [참고 자료]를 바탕으로 사용자의 질문에 친절하고 정확하게 요약 답변을 작성하세요.
          
          [규칙]
          1. 반드시 제공된 자료에 근거하여 작성할 것.
          2. 답변은 3~4문장 내외로 간결하게 작성할 것.
          3. "~입니다", "~바랍니다"와 같은 격식 있는 말투를 사용할 것.`
        },
        {
          role: "user",
          content: `[주제]: ${input.title}\n\n[참고 자료]:\n${context}\n\n위 자료를 바탕으로 질문에 대한 요약 답변을 작성해줘.`
        }
      ],
      temperature: 0.3, // 일관된 답변을 위해 낮게 설정
      max_tokens: 500,  // 답변 길이를 제한하여 비용 추가 절감
    });

    return {
      summary: response.choices[0].message.content || input.summary
    };
  } catch (error) {
    console.error("AI 응답 생성 중 오류 발생:", error);
    // 오류 발생 시 비용 보호 및 서비스 유지를 위해 원래 요약본 반환
    return {
      summary: input.summary
    };
  }
}