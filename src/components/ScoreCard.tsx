"use client"

import { useEffect, useState } from "react"

interface ScoreCardProps {
    score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
    const getStatus = (s: number) => {
        if (s >= 80) return { color: "text-emerald-400", bg: "bg-emerald-500", label: "안전 (Safe)", desc: "보장 상태가 매우 우수합니다." };
        if (s >= 50) return { color: "text-amber-400", bg: "bg-amber-500", label: "주의 (Warning)", desc: "일부 주요 보장이 부족합니다." };
        return { color: "text-red-500", bg: "bg-red-500", label: "위험 (Danger)", desc: "심각한 보장 공백이 발견되었습니다." };
    }

    const status = getStatus(score);
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = score;
        const duration = 1000;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayScore(end);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [score]);

    return (
        <div className="w-full bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Score Display */}
            <div className="flex flex-col items-center md:items-start min-w-[200px]">
                <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-1">My Safety Score</h2>
                <div className="relative flex items-baseline">
                    <span className={`text-6xl md:text-7xl font-bold tracking-tighter ${status.color}`}>
                        {displayScore}
                    </span>
                    <span className="text-xl md:text-2xl text-slate-600 font-light ml-2">/100</span>

                    {/* Glow */}
                    <div className={`absolute inset-0 blur-3xl opacity-20 ${status.bg}`} />
                </div>
            </div>

            {/* Middle: Divider (Hidden on mobile) */}
            <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

            {/* Right: Status & Description */}
            <div className="flex-1 text-center md:text-left">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${status.bg} bg-opacity-10 ${status.color} border border-current border-opacity-20`}>
                    {status.label}
                </div>
                <p className="text-slate-200 text-lg md:text-xl font-medium mb-2">
                    "{status.desc}"
                </p>

                {/* Simple Progress Bar Visual */}
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden mt-2">
                    <div
                        style={{ width: `${score}%` }}
                        className={`h-full ${status.bg} transition-all duration-1000 ease-out`}
                    />
                </div>
            </div>
        </div>
    )
}
