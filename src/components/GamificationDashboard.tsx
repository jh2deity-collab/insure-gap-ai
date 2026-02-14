"use client"

import { GamificationState } from "@/types"
import { motion } from "framer-motion"
import { Trophy, Star, Target, Crown, Flame } from "lucide-react"

interface GamificationDashboardProps {
    gameProfile: GamificationState;
}

export default function GamificationDashboard({ gameProfile }: GamificationDashboardProps) {
    const { level, exp, nextLevelExp, badges, activeChallenges } = gameProfile;
    const progressPercent = Math.min(100, (exp / nextLevelExp) * 100);

    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Crown className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full border border-slate-700">
                            Lv.{level}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">금융 모험가</h3>
                        <p className="text-xs text-slate-400">다음 레벨까지 {nextLevelExp - exp} EXP</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                        <Star className="w-4 h-4" fill="currentColor" />
                        <span>{exp.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Total EXP</p>
                </div>
            </div>

            {/* EXP Bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>

            {/* Badges */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> 보유 배지 ({badges.length})
                </h4>
                <div className="flex gap-2">
                    {badges.length > 0 ? badges.map((badge, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center" title={badge}>
                            <span className="text-xs">🏅</span>
                        </div>
                    )) : (
                        <p className="text-xs text-slate-500 italic">아직 획득한 배지가 없습니다.</p>
                    )}
                </div>
            </div>

            {/* Active Challenges */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1">
                    <Target className="w-3 h-3" /> 진행 중인 챌린지
                </h4>
                <div className="space-y-3">
                    {activeChallenges.map((challenge) => (
                        <div key={challenge.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h5 className="text-sm font-bold text-slate-200">{challenge.title}</h5>
                                    <p className="text-[10px] text-slate-400">{challenge.description}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${challenge.isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                    {challenge.isCompleted ? '완료' : `+${challenge.rewardExp} EXP`}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>진행률</span>
                                    <span>{Math.round((challenge.progress / challenge.maxProgress) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${challenge.isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (challenge.progress / challenge.maxProgress) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {activeChallenges.length === 0 && (
                        <div className="text-center py-4 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                            <Flame className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">진행 중인 챌린지가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
