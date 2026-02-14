"use client"

import { useState } from "react"
import { Sparkles, BrainCircuit, RefreshCw, MessageSquareQuote, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UserState, FinanceState } from "@/types"

interface AIConsultingProps {
    userState: UserState;
    financeState: FinanceState;
    mode: 'insurance' | 'finance';
}

export default function AIConsulting({ userState, financeState, mode }: AIConsultingProps) {
    const [advice, setAdvice] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAdvice = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/consulting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userState, financeState, mode })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'AI 분석 중 오류가 발생했습니다.')
            }

            setAdvice(data.advice)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="mt-12 bg-slate-900/40 rounded-3xl border border-slate-700/50 p-6 md:p-10 backdrop-blur-md relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        AI 전문가 컨설팅
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base">
                        {mode === 'insurance'
                            ? '현재 보장 공백을 분석하여 ${userState.name || "고객"}님만을 위한 최적의 보험 전략을 제안합니다.'
                            : '현재 자산 흐름을 바탕으로 ${financeState.name || "고객"}님의 경제적 자유 달성을 위한 통찰을 제공합니다.'
                        }
                    </p>
                </div>

                <button
                    onClick={fetchAdvice}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <BrainCircuit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    )}
                    {advice ? '다시 분석하기' : 'AI 조언 듣기'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <div className="relative mb-4">
                            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <Sparkles className="w-6 h-6 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-blue-400 font-bold animate-pulse">Gemini AI가 데이터를 심층 분석 중입니다...</p>
                        <p className="text-slate-500 text-xs mt-2 italic">최대 10초 정도 소요될 수 있습니다.</p>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4"
                    >
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                            <h4 className="text-red-500 font-bold mb-1">분석 실패</h4>
                            <p className="text-red-400/80 text-sm">{error}</p>
                            <p className="text-red-400/50 text-[10px] mt-2 italic">* .env.local에 API 키가 설정되어 있는지 확인해주세요.</p>
                        </div>
                    </motion.div>
                ) : advice ? (
                    <motion.div
                        key="advice"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl relative"
                    >
                        <MessageSquareQuote className="w-10 h-10 text-blue-500/30 absolute -top-4 -left-2" />
                        <div className="text-slate-200 leading-relaxed whitespace-pre-line text-sm md:text-base font-medium">
                            {advice}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <p className="text-slate-500 text-[10px] italic flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Powered by Google Gemini 1.5 Flash
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        className="border border-dashed border-slate-700/50 py-16 rounded-3xl flex flex-col items-center justify-center text-slate-600"
                    >
                        <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">버튼을 클릭하여 AI 컨설팅을 시작하세요.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
