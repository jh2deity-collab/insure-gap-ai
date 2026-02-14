"use client"

import { FinancialMBTI } from "@/types"
import { motion } from "framer-motion"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { X, Share2, Download, Sparkles } from "lucide-react"

interface FinancialMbtiResultProps {
    result: FinancialMBTI;
    onClose: () => void;
}

const MBTI_TYPES: Record<string, { title: string; desc: string; advice: string; color: string }> = {
    // Risk (R) vs Safety (S)
    // Spender (S) vs Keeper (K)
    // Planner (P) vs Improvisor (I)
    // Logic (L) vs Emotion (E)

    "RSPL": { title: "전략적인 승부사", desc: "고위험 투자를 즐기지만 철저한 분석과 계획을 동반하는 스마트한 투자자입니다.", advice: "과도한 레버리지만 주의한다면 큰 부를 이룰 수 있습니다.", color: "text-blue-400 border-blue-400" },
    "RSPE": { title: "직관적인 승부사", desc: "투자에 적극적이고 계획적이지만, 가끔은 데이터보다 감을 믿는 편입니다.", advice: "자신의 직감을 데이터로 검증하는 습관을 들이세요.", color: "text-indigo-400 border-indigo-400" },
    "RSIL": { title: "즉흥적인 분석가", desc: "분석은 철저히 하지만, 매매 타이밍은 즉흥적으로 결정하는 경향이 있습니다.", advice: "매매 원칙(Rule)을 세우고 반드시 지키세요.", color: "text-violet-400 border-violet-400" },
    "RSIE": { title: "불꽃 같은 모험가", desc: "인생은 한 방! 뜨거운 가슴으로 투자의 파도에 몸을 맡기는 유형입니다.", advice: "포트폴리오의 50%는 안전 자산으로 묶어두세요.", color: "text-red-400 border-red-400" },

    "RKPL": { title: "냉철한 자산가", desc: "절약하며 모은 돈으로 고수익 투자를 노리는, 부자가 될 확률이 가장 높은 유형입니다.", advice: "지금처럼만 하세요. 다만 너무 아끼기만 하면 삶이 팍팍해집니다.", color: "text-emerald-400 border-emerald-400" },
    "RKPE": { title: "꿈꾸는 자산가", desc: "돈을 모으는 목표가 명확하고, 투자를 통해 꿈을 실현하려는 유형입니다.", advice: "장기적인 안목을 가지고 꾸준히 투자하세요.", color: "text-teal-400 border-teal-400" },
    "RKIL": { title: "실속파 헌터", desc: "평소엔 짠돌이지만, 확실한 투자 기회가 오면 과감하게 배팅합니다.", advice: "평소에 투자 공부를 게을리하지 마세요.", color: "text-cyan-400 border-cyan-400" },
    "RKIE": { title: "귀가 얇은 저축왕", desc: "열심히 저축하지만, 주변의 '대박' 소식에 솔깃해 투자를 시도합니다.", advice: "남의 말만 듣고 투자하는 것은 금물입니다.", color: "text-sky-400 border-sky-400" },

    "SSPL": { title: "합리적인 소비요정", desc: "쓸 땐 쓰지만, 계획적으로 소비하며 안전한 자산 관리를 선호합니다.", advice: "소비 통제만 잘 되면 안정적인 미래가 보장됩니다.", color: "text-pink-400 border-pink-400" },
    "SSPE": { title: "감성적인 플래너", desc: "분위기에 약해 지출이 잦지만, 나름대로 가계부는 열심히 쓰는 귀여운 유형.", advice: "예산을 초과했을 때의 페널티를 스스로 정해보세요.", color: "text-rose-400 border-rose-400" },
    "SSIL": { title: "무계획 분석가", desc: "돈 관리에 대한 이론은 빠삭하지만, 실천(소비 통제)이 잘 안 되는 편입니다.", advice: "아는 것보다 실천하는 것이 중요합니다. 자동 이체를 활용하세요.", color: "text-orange-400 border-orange-400" },
    "SSIE": { title: "욜로(YOLO)족", desc: "인생은 한 번뿐! 현재의 즐거움을 위해 아낌없이 투자하는 유형입니다.", advice: "노후 준비는 '남의 일'이 아닙니다. 월 10만원이라도 연금에 넣으세요.", color: "text-yellow-400 border-yellow-400" },

    "SKPL": { title: "깐깐한 관리자", desc: "작은 돈도 허투루 쓰지 않으며, 안전하고 확실한 길만 걷는 모범생입니다.", advice: "물가 상승률을 헷지(Hedge)하기 위한 소액 투자를 시작해보세요.", color: "text-green-400 border-green-400" },
    "SKPE": { title: "걱정 많은 다람쥐", desc: "미래에 대한 불안감으로 열심히 모으지만, 정작 투자는 무서워합니다.", advice: "현금도 인플레이션이라는 위험에 노출되어 있음을 기억하세요.", color: "text-lime-400 border-lime-400" },
    "SKIL": { title: "즉흥적인 짠돌이", desc: "평소엔 안 쓰다가, 꽂히는 물건이 있으면 앞뒤 안 가리고 지릅니다.", advice: "지출 전에 '3일의 법칙'(3일간 고민하기)을 적용해보세요.", color: "text-amber-400 border-amber-400" },
    "SKIE": { title: "평화주의자", desc: "돈 문제로 골치 아픈 게 싫어, 그냥 맘 편히 저축하고 적당히 씁니다.", advice: "자산 관리를 AI나 전문가에게 맡기는 것도 좋은 방법입니다.", color: "text-slate-400 border-slate-400" },
};

export default function FinancialMbtiResult({ result, onClose }: FinancialMbtiResultProps) {
    const typeInfo = MBTI_TYPES[result.type] || MBTI_TYPES["RSPL"]; // Default fallback

    const chartData = [
        { subject: '위험감수(Risk)', A: result.scores.R * 20 + 50, fullMark: 100 }, // Scaling for chart
        { subject: '소비성향(Spend)', A: result.scores.S * 20 + 50, fullMark: 100 },
        { subject: '계획성(Plan)', A: result.scores.P * 20 + 50, fullMark: 100 },
        { subject: '논리성(Logic)', A: result.scores.L * 20 + 50, fullMark: 100 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full transition-colors z-10">
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <span className="text-sm font-bold text-slate-400 tracking-widest">FINANCIAL TYPE</span>
                        <h2 className={`text-5xl font-black ${typeInfo.color.split(' ')[0]} drop-shadow-lg`}>
                            {result.type}
                        </h2>
                    </div>

                    <div className="relative py-6">
                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-current to-transparent ${typeInfo.color.split(' ')[0]}`} />
                        <h3 className="text-2xl font-bold text-white relative z-10">{typeInfo.title}</h3>
                        <p className="text-slate-300 mt-2 leading-relaxed">{typeInfo.desc}</p>
                    </div>

                    {/* Chart */}
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Radar
                                    name="Me"
                                    dataKey="A"
                                    stroke="#818cf8"
                                    strokeWidth={2}
                                    fill="#6366f1"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Sparkles className="w-12 h-12 text-white/5 animate-pulse" />
                        </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 text-left">
                        <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> AI가 제안하는 솔루션
                        </h4>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            {typeInfo.advice}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" /> 공유하기
                        </button>
                        <button onClick={onClose} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
                            확인
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
