"use client"

import { useMemo } from "react"
import { FinanceState } from "@/types"
import { Wallet, TrendingUp, PiggyBank, Target, RefreshCw, ShieldCheck } from "lucide-react"

interface FinanceSummaryHeaderProps {
    financeState: FinanceState;
    onMyDataConnect: () => void;
}

export default function FinanceSummaryHeader({ financeState, onMyDataConnect }: FinanceSummaryHeaderProps) {
    // 1. Total Net Worth
    const manualAssetsValue = useMemo(() => Object.entries(financeState.assets)
        .filter(([key, value]) => typeof value === 'number')
        .reduce((sum, [_, value]) => sum + (value as number), 0), [financeState.assets]);

    const trackedStockValue = useMemo(() => financeState.assets.trackedStocks?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0, [financeState.assets.trackedStocks]);
    const trackedCryptoValue = useMemo(() => financeState.assets.trackedCrypto?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0, [financeState.assets.trackedCrypto]);

    const totalAssets = manualAssetsValue + trackedStockValue + trackedCryptoValue;

    // 2. Monthly Free Cash Flow
    const monthlyCashFlow = financeState.currentIncome - financeState.currentExpenses;

    // 3. Retirement Goal Progress (Simple Calculation: Current Assets / Target (Assume 10億 for now or calculate based on monthly income needs))
    // Let's assume target is retiring with enough to sustain current expenses * 12 / 0.04 (4% rule)
    // Rule of thumb: Annual Expenses / 0.04 = Target Corpus
    // If expenses = 250, annual = 3000. Target = 3000 / 0.04 = 75000 (7.5억)
    const targetCorpus = useMemo(() => {
        if (financeState.currentExpenses === 0) return 100000; // Default 10억
        return (financeState.currentExpenses * 12) / 0.04;
    }, [financeState.currentExpenses]);

    const progress = Math.min(100, Math.round((totalAssets / targetCorpus) * 100));


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Net Worth */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-slate-400 font-medium text-sm">총 순자산 (Net Worth)</span>
                </div>
                <div className="mt-2">
                    <span className="text-3xl font-bold text-white tracking-tight">
                        {(totalAssets / 10000).toFixed(1)}
                    </span>
                    <span className="text-lg text-slate-500 ml-1 font-medium">억원</span>
                </div>
                <div className="mt-2 flex justify-between items-end">
                    <div className="text-xs text-emerald-400 font-medium">
                        상위 N% (준비중)
                    </div>

                    {/* MyData Controls */}
                    <div className="flex flex-col items-end gap-2">
                        {financeState.myData?.isConnected ? (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400/60 font-bold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                연동됨
                            </div>
                        ) : (
                            <button
                                onClick={onMyDataConnect}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-[10px] font-bold transition-all"
                            >
                                <RefreshCw className="w-2.5 h-2.5" />
                                MyData 연동
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Card 2: Monthly Cash Flow */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PiggyBank className="w-16 h-16 text-blue-500" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Wallet className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-slate-400 font-medium text-sm">월 여유자금 (Cash Flow)</span>
                </div>
                <div className="mt-2">
                    <span className={`text-3xl font-bold tracking-tight ${monthlyCashFlow >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {monthlyCashFlow.toLocaleString()}
                    </span>
                    <span className="text-lg text-slate-500 ml-1 font-medium">만원</span>
                </div>
                <div className="mt-2 text-xs text-blue-400 font-medium">
                    저축 가능률 {financeState.currentIncome > 0 ? Math.round((monthlyCashFlow / financeState.currentIncome) * 100) : 0}%
                </div>
            </div>

            {/* Card 3: Retirement Progress */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-16 h-16 text-amber-500" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Target className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-slate-400 font-medium text-sm">은퇴 준비율 (FI Ratio)</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white tracking-tight">
                        {progress}%
                    </span>
                    <span className="text-xs text-slate-500">
                        / 목표 {(targetCorpus / 10000).toFixed(1)}억
                    </span>
                </div>
                <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
