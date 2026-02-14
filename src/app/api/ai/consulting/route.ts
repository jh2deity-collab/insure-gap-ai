import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { userState, financeState, mode } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key is not configured." },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = "";

        if (mode === 'insurance') {
            prompt = `
                너는 보험 및 재무 설계 전문가야. 아래의 사용자 보험 데이터를 분석해서 아주 전문적이고 따뜻한 목소리로 컨설팅을 제공해줘.
                
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
                
                [요청사항]
                1. 현재 보장의 가장 큰 공백(Gap)이 무엇인지 구체적으로 지적해줘.
                2. 해당 연령대에 꼭 필요한 보강 전략을 3줄 이내로 제안해줘.
                3. 마지막에는 사용자를 응원하는 한마디를 해줘.
                
                응답은 한국어로, 친절하고 신뢰감 있게 작성해줘. HTML 태그 없이 텍스트로만 응답해줘.
            `;
        } else {
            prompt = `
                너는 자산 관리 및 은퇴 설계 전문가야. 아래의 사용자 재무 데이터를 분석해서 아주 전문적이고 통찰력 있는 컨설팅을 제공해줘.
                
                [사용자 정보]
                이름: ${financeState.name || '고객님'}
                나이: ${financeState.age}세
                목표 은퇴 나이: ${financeState.retirementAge}세
                은퇴 후 희망 월 소득: ${financeState.targetMonthlyIncome.toLocaleString()}만원
                
                [현재 재무 현감 (단위: 만원)]
                월 수입: ${financeState.currentIncome.toLocaleString()}
                월 지출: ${financeState.currentExpenses.toLocaleString()}
                국민연금 예상액: ${financeState.nationalPension.toLocaleString()}
                총 자산: ${(Object.values(financeState.assets).reduce((a, b) => (a as number) + (b as number), 0) as number).toLocaleString()}
                
                [요청사항]
                1. 현재 자산 형성 속도로 보아 은퇴 목표 달성 가능성을 평가해줘.
                2. 자산 배분(현금, 주식, 부동산 등)이나 지출 관리 측면에서 가장 시급한 개선점 하나를 짚어줘.
                3. 미래를 위한 투자 전략이나 준비해야 할 마음가짐을 제안해줘.
                
                응답은 한국어로, 분석적이고 힘이 되는 어조로 작성해줘. HTML 태그 없이 텍스트로만 응답해줘.
            `;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ advice: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "AI 분석 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
