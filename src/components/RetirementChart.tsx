"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { FinanceState } from "@/types"

interface RetirementChartProps {
    financeState: FinanceState;
}

export default function RetirementChart({ financeState }: RetirementChartProps) {
    // Simple Projection Logic
    // Current Net Worth
    const currentNetWorth = Object.values(financeState.assets).reduce((a, b) => a + b, 0);
    const annualSavings = (financeState.currentIncome - financeState.currentExpenses) * 12;
    const investmentRate = 0.05; // 5% expected return
    const inflationRate = 0.03;  // 3% expected inflation
    const realRate = (1 + investmentRate) / (1 + inflationRate) - 1;

    const data = [];
    let netWorth = currentNetWorth;
    const endAge = 90;

    for (let age = financeState.age; age <= endAge; age++) {
        const isRetired = age >= financeState.retirementAge;
        // 은퇴 후에는 수입이 없고 지출만 발생하지만, 국민연금 수령액이 현금 흐름으로 추가됨
        const yearlyFlow = isRetired
            ? -(financeState.currentExpenses * 12) + (financeState.nationalPension * 12)
            : annualSavings;

        // Use real rate of return to show purchasing power in today's terms
        netWorth = netWorth * (1 + realRate) + yearlyFlow;

        if (age % 5 === 0 || age === financeState.age || age === financeState.retirementAge) {
            data.push({
                age: `${age}세`,
                rawAge: age,
                netWorth: Math.round(netWorth),
                goal: 0
            });
        }
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="age" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 10000).toFixed(1)}억`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#10B981' }}
                        formatter={(value: number | any) => {
                            if (value === undefined || value === null) return ['0원', '예상 순자산'];
                            return [`${(Number(value) / 10000).toFixed(2)}억원`, '예상 순자산'];
                        }}
                    />
                    <ReferenceLine x={`${financeState.retirementAge}세`} stroke="#F59E0B" strokeDasharray="3 3" label={{ position: 'top', value: '은퇴', fill: '#F59E0B', fontSize: 12 }} />
                    <Area
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorNetWorth)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
