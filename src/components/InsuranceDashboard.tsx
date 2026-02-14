"use client"

import Image from "next/image"
import { Shield, Download, RotateCcw, BarChart2, ShieldCheck, TrendingUp } from "lucide-react"
import { UserState, StandardData, CoverageData, AnalysisResult } from "@/types"
import { getLifeStageAdvice, getActionPlan } from "@/lib/data"
import InputSection from "@/components/InputSection"
import RadarVis from "@/components/RadarVis"
import ScoreCard from "@/components/ScoreCard"
import AIClosing from "@/components/AIClosing"
import OnboardingGuide from "@/components/OnboardingGuide"

interface InsuranceDashboardProps {
    userState: UserState;
    standardData: CoverageData;
    gapAnalysis: AnalysisResult;
    onChange: (key: string, value: string | number | { key: string; value: number }) => void;
}

export default function InsuranceDashboard({
    userState,
    standardData,
    gapAnalysis,
    onChange
}: InsuranceDashboardProps) {
    return (
        <div>
            <OnboardingGuide />


            {/* Hero Score Section */}
            <section className="py-10">
                <h2 className="text-slate-400 mb-4 text-center">현재 나의 보장 준비 점수는?</h2>
                <div className="w-full mb-8">
                    <ScoreCard score={gapAnalysis.score} />
                </div>
            </section>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Input */}
                <div className="lg:col-span-5">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-blue-500" /> 보장 데이터 입력
                    </h3>
                    <InputSection userState={userState} onChange={onChange} />
                </div>

                {/* Right: Visualization */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-6 text-center">보장 공백 시각화 (The Gap)</h3>
                        <RadarVis userData={userState.coverages} standardData={standardData} />

                        <div className="mt-6 flex justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#0066FF]"></span>
                                <span className="text-slate-300">내 보장</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-slate-500 border border-slate-400 border-dashed"></span>
                                <span className="text-slate-400">권장 기준</span>
                            </div>
                        </div>
                    </div>

                    {/* Life-stage Advice */}
                    {(() => {
                        const lifeAdvice = getLifeStageAdvice(userState.age);
                        return (
                            <div className="mt-6 bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5 animate-in fade-in slide-in-from-left-4 duration-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <h4 className="font-bold text-emerald-400">{lifeAdvice.title}</h4>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    {lifeAdvice.advice}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {lifeAdvice.priority.map((item, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/20">
                                            #{item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    {/* AI Closing Script */}
                    <div className="mt-6">
                        <AIClosing
                            gapCount={gapAnalysis.gapCount}
                            missingItems={Object.keys(userState.coverages).filter(k =>
                                // @ts-ignore
                                userState.coverages[k] < standardData[k] * 0.7
                            )}
                        />
                    </div>

                    {/* Action Plan */}
                    {(() => {
                        // @ts-ignore - Need pseudo financeState for insurance only view
                        const pseudoFinance = { currentIncome: 500, currentExpenses: 250 };
                        const actions = getActionPlan(userState, pseudoFinance, gapAnalysis);
                        return (
                            <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" /> 핵심 액션 플랜
                                </h4>
                                <div className="space-y-3">
                                    {actions.map((action, i) => (
                                        <div key={i} className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                            <span className="text-xl">{action.icon}</span>
                                            <div>
                                                <p className="text-emerald-400 text-sm font-bold">{action.title}</p>
                                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{action.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Action Bar */}
            <div className="mt-12 text-center" data-html2canvas-ignore>
                <p className="mt-4 text-slate-500 text-sm">
                    *본 분석 결과는 통계적 수치에 기반하며 실제 보험 가입 가능 여부와는 다를 수 있습니다.
                </p>
            </div>
        </div>
    )
}
