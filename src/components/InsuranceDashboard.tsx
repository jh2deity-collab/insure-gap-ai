"use client"

import Image from "next/image"
import { useMemo } from "react"
import { Shield, Download, RotateCcw, BarChart2, ShieldCheck, TrendingUp, Activity, Heart, ShieldAlert, Scissors, RefreshCw } from "lucide-react"
import { UserState, StandardData, CoverageData, AnalysisResult, HealthMetrics, HealthRisk, DietRecommendation } from "@/types"
import { getLifeStageAdvice, getActionPlan } from "@/lib/data"
import InputSection from "@/components/InputSection"
import RadarVis from "@/components/RadarVis"
import ScoreCard from "@/components/ScoreCard"
import AIClosing from "@/components/AIClosing"
import OnboardingGuide from "@/components/OnboardingGuide"
import HealthDataInput from "@/components/HealthDataInput"
import InsuranceDietSummary from "@/components/InsuranceDietSummary"
import BodyMapVis from "@/components/BodyMapVis"
import { calculateHealthRisks } from "@/lib/medicalLogic"
import { calculateDietRecommendations } from "@/lib/dietLogic"

interface InsuranceDashboardProps {
    userState: UserState;
    standardData: CoverageData;
    gapAnalysis: AnalysisResult;
    onChange: (key: string, value: string | number | { key: string; value: number } | HealthMetrics) => void;
    onMyDataConnect: () => void;
}

export default function InsuranceDashboard({
    userState,
    standardData,
    gapAnalysis,
    onChange,
    onMyDataConnect
}: InsuranceDashboardProps) {

    // Calculate Health Risks based on current user metrics
    const healthRisks = useMemo(() => {
        if (!userState.healthMetrics) return [];
        return calculateHealthRisks(userState.healthMetrics);
    }, [userState.healthMetrics]);

    // Calculate Diet Recommendations (Over-coverage)
    const dietRecommendations = useMemo(() => {
        return calculateDietRecommendations(userState.coverages, standardData);
    }, [userState.coverages, standardData]);

    // Memoize Life Stage Advice
    const lifeAdvice = useMemo(() => getLifeStageAdvice(userState.age), [userState.age]);

    // Memoize Action Plan
    const roadmap = useMemo(() => {
        // @ts-ignore - Need pseudo financeState for insurance only view
        const pseudoFinance = {
            ...userState,
            currentIncome: 500,
            currentExpenses: 250,
            assets: { cash: 0, stock: 0, realEstate: 0, pension: 0, insurance: 0, crypto: 0 },
            nationalPension: 0,
            targetMonthlyIncome: 0,
            retirementAge: 65,
            lifeEvents: []
        };
        return getActionPlan(userState, pseudoFinance, gapAnalysis);
    }, [userState, gapAnalysis]);

    const allActions = useMemo(() => [...roadmap.shortTerm.items, ...roadmap.midTerm.items, ...roadmap.longTerm.items], [roadmap]);

    return (
        <div className="space-y-12 pb-24">
            <OnboardingGuide />

            {/* Stage 0: System Data Sync & Global Control */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/60 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl animate-in slide-in-from-top-6 duration-700 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <RefreshCw className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Intelligent Data Sync</h4>
                            {userState.myData?.isConnected && (
                                <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> SYNCED
                                </span>
                            )}
                        </div>
                        {userState.myData?.isConnected ? (
                            <p className="text-[11px] text-slate-400 font-bold">최종 데이터 스캔: {new Date(userState.myData.lastSync || "").toLocaleString()}</p>
                        ) : (
                            <p className="text-[11px] text-slate-500 font-bold">마이데이터를 동기화하여 실시간 보장 리스크를 분석하세요.</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={onMyDataConnect}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 rounded-2xl text-blue-400 text-xs font-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-900/20 group"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-1000" />
                    MyData 자동 불러오기
                </button>
            </div>

            {/* Stage 1: Strategic Insight Header (Value Proposition) */}
            <section className="relative overflow-hidden rounded-[40px] bg-slate-900/40 border border-slate-800/80 p-8 lg:p-12 backdrop-blur-sm shadow-xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[140px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[140px] -z-10" />

                <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
                    {/* Visual Score Diagnostic Container */}
                    <div className="w-full lg:w-3/5">
                        <ScoreCard score={gapAnalysis.score} />
                    </div>

                    {/* Critical Synergy Alert */}
                    <div className="w-full lg:max-w-md">
                        {healthRisks.length > 0 ? (
                            <div className="bg-purple-500/5 border border-purple-500/20 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl">
                                <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-all duration-1000" />
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-lg">
                                        <Shield className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-purple-200 tracking-tight">지능형 긴급 보장 탐지</h4>
                                        <p className="text-[10px] text-purple-400/70 font-black uppercase tracking-[0.3em] leading-none mt-1.5">Precision Diagnostic active</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    {healthRisks.slice(0, 2).map((risk, i) => (
                                        <li key={i} className="flex items-start gap-5 text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-purple-500/10 transition-all hover:border-purple-500/40 hover:translate-x-1">
                                            <div className="mt-2 w-2 h-2 rounded-full bg-purple-500 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                            <span className="font-bold text-slate-300">{risk.reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-slate-800/20 border border-slate-800/50 rounded-[32px] p-10 flex flex-col items-center justify-center text-center backdrop-blur-md">
                                <ShieldCheck className="w-14 h-14 text-slate-700 mb-5" />
                                <h5 className="text-slate-400 font-black text-lg mb-2">SAFE ZONE STATUS</h5>
                                <p className="text-slate-500 text-sm font-bold leading-relaxed">현재 탐지된 심각한 보장 공백이나<br />건강 연계 위험 요소가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Stage 2: Balanced Analysis Matrix (Config vs Analytics) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left: Input & Strategy Engine (Active Management) */}
                <div className="space-y-12">
                    {/* Coverage Data Management */}
                    <div className="bg-slate-900/30 border border-slate-800/60 rounded-[40px] p-10 transition-all hover:bg-slate-900/50 hover:border-blue-500/20 shadow-xl overflow-hidden group">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-4 text-slate-100 italic">
                                <BarChart2 className="w-7 h-7 text-blue-500 shadow-blue-500/50" />
                                <span className="tracking-tighter">보장 포트폴리오 스캔</span>
                            </h3>
                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">Config Mode</div>
                        </div>
                        <InputSection userState={userState} onChange={onChange} />
                    </div>

                    {/* Medical Synergy Calibration */}
                    <div className="bg-slate-900/30 border border-slate-800/60 rounded-[40px] p-10 transition-all hover:bg-slate-900/50 hover:border-emerald-500/20 shadow-xl overflow-hidden">
                        <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-100 italic">
                            <Activity className="w-7 h-7 text-emerald-500 shadow-emerald-500/50" />
                            <span className="tracking-tighter">건강-보장 동기화 엔진</span>
                        </h3>
                        <HealthDataInput
                            healthMetrics={userState.healthMetrics}
                            onChange={(metrics) => onChange('healthMetrics', metrics)}
                        />
                    </div>

                    {/* Conclusion Terminal */}
                    <div className="pt-4">
                        <AIClosing
                            gapCount={gapAnalysis.gapCount}
                            missingItems={Object.keys(userState.coverages).filter(k =>
                                // @ts-ignore
                                userState.coverages[k] < standardData[k] * 0.7
                            )}
                        />
                    </div>
                </div>

                {/* Right: Visual Matrix & Expert Analysis (Passive Insights) */}
                <div className="space-y-12">
                    {/* Complex Visual Analytics Engine */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-[40px] p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-blue-500/[0.03] pointer-events-none rounded-[40px]" />
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic text-slate-100">Intelligent Analysis Matrix</h3>
                            <div className="flex gap-6 text-[10px] uppercase tracking-[0.4em] font-black">
                                <span className="flex items-center gap-2.5 text-blue-400">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> MINE
                                </span>
                                <span className="flex items-center gap-2.5 text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-slate-600" /> RECOMMENDED
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="relative group/radar py-8 flex justify-center">
                                <RadarVis userData={userState.coverages} standardData={standardData} />
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] opacity-60">Coverage Spectrum</div>
                            </div>
                            <div className="flex flex-col items-center group/body">
                                <BodyMapVis coverages={userState.coverages} standard={standardData} />
                            </div>
                        </div>
                    </div>

                    {/* Actionable Strategy Cluster */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* Precision Medical Report */}
                        {healthRisks.length > 0 && (
                            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-purple-500/10 rounded-[40px] p-10 relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/10 via-purple-500/30 to-blue-500/10" />
                                <h4 className="text-2xl font-black text-white mb-10 flex items-center gap-5 italic text-slate-100">
                                    <Heart className="w-7 h-7 text-red-500 animate-pulse shadow-red-500/40" />
                                    <span className="tracking-tighter">건강 지표 기반 정밀 분석</span>
                                </h4>
                                <div className="space-y-6">
                                    {healthRisks.map((risk, i) => {
                                        const isGap = (userState.coverages[risk.category] || 0) < (standardData[risk.category] || 0) * 0.8;
                                        return (
                                            <div key={i} className="flex items-center gap-8 bg-slate-900/90 p-6 rounded-3xl border border-slate-800/80 transition-all duration-700 hover:border-purple-500/30 hover:bg-slate-900">
                                                <div className={`p-4 rounded-2xl ${isGap ? 'bg-red-500/5 border border-red-500/20' : 'bg-emerald-500/5 border border-emerald-500/20 shadow-md'}`}>
                                                    {isGap ? <ShieldAlert className="w-7 h-7 text-red-500" /> : <ShieldCheck className="w-7 h-7 text-emerald-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-lg font-black text-slate-100 tracking-tight">
                                                            {risk.category === 'cancer' ? '암 보장 솔루션' : risk.category === 'brain' ? '뇌혈관 질환 대응' : '심혈관 입체 보호망'}
                                                        </span>
                                                        <span className={`text-[10px] px-3 py-1.5 rounded-full font-black tracking-[0.1em] border shadow-sm ${isGap ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                                            {isGap ? 'CRITICAL GAP' : 'OPTIMIZED'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 font-bold leading-relaxed">{risk.reason}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Future Strategic Roadmap */}
                        <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[40px] p-10 relative overflow-hidden group shadow-lg">
                            <div className="absolute right-[-40px] top-[-40px] opacity-[0.05] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                                <TrendingUp className="w-64 h-64 text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-5 mb-8">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg">
                                    <TrendingUp className="w-7 h-7 text-emerald-500" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-2xl font-black text-emerald-400 tracking-tighter">{lifeAdvice.title}</h4>
                                    <p className="text-[11px] text-emerald-500/40 font-black uppercase tracking-[0.4em] mt-1">Lifecycle Strategic Roadmap</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-base font-bold leading-relaxed mb-10 relative z-10 max-w-xl">{lifeAdvice.advice}</p>
                            <div className="flex flex-wrap gap-3 relative z-10">
                                {lifeAdvice.priority.map((item, i) => (
                                    <span key={i} className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[11px] font-black border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-default shadow-sm italic">
                                        # {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stage 3: Premium Efficiency Audit (Value Recovery) */}
            <div className="mt-24 pt-24 border-t border-slate-800/60 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                    <div className="flex items-center gap-8">
                        <div className="p-6 bg-red-500/5 rounded-full border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse">
                            <Scissors className="w-12 h-12 text-red-500" />
                        </div>
                        <div>
                            <span className="text-[11px] text-red-500/80 font-black uppercase tracking-[0.6em] mb-2 block">Efficiency Audit</span>
                            <h3 className="text-5xl font-black text-white tracking-tighter italic">보험료 다이어트 리포트</h3>
                            <p className="text-slate-500 font-bold text-lg mt-2 italic">불필요한 과잉 보장을 제거하여 미래 자산을 확보하십시오.</p>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="px-6 py-3 border border-slate-800 rounded-full text-slate-500 text-[10px] font-black tracking-widest uppercase bg-slate-900/50">Report Version 1.0.4 - Premium Alpha</div>
                    </div>
                </div>
                <InsuranceDietSummary recommendations={dietRecommendations} />
            </div>
        </div>
    );
}
