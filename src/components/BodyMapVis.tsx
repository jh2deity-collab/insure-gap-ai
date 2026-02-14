"use client"

import { useMemo } from "react"
import { CoverageData } from "@/types"

interface BodyMapVisProps {
    coverages: CoverageData;
    standard: CoverageData;
}

export default function BodyMapVis({ coverages, standard }: BodyMapVisProps) {
    // Calculate Protection Percentages (0 to 1)
    const stats = useMemo(() => {
        const calculateRatio = (key: keyof CoverageData) => {
            const current = coverages[key] || 0;
            const target = standard[key] || 1;
            return Math.min(current / target, 1.2); // Cap at 120%
        };

        return {
            brain: calculateRatio('brain'),
            heart: calculateRatio('heart'),
            cancer: calculateRatio('cancer'),
            medical: calculateRatio('medical')
        };
    }, [coverages, standard]);

    // Color interpolation function
    const getColor = (ratio: number) => {
        if (ratio < 0.5) return "#ef4444"; // Red (Severe Gap)
        if (ratio < 0.8) return "#f59e0b"; // Amber (Moderate Gap)
        return "#10b981"; // Green (Strong)
    };

    return (
        <div className="relative w-full aspect-[1/2] max-w-[300px] mx-auto group overflow-hidden bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-sm p-4">
            {/* Background High-tech Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* SVG Human Silhouette (More detailed) */}
            <svg viewBox="0 0 100 200" className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                <defs>
                    <filter id="glow-heavy">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Dynamic Gradients based on stats */}
                    {Object.entries(stats).map(([key, ratio]) => (
                        <radialGradient id={`grad-${key}`} key={key}>
                            <stop offset="0%" stopColor={getColor(ratio)} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={getColor(ratio)} stopOpacity="0" />
                        </radialGradient>
                    ))}

                    {/* Scan Line Gradient */}
                    <linearGradient id="scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Refined Human Path (More anatomical details) */}
                <path
                    d="M50 5 C54 5 57 8 58 13 C58 20 56 26 50 26 C44 26 42 20 42 13 C43 8 46 5 50 5 
                       M42 28 C38 28 32 30 28 38 C24 46 22 65 20 85 C19 95 21 98 25 96 C29 94 32 60 34 50 
                       C35 48 37 48 38 52 C38 70 36 100 34 130 C33 150 35 185 40 195 C43 200 48 200 50 195 
                       C52 200 57 200 60 195 C65 185 67 150 66 130 C64 100 62 70 62 52 C63 48 65 48 66 50 
                       C68 60 71 94 75 96 C79 98 81 95 80 85 C78 65 76 46 72 38 C68 30 62 28 58 28 Z"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                    className="transition-all duration-1000"
                />

                {/* Internal Coverage Fill (Reactive) */}
                <path
                    d="M44 32 C40 32 35 34 32 40 C30 48 28 65 26 85 C25 90 27 92 30 90 C33 88 35 60 37 50 
                       C38 65 36 95 34 125 C33 145 35 175 42 185 C45 190 55 190 58 185 C65 175 67 145 66 125 
                       C64 95 62 65 63 50 C65 60 67 88 70 90 C73 92 75 90 74 85 C72 65 70 48 68 40 C65 34 60 32 56 32 Z"
                    fill={getColor(stats.cancer)}
                    fillOpacity={0.05 + (stats.cancer * 0.15)}
                    className="animate-pulse transition-all duration-1000"
                />

                {/* Scan Line Animation */}
                <rect x="15" y="0" width="70" height="2" fill="url(#scan-grad)" className="animate-scan">
                    <animate attributeName="y" values="0;200;0" dur="4s" repeatCount="indefinite" />
                </rect>

                {/* Interactive Points (Hotspots) */}
                {/* Brain */}
                <g className="cursor-help">
                    <circle cx="50" cy="15" r="7" fill="url(#grad-brain)" className={stats.brain < 0.5 ? "animate-ping" : ""} />
                    <circle cx="50" cy="15" r="3" fill={getColor(stats.brain)} stroke="white" strokeWidth="0.5" />
                </g>

                {/* Heart */}
                <g className="cursor-help">
                    <circle cx="46" cy="45" r="9" fill="url(#grad-heart)" className={stats.heart < 0.5 ? "animate-pulse" : ""} />
                    <path d="M46 42 C43 42 41 44 41 47 C41 50 46 54 46 54 C46 54 51 50 51 47 C51 44 49 42 46 42 Z"
                        fill={getColor(stats.heart)} stroke="white" strokeWidth="0.4" />
                </g>

                {/* Major Joints/Detail Points */}
                <circle cx="34" cy="40" r="1" fill="#38bdf8" fillOpacity="0.5" />
                <circle cx="66" cy="40" r="1" fill="#38bdf8" fillOpacity="0.5" />
                <circle cx="42" cy="125" r="1" fill="#38bdf8" fillOpacity="0.5" />
                <circle cx="58" cy="125" r="1" fill="#38bdf8" fillOpacity="0.5" />

                {/* Labels (Fancy Hover Labels) */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
                    <rect x="65" y="10" width="30" height="10" rx="2" fill="#0f172a/80" stroke="#38bdf8/30" />
                    <text x="80" y="17" textAnchor="middle" fill="#38bdf8" fontSize="3" fontWeight="bold">BRAIN</text>

                    <rect x="5" y="40" width="30" height="10" rx="2" fill="#0f172a/80" stroke="#38bdf8/30" />
                    <text x="20" y="47" textAnchor="middle" fill="#38bdf8" fontSize="3" fontWeight="bold">HEART</text>
                </g>
            </svg>

            {/* High-tech HUD Decor */}
            <div className="absolute top-4 left-4 border-l border-t border-sky-500/50 w-4 h-4" />
            <div className="absolute top-4 right-4 border-r border-t border-sky-500/50 w-4 h-4" />
            <div className="absolute bottom-4 left-4 border-l border-b border-sky-500/50 w-4 h-4" />
            <div className="absolute bottom-4 right-4 border-r border-b border-sky-500/50 w-4 h-4" />

            {/* Strength Indicators (HUD Style) */}
            <div className="absolute top-10 right-4 flex flex-col gap-3 z-20">
                {[
                    { label: 'BRAIN', ratio: stats.brain },
                    { label: 'HEART', ratio: stats.heart },
                    { label: 'CANCER', ratio: stats.cancer }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-end">
                        <span className="text-[8px] text-slate-400 font-bold mb-1">{item.label}</span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full transition-all duration-1000"
                                style={{ width: `${item.ratio * 100}%`, backgroundColor: getColor(item.ratio) }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-2 text-center relative z-20">
                <p className="text-[10px] text-sky-400/70 font-bold tracking-widest uppercase animate-pulse">Internal Body Diagnostic</p>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent mx-auto mt-2" />
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(200px); opacity: 0; }
                }
                .animate-scan {
                    filter: drop-shadow(0 0 5px #38bdf8);
                }
            `}</style>
        </div>
    );
}
