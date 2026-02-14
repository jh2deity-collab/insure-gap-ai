"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, RefreshCw } from "lucide-react"

interface Question {
    id: number;
    dimension: 'R' | 'S' | 'P' | 'L';
    text: string;
    options: {
        A: string; // Score +1 for first letter (R, S, P, L)
        B: string; // Score -1 (or +1 for opposing S, K, I, E)
    }
}

const QUESTIONS: Question[] = [
    // R (Risk) vs S (Safety)
    { id: 1, dimension: 'R', text: "여윳돈 1,000만원이 생겼다면?", options: { A: "기대 수익률이 높은 주식/코인 투자", B: "원금이 보장되는 예금/적금 가입" } },
    { id: 2, dimension: 'R', text: "투자 상품을 고를 때 가장 중요한 것은?", options: { A: "높은 수익률 (High Risk High Return)", B: "안정성 (원금 손실 절대 안돼)" } },
    { id: 3, dimension: 'R', text: "주식 시장이 20% 하락했다면?", options: { A: "저가 매수의 기회! 더 산다.", B: "무서워서 일단 전량 매도한다." } },

    // S (Spender) vs K (Keeper)
    { id: 4, dimension: 'S', text: "사고 싶은 명품/고가 전자기기가 있다면?", options: { A: "할부로라도 일단 지르고 본다.", B: "돈을 모을 때까지 참거나 안 산다." } },
    { id: 5, dimension: 'S', text: "월급 날 나의 통장 잔고는?", options: { A: "카드값 빠져나가면 '텅장'이다.", B: "저축액 먼저 빼두고 남은 돈으로 쓴다." } },
    { id: 6, dimension: 'S', text: "친구들과 만날 때 계산은?", options: { A: "내가 낸다! (기분파)", B: "정확하게 1/N 또는 돌아가면서." } },

    // P (Planner) vs I (Improvisor)
    { id: 7, dimension: 'P', text: "해외 여행을 간다면?", options: { A: "분 단위 엑셀 계획표 작성", B: "항공권만 끊고 가서 생각한다." } },
    { id: 8, dimension: 'P', text: "가계부를 작성하시나요?", options: { A: "매일 꼼꼼하게 기록한다.", B: "귀찮아서 안 쓴다. 대충 감으로 산다." } },
    { id: 9, dimension: 'P', text: "10년 후의 재무 목표가 있나요?", options: { A: "구체적인 금액과 달성 계획이 있다.", B: "하루하루 살기도 바쁘다." } },

    // L (Logic) vs E (Emotion)
    { id: 10, dimension: 'L', text: "투자를 결정할 때 참고하는 것은?", options: { A: "재무제표, 뉴스, 데이터 분석", B: "지인의 추천, 유튜버, 직감" } },
    { id: 11, dimension: 'L', text: "보험 가입할 때 나는?", options: { A: "약관을 꼼꼼히 읽고 보장 분석", B: "설계사가 좋다고 하는 걸로 사인" } },
    { id: 12, dimension: 'L', text: "뉴스를 볼 때 관심사는?", options: { A: "경제 지표, 금리, 환율", B: "연예, 가십, 트렌드" } },
];

interface FinancialMbtiTestProps {
    onComplete: (result: { type: string, scores: { R: number, S: number, P: number, L: number } }) => void;
}

export default function FinancialMbtiTest({ onComplete }: FinancialMbtiTestProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [scores, setScores] = useState({ R: 0, S: 0, P: 0, L: 0 })

    const handleAnswer = (choice: 'A' | 'B') => {
        const question = QUESTIONS[currentStep]
        const dimension = question.dimension

        // A choice increases the score for the primary dimension (R, S, P, L)
        // B choice decreases it (leaning towards S, K, I, E)
        const scoreChange = choice === 'A' ? 1 : -1

        setScores(prev => ({
            ...prev,
            [dimension]: prev[dimension] + scoreChange
        }))

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            // Calculate Result
            // Delay slightly to show selection state? No, immediate is fine.
            finishTest({ ...scores, [dimension]: scores[dimension] + scoreChange })
        }
    }

    const finishTest = (finalScores: typeof scores) => {
        const type = [
            finalScores.R > 0 ? 'R' : 'S', // Risk vs Safety
            finalScores.S > 0 ? 'S' : 'K', // Spender vs Keeper
            finalScores.P > 0 ? 'P' : 'I', // Planner vs Improvisor
            finalScores.L > 0 ? 'L' : 'E', // Logic vs Emotion
        ].join('')

        onComplete({ type, scores: finalScores })
    }

    const progress = ((currentStep) / QUESTIONS.length) * 100

    return (
        <div className="max-w-md mx-auto w-full">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                >
                    <div className="space-y-2 text-center">
                        <span className="text-sm font-bold text-blue-400">Q{currentStep + 1}.</span>
                        <h2 className="text-2xl font-bold text-white leading-relaxed">
                            {QUESTIONS[currentStep].text}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleAnswer('A')}
                            className="w-full p-6 text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                            <span className="text-lg text-slate-200 group-hover:text-white font-medium">
                                A. {QUESTIONS[currentStep].options.A}
                            </span>
                        </button>

                        <button
                            onClick={() => handleAnswer('B')}
                            className="w-full p-6 text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500 rounded-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 w-1 h-full bg-purple-500/0 group-hover:bg-purple-500 transition-all" />
                            <span className="text-lg text-slate-200 group-hover:text-white font-medium">
                                B. {QUESTIONS[currentStep].options.B}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
