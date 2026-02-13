"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2, CreditCard } from "lucide-react"

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ReportModal({ isOpen, onClose, onConfirm }: ReportModalProps) {
    const [step, setStep] = useState<'pay' | 'processing' | 'success'>('pay')

    const handlePay = () => {
        setStep('processing')
        setTimeout(() => {
            setStep('success')
            setTimeout(() => {
                onConfirm()
            }, 1000)
        }, 2000)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-800">
                        <h3 className="font-bold text-white">프리미엄 리포트 구매</h3>
                        <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'pay' && (
                            <div className="space-y-4">
                                <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">심층 분석 리포트 (PDF)</p>
                                            <p className="text-slate-400 text-xs">AI 추천 설계 / 예상 보험료 시뮬레이션 포함</p>
                                        </div>
                                    </div>
                                    <span className="text-white font-bold">₩5,000</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <button className="py-3 bg-[#0064FF] hover:bg-[#0052cc] text-white rounded-lg font-bold transition-colors">
                                        Toss Pay
                                    </button>
                                    <button onClick={handlePay} className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors">
                                        카드 간편결제
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                                <p className="text-slate-300">결제 승인 중입니다...</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                                    <Check className="w-6 h-6" />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-1">결제 완료!</h4>
                                <p className="text-slate-400 text-sm">리포트 생성을 시작합니다...</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
