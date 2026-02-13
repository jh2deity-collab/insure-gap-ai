"use client"

import { Shield, TrendingUp, ChevronRight } from "lucide-react"

interface LandingSelectorProps {
    onSelect: (mode: 'insurance' | 'finance') => void;
}

export default function LandingSelector({ onSelect }: LandingSelectorProps) {
    return (
        <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        INSURE-GAP <span className="text-blue-500">AI</span>
                    </h1>
                    <p className="text-slate-400 text-lg">최적의 금융 솔루션을 위한 업무 모드를 선택하세요.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Insurance Card */}
                    <button
                        onClick={() => onSelect('insurance')}
                        className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-3xl p-10 text-left transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,102,255,0.15)] flex flex-col h-[400px]"
                    >
                        <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">보장 분석<br />(Insurance)</h2>
                        <p className="text-slate-400 text-lg mb-auto">
                            고객의 보험 가입 내역을 분석하여<br />
                            보장 공백을 시각화하고 설계를 제안합니다.
                        </p>
                        <div className="flex items-center text-blue-400 font-bold mt-8 group-hover:translate-x-2 transition-transform">
                            시작하기 <ChevronRight className="w-5 h-5 ml-2" />
                        </div>

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Finance Card */}
                    <button
                        onClick={() => onSelect('finance')}
                        className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-3xl p-10 text-left transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col h-[400px]"
                    >
                        <div className="w-16 h-16 bg-emerald-600/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">재무 설계<br />(Finance)</h2>
                        <p className="text-slate-400 text-lg mb-auto">
                            은퇴 자금, 투자 포트폴리오를 분석하여<br />
                            맞춤형 자산 관리 솔루션을 제공합니다.
                        </p>
                        <div className="flex items-center text-emerald-400 font-bold mt-8 group-hover:translate-x-2 transition-transform">
                            시작하기 <ChevronRight className="w-5 h-5 ml-2" />
                        </div>

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>

                <p className="text-center text-slate-600 mt-16 text-sm">
                    Powered by Antigravity AI Engine
                </p>
            </div>
        </div>
    )
}
