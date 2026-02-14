"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, AlertTriangle, Info, ChevronDown, CheckCircle2, ScanText } from "lucide-react"
import { PolicyRisk, RiskLevel } from "@/types"

interface PolicyRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
    risks: PolicyRisk[];
    originalText?: string;
}

export default function PolicyRiskModal({ isOpen, onClose, risks, originalText }: PolicyRiskModalProps) {
    if (!isOpen) return null;

    // Sort risks: Critical -> Warning -> Info
    const sortedRisks = [...risks].sort((a, b) => {
        const score = { critical: 3, warning: 2, info: 1 };
        return score[b.level] - score[a.level];
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ScanText className="w-6 h-6 text-purple-400" /> AI 약관 정밀 분석
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">Auto-Detected</span>
                        </div>
                        <p className="text-slate-400 text-sm">보험 약관에서 주의해야 할 위험 요소를 AI가 감지했습니다.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">

                    {sortedRisks.length === 0 ? (
                        <div className="text-center py-20">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">발견된 위험 요소가 없습니다.</h3>
                            <p className="text-slate-400">약관 분석 결과, 특별한 독소조항이 발견되지 않았습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedRisks.map((risk) => (
                                <RiskItem key={risk.id} risk={risk} />
                            ))}
                        </div>
                    )}

                    {/* Original Text Preview (Optional) */}
                    {originalText && (
                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Original OCR Text</h4>
                            <div className="bg-black/50 rounded-lg p-4 text-xs text-slate-500 font-mono leading-relaxed h-32 overflow-y-auto text-justify">
                                {originalText}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                    >
                        확인
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

function RiskItem({ risk }: { risk: PolicyRisk }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const config = {
        critical: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', badge: '치명적 위험' },
        warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: '주의 필요' },
        info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', badge: '참고' }
    }[risk.level];

    const Icon = config.icon;

    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-slate-800/80 border-slate-600' : `bg-slate-800/30 ${config.border} hover:border-slate-600`}`}>
            <div
                className="p-4 flex items-start gap-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={`mt-1 p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-bold ${isExpanded ? 'text-white' : 'text-slate-200'}`}>{risk.title}</h3>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${config.color} ${config.border} bg-transparent font-medium`}>
                                    {config.badge}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-1">{risk.description}</p>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pl-[4.5rem]">
                            <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                {risk.description}
                            </p>
                            {risk.clauseSnippet && (
                                <div className="bg-black/30 rounded-lg p-3 border border-slate-700/50">
                                    <p className="text-xs text-slate-500 font-mono mb-1">관련 약관 원문:</p>
                                    <p className="text-xs text-slate-400 italic">"...{risk.clauseSnippet}..."</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
