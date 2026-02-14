"use client"

import { useState } from "react"
import { Bot, Quote, ScanSearch } from "lucide-react"
import { analyzePolicyRisks } from "@/lib/policyUtils"
import PolicyRiskModal from "@/components/PolicyRiskModal"
import { PolicyRisk } from "@/types"

interface AIClosingProps {
    gapCount: number;
    missingItems: string[];
    rawOcrText?: string; // Optional: Pass original text if available
}

export default function AIClosing({ gapCount, missingItems, rawOcrText }: AIClosingProps) {
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [risks, setRisks] = useState<PolicyRisk[]>([]);

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

    const handleAnalyzePolicy = () => {
        // Mock text if rawOcrText is not provided or empty for demo purpose
        const textToAnalyze = rawOcrText || `
            제1조 (보험금의 지급사유) 회사는 피보험자가 보험기간 중 암보장개시일 이후에 암으로 진단확정된 때에는 이 약관에 따라 보험금을 지급합니다.
            단, 계약일로부터 90일이 지난 날의 다음날부터 보장합니다.
            제2조 (보험금 지급에 관한 세부규정) 보험기간 중 진단확정된 경우 해당 보험금의 50%를 지급합니다. 
            다만, 최초 계약일로부터 1년 미만 진단 확정 시 해당 보험금의 50% 지급합니다.
            [갱신형] 이 특약은 갱신형으로 갱신 시 보험료가 인상될 수 있습니다.
        `;

        const detectedRisks = analyzePolicyRisks(textToAnalyze);
        setRisks(detectedRisks);
        setIsAnalysisModalOpen(true);
    };

    return (
        <>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bot className="w-16 h-16 text-blue-500" />
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500 rounded text-white">
                            <Bot className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-blue-400 text-sm tracking-wider uppercase">AI Closing Assistant</span>
                    </div>

                    {/* New Analyze Button */}
                    <button
                        onClick={handleAnalyzePolicy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-lg transition-colors"
                    >
                        <ScanSearch className="w-3.5 h-3.5" />
                        AI 약관 정밀 분석
                    </button>
                </div>

                <div className="relative">
                    <Quote className="w-4 h-4 text-slate-500 absolute -top-1 -left-2 rotate-180" />
                    <p className="text-slate-200 pl-4 pr-2 italic leading-relaxed">
                        {getScript()}
                    </p>
                    <Quote className="w-4 h-4 text-slate-500 absolute -bottom-2 -right-0" />
                </div>
            </div>

            <PolicyRiskModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                risks={risks}
                originalText={rawOcrText}
            />
        </>
    )
}
