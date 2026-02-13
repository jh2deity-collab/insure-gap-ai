"use client"

import { Label } from "@/components/ui/label"
import { FinanceState } from "@/types"
import { DollarSign, Briefcase, TrendingUp } from "lucide-react"

interface FinanceInputProps {
    financeState: FinanceState;
    onChange: (key: string, value: any) => void;
}

export default function FinanceInput({ financeState, onChange }: FinanceInputProps) {

    const assetInputs = [
        { key: 'cash', label: '현금/예금 (Cash)', step: 100 },
        { key: 'stock', label: '주식/펀드 (Stock)', step: 100 },
        { key: 'realEstate', label: '부동산 (Real Estate)', step: 1000 },
        { key: 'crypto', label: '암호화폐/기타', step: 100 },
    ]

    return (
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-full">

            {/* 1. Basic Info */}
            <div>
                <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> 기본 정보
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-slate-400 mb-2 block">현재 나이</Label>
                        <input
                            type="number"
                            value={financeState.age}
                            onChange={(e) => onChange('age', parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-400 mb-2 block">은퇴 목표 나이</Label>
                        <input
                            type="number"
                            value={financeState.retirementAge}
                            onChange={(e) => onChange('retirementAge', parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-700/50 my-4" />

            {/* 2. Income & Expenses */}
            <div>
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> 수입 및 지출 (월평균)
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <Label className="text-slate-300">월 수입 (세후)</Label>
                            <span className="text-emerald-400 font-mono font-bold">{financeState.currentIncome.toLocaleString()} 만원</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3000"
                            step="10"
                            value={financeState.currentIncome}
                            onChange={(e) => onChange('currentIncome', parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <Label className="text-slate-300">월 지출 (생활비)</Label>
                            <span className="text-red-400 font-mono font-bold">{financeState.currentExpenses.toLocaleString()} 만원</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3000"
                            step="10"
                            value={financeState.currentExpenses}
                            onChange={(e) => onChange('currentExpenses', parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-700/50 my-4" />

            {/* 3. Assets */}
            <div>
                <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> 보유 자산 (순자산)
                </h3>
                <div className="space-y-4">
                    {assetInputs.map(item => (
                        <div key={item.key}>
                            <div className="flex justify-between mb-2">
                                <Label className="text-slate-300">{item.label}</Label>
                                <span className="text-amber-400 font-mono font-bold">
                                    {financeState.assets[item.key as keyof typeof financeState.assets].toLocaleString()}
                                    <span className="text-slate-500 text-xs ml-1">만원</span>
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={item.key === 'realEstate' ? 500000 : 100000}
                                step={item.step}
                                value={financeState.assets[item.key as keyof typeof financeState.assets]}
                                onChange={(e) => onChange('assets', { key: item.key, value: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
