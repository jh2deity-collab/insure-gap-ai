"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { FinanceAssets } from "@/types"

interface AssetPieChartProps {
    assets: FinanceAssets;
}

export default function AssetPieChart({ assets }: AssetPieChartProps) {
    const data = [
        { name: '현금', value: assets.cash, color: '#10B981' }, // Emerald
        { name: '주식', value: assets.stock, color: '#3B82F6' }, // Blue
        { name: '부동산', value: assets.realEstate, color: '#F59E0B' }, // Amber
        { name: '기타', value: assets.crypto, color: '#8B5CF6' }, // Violet
    ].filter(item => item.value > 0);

    const total = Object.values(assets).reduce((a, b) => a + b, 0);

    if (total === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
                자산 데이터를 입력해주세요.
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
                        formatter={(value: number) => `${value.toLocaleString()} 만원`}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
