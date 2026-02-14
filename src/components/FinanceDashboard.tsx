"use client"

import Image from "next/image"
import { useState } from "react"
import { FinanceState } from "@/types"
import FinanceInput from "@/components/FinanceInput"
import AssetPieChart from "@/components/AssetPieChart"
import RetirementChart from "@/components/RetirementChart"
import FinanceAIAnalysis from "@/components/FinanceAIAnalysis"
import OnboardingGuide from "@/components/OnboardingGuide"
import { TrendingUp, PieChart as PieIcon, Activity } from "lucide-react"

interface FinanceDashboardProps {
    financeState: FinanceState;
    onStateChange: (key: string, value: string | number | { key: string; value: number }) => void;
}

export default function FinanceDashboard({ financeState, onStateChange }: FinanceDashboardProps) {
    // Local state removed, using props

    // Calculate Total Assets
    const manualAssetsValue = Object.entries(financeState.assets)
        .filter(([key, value]) => typeof value === 'number')
        .reduce((sum, [_, value]) => sum + (value as number), 0);
    const trackedStockValue = financeState.assets.trackedStocks?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const trackedCryptoValue = financeState.assets.trackedCrypto?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const totalAssets = manualAssetsValue + trackedStockValue + trackedCryptoValue;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <OnboardingGuide />
            {/* Left: Input */}
            <div className="lg:col-span-5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> 자산 데이터 입력
                </h3>
                <FinanceInput financeState={financeState} onChange={onStateChange} />
            </div>

            {/* Right: Charts */}
            <div className="lg:col-span-7 space-y-6">

                {/* 1. Asset Overview Card */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-blue-500" /> 자산 포트폴리오
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 w-full">
                            <AssetPieChart assets={financeState.assets} />
                        </div>
                        <div className="min-w-[180px] bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                            <p className="text-slate-400 text-sm mb-1">총 순자산</p>
                            <p className="text-3xl font-bold text-white tracking-tight">
                                {(totalAssets / 10000).toFixed(1)}
                                <span className="text-base font-normal text-slate-500 ml-1">억원</span>
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-emerald-400 text-sm font-bold">
                                    + 월 {(financeState.currentIncome - financeState.currentExpenses).toLocaleString()}만원
                                </p>
                                <p className="text-slate-500 text-xs">순저축 가능액</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Projection Card */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-500" /> 은퇴 자산 시뮬레이션 (90세까지)
                    </h3>
                    <RetirementChart financeState={financeState} />
                    <p className="text-center text-slate-500 text-sm mt-4">
                        * 연 수익률 5%, 물가상승률 3%를 반영한 <strong>현재 가치 기준</strong> 시뮬레이션입니다.
                    </p>
                </div>

                {/* 3. AI Analysis Report */}
                <FinanceAIAnalysis financeState={financeState} />


            </div>
        </div>
    )
}
