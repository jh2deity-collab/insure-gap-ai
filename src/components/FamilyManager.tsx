"use client"

import { FamilyState, FamilyMember } from "@/types"
import { Plus, User, Baby, Heart, Users, BarChart, X } from "lucide-react"
import { motion } from "framer-motion"

import { useState } from "react" // Added
import DeleteConfirmModal from "./DeleteConfirmModal" // Added

interface FamilyManagerProps {
    familyState: FamilyState;
    currentMemberId: string;
    onSwitchMember: (id: string) => void;
    onAddMember: (relation: 'spouse' | 'child' | 'parent') => void;
    onRemoveMember: (id: string) => void;
    onAnalyze: () => void;
}

export default function FamilyManager({ familyState, currentMemberId, onSwitchMember, onAddMember, onRemoveMember, onAnalyze }: FamilyManagerProps) {
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null) // Added

    const getIcon = (relation: string, gender: string) => {
        if (relation === 'child') return <Baby className="w-5 h-5" />;
        if (relation === 'spouse') return <Heart className="w-5 h-5 text-pink-500" />;
        return <User className="w-5 h-5" />;
    }

    const getLabel = (member: FamilyMember) => {
        if (member.relation === 'self') return '나 (본인)';
        if (member.relation === 'spouse') return '배우자';
        if (member.relation === 'child') return '자녀';
        if (member.relation === 'parent') return '부모님';
        return member.name;
    }

    return (
        <div className="mb-6 p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={() => {
                    if (deleteTargetId) onRemoveMember(deleteTargetId)
                    setDeleteTargetId(null)
                }}
                description="해당 가족 구성원을 삭제하시겠습니까? 입력된 모든 정보가 영구적으로 사라집니다."
            />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">가족 구성원 관리</h3>
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">
                        {familyState.members.length}명
                    </span>
                </div>
                <button
                    onClick={onAnalyze}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors"
                >
                    <BarChart className="w-3.5 h-3.5" />
                    가족 분석
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {familyState.members.map((member) => (
                    <div key={member.id} className="relative group">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSwitchMember(member.id)}
                            className={`
                                min-w-[100px] p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative
                                ${currentMemberId === member.id
                                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'}
                            `}
                        >
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                ${currentMemberId === member.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}
                            `}>
                                {getIcon(member.relation, member.gender)}
                            </div>
                            <div className="text-center">
                                <div className={`text-sm font-bold ${currentMemberId === member.id ? 'text-white' : 'text-slate-300'}`}>
                                    {getLabel(member)}
                                </div>
                                <div className="text-xs text-slate-500">{member.age}세</div>
                            </div>
                        </motion.button>

                        {/* Delete Button (Only for non-self members) */}
                        {member.relation !== 'self' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTargetId(member.id);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-slate-600 hover:border-red-500 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg scale-90 hover:scale-110"
                                title="삭제"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}

                {/* Add Buttons */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onAddMember('spouse')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-pink-900/30 border border-slate-700 hover:border-pink-500/50 rounded-lg text-xs text-slate-400 hover:text-pink-300 transition-colors whitespace-nowrap"
                    >
                        <Heart className="w-3 h-3" /> 배우자 추가
                    </button>
                    <button
                        onClick={() => onAddMember('child')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-green-900/30 border border-slate-700 hover:border-green-500/50 rounded-lg text-xs text-slate-400 hover:text-green-300 transition-colors whitespace-nowrap"
                    >
                        <Baby className="w-3 h-3" /> 자녀 추가
                    </button>
                    <button
                        onClick={() => onAddMember('parent')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500/50 rounded-lg text-xs text-slate-400 hover:text-purple-300 transition-colors whitespace-nowrap"
                    >
                        <User className="w-3 h-3" /> 부모님 추가
                    </button>
                </div>
            </div>
        </div>
    )
}
