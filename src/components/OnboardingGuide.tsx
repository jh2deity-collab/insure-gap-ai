"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight, Check } from "lucide-react"

export default function OnboardingGuide() {
    const [isVisible, setIsVisible] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        const hasSeenGuide = localStorage.getItem('hasSeenOnboarding')
        if (!hasSeenGuide) {
            // Delay slightly to let animations finish
            setTimeout(() => setIsVisible(true), 1000)
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('hasSeenOnboarding', 'true')
    }

    const steps = [
        {
            title: "환영합니다! 👋",
            desc: "INSURE-GAP AI는 당신의 보험과 재무 상태를 분석하여 '빈틈(GAP)'을 찾아주는 똑똑한 비서입니다."
        },
        {
            title: "1. 내 데이터 입력 📝",
            desc: "나이, 성별, 그리고 현재 가입된 보험금이나 자산 정보를 입력해보세요. 실시간으로 점수가 변합니다!"
        },
        {
            title: "2. 빈틈 확인하기 🔍",
            desc: "어떤 보장이 부족한지, 내 자산이 은퇴까지 충분한지 차트로 한눈에 확인할 수 있습니다."
        },
        {
            title: "3. 리포트 다운로드 📥",
            desc: "분석된 결과는 PDF 리포트로 평생 소장하세요. 가족과 함께 상의할 때 유용합니다."
        }
    ]

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
                            />
                        ))}
                    </div>
                    <button onClick={handleDismiss} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-[140px]">
                    <h3 className="text-xl font-bold text-white mb-2 ml-1">{steps[step].title}</h3>
                    <p className="text-slate-300 leading-relaxed ml-1">{steps[step].desc}</p>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    {step < steps.length - 1 ? (
                        <>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 text-slate-400 text-sm hover:text-white transition-colors"
                            >
                                건너뛰기
                            </button>
                            <button
                                onClick={() => setStep(prev => prev + 1)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg"
                            >
                                다음 <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleDismiss}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg w-full justify-center"
                        >
                            시작하기 <Check className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
