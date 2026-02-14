"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Lock, CheckCircle2, Building2, Fingerprint, Loader2, CreditCard, Landmark, ShieldCheck } from "lucide-react"
import { AVAILABLE_INSTITUTIONS, getMockMyData } from "@/lib/myDataMock"

interface BankConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (batch: any) => void;
    userName: string;
}

export default function BankConnectModal({ isOpen, onClose, onSuccess, userName }: BankConnectModalProps) {
    const [step, setStep] = useState<'selection' | 'auth' | 'sync' | 'success'>('selection');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep('selection');
            setSelectedIds([]);
            setProgress(0);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (step === 'selection') setStep('auth');
    };

    const handleAuthComplete = () => {
        setStep('sync');
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setStep('success'), 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const handleFinalize = () => {
        const batch = getMockMyData(userName);
        onSuccess(batch);
        onClose();
    };

    const toggleId = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-blue-500/10"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        <h3 className="text-white font-bold">MyData 안전 연동</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Selection */}
                        {step === 'selection' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-white mb-2">연동할 금융사 선택</h4>
                                    <p className="text-slate-400 text-sm">정보를 가져올 은행, 보험, 카드사를 선택하세요.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {AVAILABLE_INSTITUTIONS.map(inst => (
                                        <button
                                            key={inst.id}
                                            onClick={() => toggleId(inst.id)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${selectedIds.includes(inst.id)
                                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            {inst.type === 'bank' ? <Landmark className="w-6 h-6" /> : inst.type === 'insurance' ? <Shield className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                            <span className="text-[10px] font-bold">{inst.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={selectedIds.length === 0}
                                    onClick={handleNext}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                                >
                                    연동 시작하기
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Auth */}
                        {step === 'auth' && (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="py-10 flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"
                                        />
                                        <div className="relative p-6 bg-slate-800 rounded-full border border-slate-700">
                                            <Fingerprint className="w-16 h-16 text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">간편 인증 대기</h4>
                                        <p className="text-slate-400 text-sm">연결된 스마트폰에서 인증을 완료하세요.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAuthComplete}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all border border-slate-700/50"
                                >
                                    인증 완료 (시뮬레이션)
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Sync */}
                        {step === 'sync' && (
                            <motion.div
                                key="sync"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center py-10"
                            >
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative w-24 h-24">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                                            <circle
                                                cx="48" cy="48" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="8"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 * (1 - progress / 100)}
                                                strokeLinecap="round"
                                                className="transition-all duration-300"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-400">
                                            {progress}%
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">금융 데이터 동기화 중</h4>
                                        <p className="text-slate-400 text-sm">선택한 {selectedIds.length}개 기관에서 데이터를 수집합니다.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Success */}
                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="py-6 flex flex-col items-center gap-4">
                                    <div className="p-4 bg-emerald-500/20 rounded-full">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1">연동 성공!</h4>
                                        <p className="text-emerald-400/80 text-sm font-medium">최근 정보로 업데이트되었습니다.</p>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-left space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">수집된 자산 내역</span>
                                        <span className="text-slate-300 font-bold">12건</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">수집된 보험 내역</span>
                                        <span className="text-slate-300 font-bold">5건</span>
                                    </div>
                                    <div className="h-px bg-slate-700/30" />
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">최종 동기화 시각</span>
                                        <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleFinalize}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20"
                                >
                                    분석 결과 보기
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Security Footer */}
                <div className="p-4 bg-slate-950/50 flex items-center justify-center gap-2 border-t border-slate-800/50">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">End-to-End Encrypted Simulation</span>
                </div>
            </motion.div>
        </div>
    );
}
