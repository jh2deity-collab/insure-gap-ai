"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts"
import { CoverageData } from "@/types"

interface RadarVisProps {
    userData: CoverageData;
    standardData: CoverageData;
}

export default function RadarVis({ userData, standardData }: RadarVisProps) {
    const data = [
        { subject: '암 진단비', A: userData.cancer, B: standardData.cancer, fullMark: 10000 },
        { subject: '뇌혈관', A: userData.brain, B: standardData.brain, fullMark: 10000 },
        { subject: '심혈관', A: userData.heart, B: standardData.heart, fullMark: 10000 },
        { subject: '실손 의료비', A: userData.medical, B: standardData.medical, fullMark: 10000 },
        { subject: '사망 보험금', A: userData.death, B: standardData.death, fullMark: 50000 },
    ];

    return (
        <div className="w-full h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />

                    <Radar
                        name="내 보장 (My Coverage)"
                        dataKey="A"
                        stroke="#0066FF"
                        strokeWidth={3}
                        fill="#0066FF"
                        fillOpacity={0.3}
                    />
                    <Radar
                        name="권장 보장 (Standard)"
                        dataKey="B"
                        stroke="#64748b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="#64748b"
                        fillOpacity={0.1}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number | any) => {
                            if (value === undefined || value === null) return '0만';
                            return `₩${(Number(value) / 10000).toFixed(0)}만`;
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
