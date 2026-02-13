"use client"

import { Bot, Quote } from "lucide-react"

interface AIClosingProps {
    gapCount: number;
    missingItems: string[];
}

export default function AIClosing({ gapCount, missingItems }: AIClosingProps) {
    const getScript = () => {
        if (gapCount === 0) return "고객님, 현재 가입하신 보장은 대한민국 상위 10% 수준으로 완벽합니다. 은퇴 자금 준비로 넘어가볼까요?";

        if (missingItems.includes('brain') || missingItems.includes('heart')) {
            return "고객님, 암 보장은 훌륭하지만 '2대 혈관 질환' 보장이 평균 대비 60% 부족합니다. 40대 이후 발병률이 급증하는 뇌/심장 질환에 대비해 월 3만원대로 이 공백만 채워보시는 건 어떨까요?";
        }

        if (missingItems.includes('cancer')) {
            return "고객님, 다른 보장은 잘 준비하셨지만 가장 중요한 '암 진단비'가 부족해 보입니다. 최신 표적항암치료 특약으로 이 부분만 보완하시면 완벽할 것입니다.";
        }

        return "고객님, 전반적으로 보장 밸런스를 조금 더 맞추실 필요가 있습니다. 특히 부족한 영역인 " + missingItems.join(', ') + " 위주로 리모델링을 제안드립니다.";
    }

    return (
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot className="w-16 h-16 text-blue-500" />
            </div>

            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500 rounded text-white">
                    <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-blue-400 text-sm tracking-wider uppercase">AI Closing Assistant</span>
            </div>

            <div className="relative">
                <Quote className="w-4 h-4 text-slate-500 absolute -top-1 -left-2 rotate-180" />
                <p className="text-slate-200 pl-4 pr-2 italic leading-relaxed">
                    {getScript()}
                </p>
                <Quote className="w-4 h-4 text-slate-500 absolute -bottom-2 -right-0" />
            </div>
        </div>
    )
}
