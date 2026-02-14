"use client"

import { FamilyState, CoverageData } from "@/types"
import { Shield, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface FamilyAnalysisResultProps {
    isOpen: boolean;
    onClose: () => void;
    familyState: FamilyState;
}

export default function FamilyAnalysisResult({ isOpen, onClose, familyState }: FamilyAnalysisResultProps) {
    if (!isOpen) return null;

    // 1. Calculate Aggregates
    const totalCoverages: CoverageData = {
        cancer: 0,
        brain: 0,
        heart: 0,
        medical: 0,
        death: 0
    };

    familyState.members.forEach(member => {
        totalCoverages.cancer += member.coverages.cancer;
        totalCoverages.brain += member.coverages.brain;
        totalCoverages.heart += member.coverages.heart;
        totalCoverages.medical += member.coverages.medical;
        totalCoverages.death += member.coverages.death;
    });

    // 2. Mock Standard for Family (Just sum of members * some factor? Or just assume)
    // Let's simplified standard: Adult = 3000, Child = 2000 for Cancer etc.
    // For now, let's just use fixed huge numbers as 'Ideal Family'
    // Actually dynamic calculation is better.
    const familyIdeally = {
        cancer: familyState.members.length * 3000,
        brain: familyState.members.length * 2000,
        heart: familyState.members.length * 2000,
        medical: familyState.members.length * 10000, // Medical is per person strict
        death: familyState.members.length * 10000 // Variable
    }

    const chartData = [
        { subject: '암 진단비', A: totalCoverages.cancer, B: familyIdeally.cancer, fullMark: familyIdeally.cancer * 1.5 },
        { subject: '뇌혈관', A: totalCoverages.brain, B: familyIdeally.brain, fullMark: familyIdeally.brain * 1.5 },
        { subject: '심장질환', A: totalCoverages.heart, B: familyIdeally.heart, fullMark: familyIdeally.heart * 1.5 },
        { subject: '실손의료비', A: totalCoverages.medical, B: familyIdeally.medical, fullMark: familyIdeally.medical * 1.2 },
        { subject: '사망보험금', A: totalCoverages.death, B: familyIdeally.death, fullMark: familyIdeally.death * 1.2 },
    ];

    // 3. Analysis Logic
    const warnings = [];
    const goods = [];

    // Check Medical Duplication (Self + Spouse usually ok, but multiple per person is bad? No, actually just total amount)
    // Let's check if anyone has 0 medical
    const noMedicalMembers = familyState.members.filter(m => m.coverages.medical === 0);
    if (noMedicalMembers.length > 0) {
        warnings.push(`${noMedicalMembers.map(m => m.name).join(', ')}님의 실손의료비가 없습니다.`);
    }

    // Check sufficient Cancer
    if (totalCoverages.cancer < familyIdeally.cancer * 0.5) {
        warnings.push(`가족 전체 암 진단비가 권장 수준(${familyIdeally.cancer}만원)의 50% 미만입니다.`);
    } else {
        goods.push("가족 암 보장이 든든하게 준비되어 있습니다.");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">가족 통합 보장 분석</h2>
                            <p className="text-sm text-slate-400">총 {familyState.members.length}명의 구성원 분석 결과</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Chart Section */}
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="우리 가족 현황"
                                    dataKey="A"
                                    stroke="#818cf8"
                                    strokeWidth={3}
                                    fill="#6366f1"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="권장 기준"
                                    dataKey="B"
                                    stroke="#94a3b8"
                                    strokeWidth={1}
                                    fill="#94a3b8"
                                    fillOpacity={0.1}
                                    strokeDasharray="4 4"
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                            { label: '암 진단비', val: totalCoverages.cancer },
                            { label: '뇌혈관', val: totalCoverages.brain },
                            { label: '심장질환', val: totalCoverages.heart },
                            { label: '실손의료비', val: totalCoverages.medical },
                            { label: '사망보험금', val: totalCoverages.death },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 text-center">
                                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                                <p className="text-lg font-bold text-white">{item.val.toLocaleString()}<span className="text-xs font-normal text-slate-500 ml-0.5">만원</span></p>
                            </div>
                        ))}
                    </div>

                    {/* Insights */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-white text-lg mb-2">AI 진단 요약</h3>

                        {warnings.map((w, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-200 text-sm">{w}</p>
                            </div>
                        ))}

                        {goods.map((g, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <p className="text-emerald-200 text-sm">{g}</p>
                            </div>
                        ))}

                        {warnings.length === 0 && goods.length === 0 && (
                            <div className="p-4 bg-slate-800 rounded-xl text-center text-slate-400 text-sm">
                                특이사항이 없습니다. 가족 정보가 정확한지 확인해주세요.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-800/30 text-center">
                    <button onClick={onClose} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">
                        닫기
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
