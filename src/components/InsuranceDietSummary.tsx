"use client"

import { Scissors, TrendingDown, ArrowRight, Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { DietRecommendation } from "@/types"

interface InsuranceDietSummaryProps {
    recommendations: DietRecommendation[];
}

export default function InsuranceDietSummary({ recommendations }: InsuranceDietSummaryProps) {
    if (recommendations.length === 0) {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                <div className="inline-flex p-3 bg-emerald-500/20 rounded-full mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-white font-bold mb-1">현재 보장이 최적화되어 있습니다!</h4>
                <p className="text-slate-400 text-sm">불필요하게 낭비되는 보험료 없이 스마트하게 관리 중이시네요.</p>
            </div>
        );
    }

    const totalSavings = recommendations.reduce((sum, rec) => sum + rec.savingsPotential, 0);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            {/* Header: Total Savings */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500 rounded-lg shadow-lg shadow-red-500/20">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">AI 보험 다이어트 제안</h4>
                            <p className="text-red-300/80 text-xs font-medium">불필요한 보장을 줄여 고정 지출을 최적화하세요.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">예상 월 절감액</p>
                        <p className="text-2xl font-black text-white">
                            ₩{totalSavings.toLocaleString()} <span className="text-sm font-medium text-slate-400">/ 월</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommendations List */}
            <div className="p-4 space-y-4">
                {recommendations.map((rec, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 transition-all hover:border-slate-600">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${rec.priority === 'high' ? 'bg-red-500 text-white' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                                    {rec.priority === 'high' ? '강력 권고' : '조정 권장'}
                                </span>
                                <h5 className="text-sm font-bold text-slate-200">
                                    {rec.category === 'cancer' ? '암 진단비' : rec.category === 'brain' ? '뇌질환 진단비' : rec.category === 'heart' ? '심장질환 진단비' : '기타 보장'}
                                </h5>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> ₩{rec.savingsPotential.toLocaleString()} 절감
                                </span>
                            </div>
                        </div>

                        {/* Comparative Visual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-medium">
                                    <span className="text-slate-500 uppercase">보장 금액 변화</span>
                                    <span className="text-slate-300">{rec.currentAmount}만원 → <span className="text-emerald-400">{rec.targetAmount}만원</span></span>
                                </div>
                                <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="absolute top-0 left-0 h-full bg-slate-600 w-full" title="현재"></div>
                                    <div
                                        className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000"
                                        style={{ width: `${(rec.targetAmount / rec.currentAmount) * 100}%` }}
                                        title="최적화 후"
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <p className="text-[11px] text-slate-400 leading-relaxed flex gap-2">
                                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                                    {rec.reason}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Insight */}
            <div className="bg-slate-900 p-4 border-t border-slate-800">
                <div className="flex gap-3 items-center text-[10px] text-slate-500">
                    <AlertTriangle className="w-4 h-4 text-orange-500/50" />
                    <p>특약 해지 전 환급금 및 재가입 조건을 전문가와 상의하시기 바랍니다. AI 분석은 평균 통계에 기반합니다.</p>
                </div>
            </div>
        </div>
    );
}
