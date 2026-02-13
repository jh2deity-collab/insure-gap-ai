"use client"

import Image from "next/image"
import { Shield, Download, RotateCcw, BarChart2 } from "lucide-react"
import { UserState, StandardData, CoverageData, AnalysisResult } from "@/types"
import InputSection from "@/components/InputSection"
import RadarVis from "@/components/RadarVis"
import ScoreCard from "@/components/ScoreCard"
import AIClosing from "@/components/AIClosing"
import OnboardingGuide from "@/components/OnboardingGuide"

interface InsuranceDashboardProps {
    userState: UserState;
    standardData: CoverageData;
    gapAnalysis: AnalysisResult;
    onChange: (key: string, value: any) => void;
    onReset: () => void;
    onDownload: () => void;
    onNavigateHome: () => void;
}

export default function InsuranceDashboard({
    userState,
    standardData,
    gapAnalysis,
    onChange,
    onReset,
    onDownload,
    onNavigateHome
}: InsuranceDashboardProps) {
    return (
        <div>
            <OnboardingGuide />
            {/* Header */}
            <header className="py-8 flex justify-between items-center border-b border-slate-800 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onNavigateHome}
                        className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        data-html2canvas-ignore
                    >
                        <Image
                            src="/assets/back-arrow.png"
                            alt="Back"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                        />
                    </button>
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={onNavigateHome}
                    >
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">INSURE-GAP AI</h1>
                    </div>
                </div>

                <div className="flex gap-3" data-html2canvas-ignore>
                    <button
                        onClick={onReset}
                        className="group flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-300"
                        title="설정 초기화"
                    >
                        <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                        <span className="hidden sm:inline font-medium">초기화</span>
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <Download className="w-4 h-4" />
                        <span>리포트 저장</span>
                    </button>
                </div>
            </header>

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
