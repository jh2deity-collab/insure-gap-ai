"use client"

import { FinanceState } from "@/types"
import { Sparkles, AlertTriangle, CheckCircle, Target } from "lucide-react"

interface FinanceAIAnalysisProps {
    financeState: FinanceState;
}

export default function FinanceAIAnalysis({ financeState }: FinanceAIAnalysisProps) {
    const { age, retirementAge, currentIncome, currentExpenses, assets } = financeState;
    const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
    const annualExpenses = currentExpenses * 12;
    const annualSavings = (currentIncome - currentExpenses) * 12;

    // 1. Calculate Financial Freedom Year (Simple 4% Rule: 25x Annual Expenses)
    const targetNetWorth = annualExpenses * 25;
    const investmentRate = 0.05;
    let predictedNetWorth = totalAssets;
    let freedomAge = age;
    let reached = false;

    // Projection loop
    for (let i = 0; i < 100 - age; i++) {
        if (predictedNetWorth >= targetNetWorth) {
            reached = true;
            break;
        }
        predictedNetWorth = predictedNetWorth * (1 + investmentRate) + annualSavings;
        freedomAge++;
    }

    // 2. Asset Allocation Analysis
    const total = totalAssets || 1; // Prevent div by zero
    const ratios = {
        cash: (assets.cash / total) * 100,
        stock: (assets.stock / total) * 100,
        realEstate: (assets.realEstate / total) * 100,
        crypto: (assets.crypto / total) * 100
    };

    let allocationAdvice = "";
    if (ratios.cash > 50) {
        allocationAdvice = "현금 비중이 매우 높습니다. 인플레이션 방어를 위해 투자 자산(주식, 부동산 등) 비중을 늘리는 것을 고려해보세요.";
    } else if (ratios.crypto > 20) {
        allocationAdvice = "변동성이 큰 자산(암호화폐 등) 비중이 높습니다. 포트폴리오 안정성을 위해 분산 투자가 필요합니다.";
    } else if (ratios.shares > 70) { // Assuming 'stock' maps to aggressive
        allocationAdvice = "공격적인 투자 성향을 보이고 계십니다. 은퇴가 가까워질수록 채권 등 안전 자산 비중을 늘려 리스크를 관리하세요.";
    } else {
        allocationAdvice = "비교적 균형 잡힌 자산 배분을 유지하고 계십니다. 정기적인 리밸런싱을 통해 목표 수익률을 점검하세요.";
    }

    // 3. Savings Rate Analysis
    const savingsRate = (annualSavings / (currentIncome * 12)) * 100;
    let savingsAdvice = "";
    if (savingsRate < 10) {
        savingsAdvice = "저축률이 10% 미만입니다. 불필요한 지출을 줄여 초기 종잣돈(Seed Money)을 모으는 것이 급선무입니다.";
    } else if (savingsRate > 50) {
        savingsAdvice = "훌륭합니다! 소득의 절반 이상을 저축/투자하고 계시네요. 경제적 자유에 빠르게 도달할 수 있습니다.";
    } else {
        savingsAdvice = "적절한 저축 습관을 가지고 계십니다. 소득 증가분에 대해서는 저축 비율을 더 높여보세요.";
    }


    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-6 animate-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" /> AI 재무 심층 분석 리포트
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Metric 1: Financial Freedom */}
                <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-500" /> 경제적 자유 달성 예상
                    </h4>
                    {reached ? (
                        <div>
                            <span className="text-3xl font-bold text-emerald-400">{freedomAge}세</span>
                            <p className="text-slate-500 text-xs mt-1">
                                (목표 순자산: {(targetNetWorth / 10000).toFixed(1)}억원)
                            </p>
                        </div>
                    ) : (
                        <div>
                            <span className="text-2xl font-bold text-slate-500">도달 어려움</span>
                            <p className="text-slate-500 text-xs mt-1">저축액을 늘리거나 투자 수익률 제고 필요</p>
                        </div>
                    )}
                </div>

                {/* Metric 2: Savings Rate */}
                <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" /> 현재 저축/투자 여력
                    </h4>
                    <div>
                        <span className="text-3xl font-bold text-blue-400">{savingsRate.toFixed(1)}%</span>
                        <p className="text-slate-500 text-xs mt-1">월 {((annualSavings / 12)).toLocaleString()}만원 적립 중</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h5 className="font-bold text-amber-400 mb-2 text-sm">💡 자산 배분 조언</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">{allocationAdvice}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-400 mb-2 text-sm">💰 현금 흐름 & 저축 조언</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">{savingsAdvice}</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                <p className="text-slate-400 text-sm">
                    "고객님은 <span className="text-white font-bold">{freedomAge < retirementAge ? '조기 은퇴가 가능한' : '은퇴 준비가 필요한'}</span>
                    재무 상태입니다. 전문 컨설턴트와의 상담을 통해 구체적인 실행 계획을 수립해보세요."
                </p>
            </div>
        </div>
    )
}
