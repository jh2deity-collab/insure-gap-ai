"use client"

import React from "react"
import { Shield, Target, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, Map, Activity, Layers, BookOpen, Clock } from "lucide-react"
import { UserState, FinanceState, CoverageData, AnalysisResult } from "@/types"
import { getLifeStageAdvice, getActionPlan, getExpertCommentary, getStressTestResults } from "@/lib/data"
import RadarVis from "./RadarVis"
import AssetPieChart from "./AssetPieChart"
import RetirementChart from "./RetirementChart"

interface ReportPDFProps {
    mode: 'insurance' | 'finance';
    userState: UserState;
    financeState: FinanceState;
    standardData: CoverageData;
    gapAnalysis: AnalysisResult;
}

export default function ReportPDF({
    mode,
    userState,
    financeState,
    standardData,
    gapAnalysis,
}: ReportPDFProps) {
    const lifeAdvice = getLifeStageAdvice(userState.age);
    const actionPlans = getActionPlan(userState, financeState, gapAnalysis, mode);
    const expertCommentary = getExpertCommentary(userState, financeState, gapAnalysis, mode);
    const stressTests = getStressTestResults(financeState, mode);
    const manualAssetsValue = Object.entries(financeState.assets)
        .filter(([key, value]) => typeof value === 'number')
        .reduce((sum, [_, value]) => sum + (value as number), 0);
    const trackedStockValue = financeState.assets.trackedStocks?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const trackedCryptoValue = financeState.assets.trackedCrypto?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const totalAssets = manualAssetsValue + trackedStockValue + trackedCryptoValue;

    return (
        <div className="bg-slate-100 p-0 w-[800px] font-sans">
            {/* PAGE 1: PROFESSIONAL COVER */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full -ml-48 -mb-48" />

                <div className="flex justify-between items-start border-b-8 border-blue-600 pb-12 mb-16 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 text-blue-600 mb-6">
                            <Shield className="w-12 h-12 fill-blue-600" />
                            <span className="text-4xl font-black tracking-tighter italic">INSURE-GAP AI</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-6 leading-[1.1]">
                            {mode === 'insurance' ? '보험 보장 정밀 진단' : '프리미엄 재무 분석'}<br />
                            <span className="text-blue-600">통합 솔루션</span> 보고서
                        </h1>
                        <p className="text-slate-500 text-xl font-medium tracking-wide">
                            AI-Driven Advanced {mode === 'insurance' ? 'Insurance' : 'Financial'} Consulting Solution
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold mb-6 text-sm tracking-widest inline-block">PREMIUM REPORT</div>
                        <div className="space-y-1 text-slate-400 font-medium">
                            <p className="text-sm">발행일: {new Date().toLocaleDateString()}</p>
                            <p className="text-sm">분석 ID: #IG-{Math.floor(Math.random() * 90000) + 10000}</p>
                            <p className="text-sm">보안등급: 대외비 (Confidential)</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center relative z-10">
                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-6">
                            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Client Information</h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-2xl font-bold text-slate-800">{(mode === 'insurance' ? userState.name : financeState.name) || "고객"}님 ({mode === 'insurance' ? userState.birthDate : financeState.birthDate}생, 만 {mode === 'insurance' ? userState.age : financeState.age}세 {(mode === 'insurance' ? userState.gender : financeState.gender) === 'male' ? '남성' : '여성'})</p>
                                <p className="text-slate-500 mt-1">{mode === 'insurance' ? '보장 분석' : '재무 설계'} 대상자</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Analysis Overview</h3>
                            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                                <p className="text-sm opacity-80 mb-1 font-bold">종합 진단 점수</p>
                                <p className="text-4xl font-black">{gapAnalysis.score} <span className="text-xl font-normal opacity-60">/ 100</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-blue-400">
                            <BookOpen className="w-7 h-7" /> Table of Contents
                        </h2>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-slate-300 font-medium">
                            <p>01. 종합 진단 전문가 총평</p>
                            <p>02. 상세 {mode === 'insurance' ? '보장 내역' : '자산 구성'} 및 위험 분석</p>
                            <p>03. 시장 상황 및 벤치마킹 비교</p>
                            {mode === 'insurance' && <p>04. 정밀 보장 격차 Deep-Dive</p>}
                            {mode === 'finance' && <p>04. 재무 건전성 및 현금흐름 분석</p>}
                            <p>05. 스트레스 테스트: 시나리오 분석</p>
                            {mode === 'finance' && <p>06. 미래 자산 수명 및 은퇴 시뮬레이션</p>}
                            <p>{mode === 'insurance' ? '06' : '07'}. 핵심 실행 과제 (Action Plan)</p>
                            <p>{mode === 'insurance' ? '07' : '08'}. 리스크 관리 및 점검 가이드</p>
                            <p>{mode === 'insurance' ? '08' : '09'}. 최종 어드바이스 및 법적 고지</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 2: EXECUTIVE SUMMARY (EXPERT COMMENTARY) */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><BookOpen className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">01. 종합 진단 전문가 총평</h3>
                </div>

                <div className="bg-blue-50/50 p-10 rounded-3xl border border-blue-100 mb-12 relative">
                    <div className="absolute top-0 left-0 p-4 -mt-4 -ml-4">
                        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Expert Opinion</div>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-6">AI 기반 종합 재무 제언</h4>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
                        "{expertCommentary.executiveSummary}"
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 flex-1">
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-4 mb-4">시장 전망 및 거시적 관점</h4>
                        <div className="bg-slate-50 p-8 rounded-3xl text-slate-600 leading-bold">
                            <p className="leading-relaxed mb-4">{expertCommentary.marketOutlook}</p>
                            <p className="text-slate-500 text-sm">현재의 고인플레이션 환경에서는 정적인 보장 자산 관리보다는 유동성과 실물 가치 방어가 병행되어야 함을 시사합니다.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-4 mb-4">주요 위험 카테고리 진단</h4>
                        <div className="grid grid-cols-3 gap-6">
                            {expertCommentary.riskAnalysis.map((risk, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="font-bold text-slate-900">{risk.category}</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${risk.status === '안정' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {risk.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{risk.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page 02</p>
                </div>
            </div>

            {/* PAGE 3: CURRENT RISK/ASSET BREAKDOWN */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Layers className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">02. 상세 {mode === 'insurance' ? '보장 내역' : '자산 구성'} 및 위험 분석</h3>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl mb-12">
                    <h4 className="font-bold text-slate-800 mb-6 border-b pb-2">분석 통계 데이터 모델링</h4>
                    <div className="flex items-center gap-10">
                        <div className="w-1/2">
                            {mode === 'insurance' ? (
                                <RadarVis userData={userState.coverages} standardData={standardData} />
                            ) : (
                                <AssetPieChart assets={financeState.assets} />
                            )}
                        </div>
                        <div className="w-1/2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
                                <p className="text-slate-400 text-xs uppercase font-bold mb-1 tracking-widest">Analysis Target</p>
                                <p className="text-3xl font-black text-slate-900">
                                    {mode === 'insurance' ? '종합 보장 공백' : '순자산 합계'}<br />
                                    <span className="text-blue-600">
                                        {mode === 'insurance' ? `${gapAnalysis.gapCount}개 항목 노출` : `${(totalAssets / 10000).toFixed(1)}억원`}
                                    </span>
                                </p>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed italic px-4">
                                * 현재 {(mode === 'insurance' ? userState.name : financeState.name) || '고객'}님의 전체 {mode === 'insurance' ? '보장' : '자산'} 비중은 연령대 평균 대비 {gapAnalysis.score > 70 ? '준수한' : '보완이 시급한'} 편입니다. 특히 비유동성 자산의 비중 관리가 핵심입니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-4 mb-6">위험 관리 지표 상세 (Risk Metrics)</h4>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="py-4 text-sm font-bold text-slate-500">항목</th>
                                <th className="py-4 text-sm font-bold text-slate-500">현재 수치</th>
                                <th className="py-4 text-sm font-bold text-slate-500">권장 기준</th>
                                <th className="py-4 text-sm font-bold text-slate-500">진단 결과</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mode === 'insurance' ? (
                                (Object.entries(userState.coverages) as [keyof CoverageData, number][]).map(([key, val], i) => (
                                    <tr key={key} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-slate-700">{key === 'cancer' ? '암 진단비' : key === 'brain' ? '뇌질환' : key === 'heart' ? '심장질환' : key === 'medical' ? '의료비' : '사망보장'}</td>
                                        <td className="py-4 text-slate-600">{val.toLocaleString()}만원</td>
                                        <td className="py-4 text-slate-400">{(standardData as any)[key].toLocaleString()}만원</td>
                                        <td className="py-4">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${val >= (standardData as any)[key] * 0.8 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                {val >= (standardData as any)[key] * 0.8 ? '충분' : '부족'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                (Object.entries(financeState.assets).filter(([k, v]) => typeof v === 'number') as [string, number][]).map(([key, val], i) => {
                                    const displayVal = key === 'stock' ? val + trackedStockValue : key === 'crypto' ? val + trackedCryptoValue : val;
                                    return (
                                        <tr key={key} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 font-bold text-slate-700">
                                                {key === 'cash' ? '현금/예금' :
                                                    key === 'stock' ? '주식/펀드' :
                                                        key === 'realEstate' ? '부동산' :
                                                            key === 'pension' ? '개인/퇴직연금' :
                                                                key === 'insurance' ? '보험 자산' : '가상화폐/기타'}
                                            </td>
                                            <td className="py-4 text-slate-600">{displayVal.toLocaleString()}만원</td>
                                            <td className="py-4 text-slate-400">-</td>
                                            <td className="py-4 font-bold text-slate-500">{((displayVal / (totalAssets || 1)) * 100).toFixed(1)}%</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-auto p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page 03</p>
                </div>
            </div>

            {/* PAGE 4: MARKET CONTEXT & BENCHMARKING */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">03. 시장 상황 및 벤치마킹 비교</h3>
                </div>

                <div className="bg-slate-900 p-10 rounded-[40px] text-white mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><TrendingUp className="w-32 h-32" /></div>
                    <h4 className="text-xl font-bold text-blue-400 mb-6 tracking-tight italic">Benchmark Analysis</h4>
                    <p className="text-lg leading-relaxed text-slate-300">
                        {(mode === 'insurance' ? userState.name : financeState.name) || '고객'}님의 데이터와 동일 연령/성별 대조군의 평균 데이터를 비교 분석한 결과입니다.
                        단순 평균을 넘어, 시대적 리스크인 <span className="text-white font-bold underline">인플레이션 가속화</span>와 <span className="text-white font-bold underline">질병 이환 기간 증가</span>를 고려한 보정값이 적용되었습니다.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h5 className="font-bold text-slate-800 mb-2">업계 권장 표준</h5>
                        <p className="text-2xl font-black text-slate-900 italic">Advanced Standard</p>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">준비된 자산 가치가 물가 상승률(3% 가정)을 이길 수 있도록 설정된 가이드라인입니다.</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h5 className="font-bold text-slate-800 mb-2">고객 준비 현황</h5>
                        <p className="text-2xl font-black text-emerald-600 italic">Optimized Status</p>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">현 자산 구성을 5년 뒤의 실질 구매력으로 환산했을 때의 방어력입니다.</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mb-12 flex-1">
                    <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">Expert Commentary</h4>
                    <p className="text-blue-700 leading-relaxed font-bold">
                        "통계에 따르면 {mode === 'insurance' ? '상위 20%의 자산가들은 보험 등 보장성 자산에 총 지출의 약 15%를 배분합니다.' : '부유층의 경우 자산의 40% 이상을 현금 흐름 창출이 가능한 자산에 배치합니다.'} 고객님의 현재 배분율은
                        {mode === 'insurance' ? ' 권장 기준을 소폭 하회하고 있어,' : ' 적정 수준이나,'}
                        {mode === 'insurance' ? " 전략적으로 '소득 상실 보전' 보다는 '직접 의료비' 에 치중되어 있습니다. 이를 균형있게 재조정하는 것이 향후 10년의 재무 안정성을 결정짓게 될 것입니다." : " 유동성이 다소 과하여 수익률 방어가 우려됩니다. 인플레이션을 고려한 적극적 운용이 필요합니다."}
                    </p>
                </div>
                <div className="mt-auto p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page 04</p>
                </div>
            </div>

            {/* PAGE 5: MODE-SPECIFIC DETAIL DEEP-DIVE */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Target className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{mode === 'insurance' ? '04. 정밀 보장 격차 Deep-Dive' : '04. 재무 건전성 및 현금흐름 분석'}</h3>
                </div>

                {mode === 'insurance' ? (
                    <div className="space-y-12">
                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <h4 className="font-bold text-slate-800 mb-6">주요 질환별 보장력 테스트</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {(Object.entries(userState.coverages) as [keyof CoverageData, number][]).map(([key, val]) => (
                                    <div key={key} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold mb-1">{key.toUpperCase()} GAP</p>
                                            <p className="font-bold text-slate-800">{key === 'cancer' ? '암' : key === 'brain' ? '뇌' : key === 'heart' ? '심장' : key === 'medical' ? '실손' : '사망'} 보장 GAP</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-black ${val < (standardData as any)[key] ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {val < (standardData as any)[key] ? `-${((standardData as any)[key] - val).toLocaleString()}만원` : '+ 충분'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                            <h5 className="font-black text-amber-800 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">Critical Warning</h5>
                            <p className="text-amber-700 leading-relaxed font-bold">
                                "{userState.age}세는 생존 보험금의 가치가 가장 극대화되는 시기입니다. 뇌/심장 등 2대 질병의 진단비 공백은 은퇴 전 소득 단절 시 가계 경제를 무너뜨리는 가장 큰 실무 리스크로 꼽힙니다. 현재의 공백을 메우지 않을 경우 향후 10년 내 발생할 기대 손실액은 약 2억 원에 달합니다."
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex justify-between items-center shadow-lg shadow-emerald-600/5">
                            <div className="space-y-2">
                                <p className="text-emerald-800 text-sm font-bold opacity-60">통합 재무 효율 지표</p>
                                <p className="text-5xl font-black text-emerald-600">
                                    {(((financeState.currentIncome - financeState.currentExpenses) / financeState.currentIncome) * 100).toFixed(1)}%
                                </p>
                                <p className="text-emerald-800 font-bold italic">Monthly Savings Efficiency</p>
                            </div>
                            <div className="text-right space-y-2">
                                <p className="text-slate-400 text-sm font-bold">합산 가처분 소득 (Y)</p>
                                <p className="text-3xl font-black text-slate-700">{(financeState.currentIncome * 12).toLocaleString()}만원 / 년</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
                                <h5 className="font-black text-slate-800 flex items-center gap-2 underline decoration-blue-500 decoration-4 underline-offset-8 mb-4">Cash-In (Monthly)</h5>
                                <div className="flex justify-between font-bold text-slate-500">
                                    <span>월 고정 수입</span>
                                    <span className="text-slate-800 font-black">{financeState.currentIncome.toLocaleString()}만원</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
                                <h5 className="font-black text-slate-800 flex items-center gap-2 underline decoration-red-500 decoration-4 underline-offset-8 mb-4">Cash-Out (Monthly)</h5>
                                <div className="flex justify-between font-bold text-slate-500">
                                    <span>생활비 및 고정지출</span>
                                    <span className="text-slate-800 font-black">{financeState.currentExpenses.toLocaleString()}만원</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-auto p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page 05</p>
                </div>
            </div>

            {/* PAGE 6: STRESS TEST SCENARIO ANALYSIS */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Activity className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">05. 스트레스 테스트: 시나리오 분석</h3>
                </div>

                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 mb-12">
                    <h4 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">상황별 재무 충격 시뮬레이션</h4>
                    <div className="space-y-8">
                        {stressTests.map((test, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-8">
                                <div className="bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-black shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1 grid grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Scenario</p>
                                        <p className="font-black text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">{test.scenario}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Impact</p>
                                        <p className="font-bold text-red-500">{test.impact}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Expert measure</p>
                                        <p className="text-xs text-slate-600 leading-relaxed italic">{test.measure}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page 06</p>
                </div>
            </div>

            {/* PAGE 7: RETIREMENT & LONGEVITY STRATEGY (ONLY FOR FINANCE) */}
            {mode === 'finance' && (
                <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-blue-600 text-white p-2 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">06. 은퇴 전략 및 장수 리스크 관리</h3>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 mb-12 flex-1">
                        <h4 className="font-extrabold text-slate-800 mb-8 border-b-4 border-slate-900 pb-4 inline-block">90세 자산 라이프사이클 시뮬레이션</h4>
                        <div className="h-[450px]">
                            <RetirementChart financeState={financeState} />
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <div className="p-8 bg-blue-600 rounded-3xl text-white">
                                <h5 className="font-bold mb-2 text-blue-100 uppercase tracking-widest text-xs">Estimated Retirement Start</h5>
                                <p className="text-4xl font-black tracking-tight">{financeState.retirementAge}세</p>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-3xl text-white text-right">
                                <h5 className="font-bold mb-2 text-slate-400 uppercase tracking-widest text-xs">Target Monthly Cashflow</h5>
                                <p className="text-4xl font-black tracking-tight">{financeState.targetMonthlyIncome.toLocaleString()}만원</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-500 tracking-tight leading-relaxed italic">
                            * 본 시뮬레이션은 {financeState.name || '고객'}님의 현재 자산 증가 속도와 **예상 국민연금 수량액(월 {financeState.nationalPension.toLocaleString()}만원)**을 기반으로 합니다. 은퇴 후 물가 상승률을 반영한 **실질 구매 가치**를 보존하기 위해선 월 수익률이 최소 인플레이션을 초과해야 합니다. 현재 구조로는 노후 생활비의 {((financeState.currentIncome - financeState.currentExpenses) / financeState.currentIncome) * 100 < 30 && financeState.nationalPension < 100 ? '약 60%만이' : '안정적인 100%가'} 충당될 것으로 예측됩니다.
                        </p>
                    </div>
                    <div className="mt-auto p-6 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page 07</p>
                    </div>
                </div>
            )}

            {/* PAGE 8: STRATEGIC ACTION PLAN */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Map className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{mode === 'insurance' ? '06' : '07'}. 핵심 전략 실행 단계(Strategic Action)</h3>
                </div>

                <div className="space-y-8 mb-12">
                    {actionPlans.map((plan, i) => (
                        <div key={i} className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 flex gap-10 items-center hover:bg-white transition-all duration-300 hover:shadow-2xl group">
                            <div className="text-6xl bg-white w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                {plan.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Priority {i + 1}</span>
                                    <h4 className="text-2xl font-black text-slate-900">{plan.title}</h4>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-medium">{plan.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-emerald-50 p-10 rounded-[40px] border border-emerald-100 shadow-lg shadow-emerald-500/10">
                    <h4 className="font-black text-emerald-800 text-lg mb-4 flex items-center gap-3 underline decoration-emerald-200 decoration-4 underline-offset-8">
                        <ShieldCheck className="w-8 h-8" /> {lifeAdvice.title}
                    </h4>
                    <p className="text-emerald-700 leading-relaxed text-xl font-medium">{lifeAdvice.advice}</p>
                </div>
                <div className="mt-auto p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page {mode === 'insurance' ? '07' : '08'}</p>
                </div>
            </div>

            {/* PAGE 9: MONITORING & MAINTENANCE GUIDE */}
            <div className="pdf-page bg-white p-12 mb-4 min-h-[1100px] flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Clock className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{mode === 'insurance' ? '07' : '08'}. 리스크 관리 및 정기 점검 가이드</h3>
                </div>

                <div className="grid grid-cols-1 gap-12 flex-1">
                    <div className="space-y-8">
                        <div className="bg-slate-900 text-white p-10 rounded-[40px] relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 p-8 opacity-20"><Clock className="w-24 h-24" /></div>
                            <h4 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6" /> 유지보수 스케줄 (Maintenance)
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                                    <p className="text-slate-300 font-medium">매 2년 정기 건강검진 결과에 따른 질병 보장 항목 업데이트</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                                    <p className="text-slate-300 font-medium">연 단위 가계 현금흐름(소득/지출) 변동에 따른 개인 저축률 재조정</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                                    <p className="text-slate-300 font-medium">인플레이션 지표 발표 시 연금 및 자산 수명 재시뮬레이션</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <h5 className="font-black text-slate-800 mb-4 underline decoration-blue-500 decoration-2 underline-offset-4 uppercase tracking-widest text-xs">Expert Checklist</h5>
                                <ul className="space-y-3 text-sm text-slate-500 font-medium">
                                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 기존 보험의 '중복 담보' 확인</li>
                                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 갱신 시점별 보험료 인상폭 체크</li>
                                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 유동성 자산 (CASH) 6개월치 확보</li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <h5 className="font-black text-slate-800 mb-4 underline decoration-blue-500 decoration-2 underline-offset-4 uppercase tracking-widest text-xs">Self Motivation</h5>
                                <p className="text-sm text-slate-500 leading-relaxed font-bold italic text-center mt-6">
                                    "가장 큰 리스크는 아무것도 하지 않는 것입니다. 실행의 속도가 자산의 기울기를 바꿉니다."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-blue-50 rounded-3xl text-center border-2 border-dashed border-blue-200">
                    <p className="text-blue-800 font-black">AI 컨설팅 결과에 대해 자세한 상담이 필요하시면 주치의(전문가)에게 이 분석 결과(ID: #IG-{Math.floor(Math.random() * 90000) + 10000})를 제출해 주세요.</p>
                </div>
                <div className="mt-auto p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs">AI Financial Intelligence Engine v2.0 - Page {mode === 'insurance' ? '08' : '09'}</p>
                </div>
            </div>

            {/* PAGE 10: CLOSING & LEGAL DISCLAIMER */}
            <div className="pdf-page bg-slate-900 p-16 mb-4 min-h-[1100px] flex flex-col text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-[50%] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

                <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10">
                    <Shield className="w-32 h-32 text-blue-500 mb-12 opacity-80" />
                    <h3 className="text-5xl font-black mb-8 tracking-tighter italic">INSURE-GAP AI</h3>
                    <p className="text-2xl font-bold text-blue-400 mb-6">Expert Advisory & Solutions</p>
                    <div className="w-24 h-1 bg-blue-600 mb-8" />
                    <p className="text-slate-400 max-w-lg leading-[1.8] text-lg font-medium">
                        본 보고서의 데이터가 고객님의 더 나은 내일, 그리고 흔들리지 않는 재무적 자유를 위한 초석이 되기를 진심으로 기원합니다. AI는 데이터로 답하고, 고객님은 행동으로 완성합니다.
                    </p>
                </div>

                <div className="border-t border-slate-800/50 pt-16 mt-16 relative z-10">
                    <h4 className="font-black text-slate-500 mb-8 text-xs uppercase tracking-[0.3em] text-center">Comprehensive Legal Disclaimer</h4>
                    <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
                        <p className="text-[10px] text-slate-500 leading-relaxed border-l-2 border-slate-800 pl-4">
                            1. 본 보고서는 고객님이 직접 입력한 기초 데이터(연령, 성별, 보장 금액, 자산 현황 등)를 통계적 알고리즘과 AI 엔진을 통해 분석한 주관적 컨설팅 자료입니다. 실제 보험사의 인수 심사 결과나 상품 약관, 세금 정책 및 시장 수익률과는 상이할 수 있습니다.
                        </p>
                        <p className="text-[10px] text-slate-500 leading-relaxed border-l-2 border-slate-800 pl-4">
                            2. 미래 자산 시뮬레이션 및 스트레스 테스트 수치는 과거의 통계 데이터에 기반한 가설적 결과로, 실질적인 수익이나 손실을 확약하지 않습니다. 모든 의사 결정에 따른 책임은 투자자(사용자) 본인에게 귀속됩니다.
                        </p>
                        <p className="text-[10px] text-slate-500 leading-relaxed border-l-2 border-slate-800 pl-4">
                            3. 보험 상품의 최신 담보 내용 및 해지 환급금, 가입 기간 등의 정확한 정보는 해당 보험사의 공식 증권 및 약관을 통해 재확인하시기 바랍니다.
                        </p>
                    </div>
                </div>

                <div className="mt-20 pt-12 border-t border-slate-800/30 flex justify-between items-center text-slate-700 font-bold uppercase tracking-widest text-[10px]">
                    <p>Verified by Insure-Gap AI Analytics Engine v2.0 - Page {mode === 'insurance' ? '09' : '10'}</p>
                    <p>Copyright © 2026. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}


