import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key is not configured." },
                { status: 500 }
            );
        }

        if (!imageBase64) {
            return NextResponse.json(
                { error: "이미지 데이터가 없습니다." },
                { status: 400 }
            );
        }

        const prompt = `
            사용자가 업로드한 보험 증권 이미지를 분석하여 아래 5가지 핵심 보장 항목의 '가입 금액'을 추출해줘.
            금액 단위는 반드시 '만원'으로 통일해서 숫자만 출력해줘. (예: 3,000,000원 -> 300)

            [추출 항목]
            1. cancer: 암 진단비 (유사암/소액암 제외, 일반암 기준)
            2. brain: 뇌혈관 질환 또는 뇌졸중 진단비
            3. heart: 허혈성 심장 질환 또는 급성 심근경색 진단비
            4. medical: 질병 입원/통원 의료비 (실손의료비 최대 가입금액 기준, 보통 5000)
            5. death: 일반 사망 또는 질병 사망 보험금

            [주의사항]
            - 이미지에서 해당 항목을 찾을 수 없거나 값이 0이면 0으로 입력해줘.
            - 반드시 아래 JSON 형식으로만 응답해줘. 다른 텍스트는 포함하지 마.

            JSON 형식:
            {
                "cancer": 0,
                "brain": 0,
                "heart": 0,
                "medical": 0,
                "death": 0
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageBase64,
                            },
                        },
                    ],
                },
            ],
            response_format: { type: "json_object" },
        });

        const extractedData = JSON.parse(response.choices[0].message.content || "{}");

        return NextResponse.json({ data: extractedData });
    } catch (error) {
        console.error("OpenAI OCR Error:", error);
        return NextResponse.json(
            { error: "이미지 분석 중 오류가 발생했습니다. 증권이 선명한지 확인해주세요." },
            { status: 500 }
        );
    }
}
