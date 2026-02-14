import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
    try {
        const { userState, financeState, mode, messages } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key is not configured." },
                { status: 500 }
            );
        }

        let systemPrompt = "";

        if (mode === 'insurance') {
            systemPrompt = `
                너는 보험 및 재무 설계 전문가야. 사용자의 보험 데이터를 바탕으로 친절하고 명확하게 상담해줘.
                말투는 "해요체"를 사용하고, 너무 길지 않게(3문장 내외) 핵심만 말해줘. 음성 비서처럼 자연스럽게 대화해.
                
                [사용자 정보]
                이름: ${userState.name || '고객님'}
                나이: ${userState.age}세
                성별: ${userState.gender === 'male' ? '남성' : '여성'}
                
                [보험 보장 현황 (단위: 만원)]
                암 진단비: ${userState.coverages.cancer.toLocaleString()}
                뇌질환: ${userState.coverages.brain.toLocaleString()}
                심장질환: ${userState.coverages.heart.toLocaleString()}
                의료비: ${userState.coverages.medical.toLocaleString()}
                사망보장: ${userState.coverages.death.toLocaleString()}
            `;
        } else {
            systemPrompt = `
                너는 자산 관리 및 은퇴 설계 전문가야. 사용자의 재무 데이터를 바탕으로 통찰력 있게 상담해줘.
                말투는 "해요체"를 사용하고, 너무 길지 않게(3문장 내외) 핵심만 말해줘.
                
                [사용자 정보]
                이름: ${financeState.name || '고객님'}
                나이: ${financeState.age}세
                목표 은퇴 나이: ${financeState.retirementAge}세
                
                [현재 재무 현황]
                월 수입: ${financeState.currentIncome.toLocaleString()}만원
                은퇴 후 희망 소득: ${financeState.targetMonthlyIncome.toLocaleString()}만원
                총 자산: ${(Object.values(financeState.assets).reduce((a, b) => (a as number) + (b as number), 0) as number).toLocaleString()}만원
            `;
        }

        // Context messages (System + Conversation History)
        const contextMessages = [
            { role: "system", content: systemPrompt },
            ...(messages || []) // Use provided messages if available (for chat mode)
        ];

        // If no messages provided (initial loading), add default prompt
        if (!messages || messages.length === 0) {
            const defaultPrompt = mode === 'insurance'
                ? "내 보험 상태를 분석해서 가장 부족한 점 하나만 짧게 말해줘."
                : "내 은퇴 준비 상태를 분석해서 한 줄로 평가해줘.";
            contextMessages.push({ role: "user", content: defaultPrompt });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: contextMessages,
            temperature: 0.7,
        });

        const text = completion.choices[0].message.content;

        return NextResponse.json({ advice: text });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json(
            { error: "AI 분석 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
