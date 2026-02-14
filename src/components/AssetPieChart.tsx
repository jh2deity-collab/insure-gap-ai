"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { FinanceAssets } from "@/types"

interface AssetPieChartProps {
    assets: FinanceAssets;
}

export default function AssetPieChart({ assets }: AssetPieChartProps) {
    const trackedStockValue = assets.trackedStocks?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;
    const trackedCryptoValue = assets.trackedCrypto?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0;

    const data = [
        { name: '현금', value: assets.cash, color: '#10B981' },
        { name: '주식', value: assets.stock + trackedStockValue, color: '#3B82F6' },
        { name: '부동산', value: assets.realEstate, color: '#F59E0B' },
        { name: '연금/보험', value: assets.pension + assets.insurance, color: '#6366F1' },
        { name: '가상화폐', value: assets.crypto + trackedCryptoValue, color: '#8B5CF6' },
    ].filter(item => item.value > 0);

    const manualTotal = Object.entries(assets)
        .filter(([key, value]) => typeof value === 'number')
        .reduce((sum, [_, value]) => sum + (value as number), 0);
    const total = manualTotal + trackedStockValue + trackedCryptoValue;

    if (total === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-slate-500 text-sm">
                자산 데이터를 입력하거나 실시간 자산을 추가해주세요.
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        formatter={(value: number | any) => {
                            if (value === undefined || value === null) return '0원';
                            return `${Number(value).toLocaleString()} 만원`;
                        }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
