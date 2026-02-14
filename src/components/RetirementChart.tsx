"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts"
import { FinanceState } from "@/types"

import { memo } from "react" // Added

interface RetirementChartProps {
    financeState: FinanceState;
}

function RetirementChart({ financeState }: RetirementChartProps) {
    // Simple Projection Logic
    // Current Net Worth
    const manualAssetsValue = Object.entries(financeState.assets)
        .filter(([key, value]) => typeof value === 'number')
        .reduce((sum, [_, value]) => sum + (value as number), 0);
    const trackedStockValue = financeState.assets.trackedStocks?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const trackedCryptoValue = financeState.assets.trackedCrypto?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const currentNetWorth = manualAssetsValue + trackedStockValue + trackedCryptoValue;

    // Sort events by age
    const events = financeState.lifeEvents ? [...financeState.lifeEvents].sort((a, b) => a.age - b.age) : [];

    const annualSavings = (financeState.currentIncome - financeState.currentExpenses) * 12;
    const investmentRate = 0.05; // 5% expected return
    const inflationRate = 0.03;  // 3% expected inflation
    const realRate = (1 + investmentRate) / (1 + inflationRate) - 1;

    const data = [];
    let netWorth = currentNetWorth;
    const endAge = 90;

    // For ReferenceLines/Dots
    const chartEvents: { age: string; id: string; name: string; cost: number }[] = [];

    for (let age = financeState.age; age <= endAge; age++) {
        const isRetired = age >= financeState.retirementAge;

        // Check for events at this age
        const ageEvents = events.filter(e => e.age === age);
        let eventCost = 0;
        let eventNames: string[] = [];

        ageEvents.forEach(e => {
            eventCost += e.cost || 0;
            eventNames.push(e.name);
            chartEvents.push({ age: `${age}세`, id: e.id, name: e.name, cost: e.cost });
        });

        // 은퇴 후에는 수입이 없고 지출만 발생하지만, 국민연금 수령액이 현금 흐름으로 추가됨
        // 만약 월 추가 비용(monthlyCost)이 있는 이벤트가 있다면 여기서 처리해야 함 (duration 고려)
        // 현재는 단순화를 위해 일회성 비용(cost)만 처리

        const yearlyFlow = isRetired
            ? -(financeState.currentExpenses * 12) + (financeState.nationalPension * 12)
            : annualSavings;

        // Use real rate of return to show purchasing power in today's terms
        // Apply Event Cost (Subtract from Net Worth)
        netWorth = netWorth * (1 + realRate) + yearlyFlow - eventCost;

        if (age % 5 === 0 || age === financeState.age || age === financeState.retirementAge || ageEvents.length > 0) {
            data.push({
                age: `${age}세`,
                rawAge: age,
                netWorth: Math.round(netWorth),
                event: eventNames.length > 0 ? eventNames.join(', ') : null,
                goal: 0
            });
        }
    }

    // Sort data by age to ensure chart lines are correct even if we inserted event years out of order (though we loop sequentially so it is fine)
    data.sort((a, b) => a.rawAge - b.rawAge);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}억`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#10B981' }}
                        formatter={(value: any, name: any, props: any) => {
                            if (name === 'event') return [value, '이벤트'];
                            if (value === undefined || value === null) return ['0원', '예상 순자산'];
                            return [`${(Number(value) / 10000).toFixed(2)}억원`, '예상 순자산'];
                        }}
                        labelFormatter={(label, payload) => {
                            const event = payload[0]?.payload?.event;
                            if (event) return `${label} (${event})`;
                            return label;
                        }}
                    />
                    <ReferenceLine x={`${financeState.retirementAge}세`} stroke="#F59E0B" strokeDasharray="3 3" label={{ position: 'top', value: '은퇴', fill: '#F59E0B', fontSize: 12 }} />

                    {/* Event Markers */}
                    {chartEvents.map((e, idx) => (
                        <ReferenceLine
                            key={e.id}
                            x={`${e.age}세`}
                            stroke="#3B82F6"
                            strokeDasharray="2 2"
                            label={{ position: 'insideTop', value: e.name, fill: '#60A5FA', fontSize: 10, offset: 10 + (idx * 15) }}
                        />
                    ))}

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

export default memo(RetirementChart)
