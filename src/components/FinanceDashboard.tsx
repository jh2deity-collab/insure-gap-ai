"use client"

import Image from "next/image"
import { useState, useEffect, useMemo, useCallback } from "react" // Updated import

import { FinanceState, LifeEvent, GamificationState, Challenge } from "@/types"
import FinanceInput from "@/components/FinanceInput"
import AssetPieChart from "@/components/AssetPieChart"
import RetirementChart from "@/components/RetirementChart"
import FinanceAIAnalysis from "@/components/FinanceAIAnalysis"
import OnboardingGuide from "@/components/OnboardingGuide"
import LifeEventSelector from "@/components/LifeEventSelector"
import GamificationDashboard from "@/components/GamificationDashboard"
import { TrendingUp, PieChart as PieIcon, Activity, Trophy, RefreshCw } from "lucide-react"

interface FinanceDashboardProps {
    financeState: FinanceState;
    onStateChange: (key: string, value: any) => void;
    onMyDataConnect: () => void;
}

// Initial Gamification State
const INITIAL_GAME_STATE: GamificationState = {
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    badges: [],
    dailyLogin: new Date().toISOString().split('T')[0],
    activeChallenges: [
        { id: 'c1', title: '시드머니 1억 만들기', description: '순자산 1억원을 달성하세요.', rewardExp: 500, isCompleted: false, progress: 0, maxProgress: 10000 },
        { id: 'c2', title: '노후 준비 시작', description: '은퇴 목표 나이를 설정하세요.', rewardExp: 100, isCompleted: false, progress: 0, maxProgress: 1 },
        { id: 'c3', title: '지출 다이어트', description: '월 지출을 200만원 이하로 줄이세요.', rewardExp: 300, isCompleted: false, progress: 0, maxProgress: 1 }
    ]
}


// ... imports
import FinanceSummaryHeader from "@/components/FinanceSummaryHeader"

// ... (keep interface and INITIAL_GAME_STATE)

export default function FinanceDashboard({ financeState, onStateChange, onMyDataConnect }: FinanceDashboardProps) {

    // Initialize Game Profile if missing
    useEffect(() => {
        if (!financeState.gameProfile) {
            onStateChange('gameProfile', INITIAL_GAME_STATE)
        }
    }, [financeState.gameProfile, onStateChange])

    // Challenge Logic Check (Keep existing simplified logic)
    // ... (We can keep the logic as is, or move it to a hook later. For now, keep it here to ensure it works)
    // Calculate Total Assets for Challenge Logic
    const manualAssetsValue = useMemo(() => Object.entries(financeState.assets)
        .filter(([key, value]) => typeof value === 'number')
        .reduce((sum, [_, value]) => sum + (value as number), 0), [financeState.assets]);

    const trackedStockValue = useMemo(() => financeState.assets.trackedStocks?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0, [financeState.assets.trackedStocks]);
    const trackedCryptoValue = useMemo(() => financeState.assets.trackedCrypto?.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0) || 0, [financeState.assets.trackedCrypto]);

    const totalAssets = manualAssetsValue + trackedStockValue + trackedCryptoValue;

    useEffect(() => {
        if (!financeState.gameProfile) return;

        let updated = false;
        const newChallenges = financeState.gameProfile.activeChallenges.map(ch => {
            if (ch.isCompleted) return ch;

            let newProgress = ch.progress;
            let completed = false;

            if (ch.id === 'c1') { // 1억 만들기
                newProgress = Math.min(ch.maxProgress, totalAssets / 10000); // 만원 단위
                if (newProgress >= ch.maxProgress) completed = true;
            } else if (ch.id === 'c2') { // 은퇴 목표 설정
                if (financeState.retirementAge > 0) {
                    newProgress = 1;
                    completed = true;
                }
            } else if (ch.id === 'c3') { // 지출 줄이기
                if (financeState.currentExpenses <= 200 && financeState.currentExpenses > 0) {
                    newProgress = 1;
                    completed = true;
                } else {
                    newProgress = 0;
                }
            }

            if (newProgress !== ch.progress || completed !== ch.isCompleted) {
                updated = true;
                return { ...ch, progress: newProgress, isCompleted: completed };
            }
            return ch;
        });

        if (updated) {
            // Calculate EXP gain
            const completedExp = newChallenges
                .filter(ch => ch.isCompleted && !financeState.gameProfile!.activeChallenges.find(old => old.id === ch.id)?.isCompleted)
                .reduce((sum, ch) => sum + ch.rewardExp, 0);

            if (completedExp > 0) {
                let newExp = financeState.gameProfile.exp + completedExp;
                let newLevel = financeState.gameProfile.level;
                let nextLevelExp = financeState.gameProfile.nextLevelExp; // Fix: use variable not state directly inside loop

                while (newExp >= nextLevelExp) {
                    newLevel++;
                    newExp -= nextLevelExp;
                    nextLevelExp = Math.floor(nextLevelExp * 1.5);
                }

                onStateChange('gameProfile', {
                    ...financeState.gameProfile,
                    activeChallenges: newChallenges,
                    exp: newExp,
                    level: newLevel,
                    nextLevelExp: nextLevelExp
                });

                console.log(`🎉 챌린지 달성! +${completedExp} EXP 획득! Level ${newLevel}`);
            } else {
                onStateChange('gameProfile', {
                    ...financeState.gameProfile,
                    activeChallenges: newChallenges
                });
            }
        }
    }, [totalAssets, financeState.retirementAge, financeState.currentExpenses, financeState.gameProfile, onStateChange]);

    const handleAddEvent = useCallback((event: LifeEvent) => {
        const currentEvents = financeState.lifeEvents || []
        onStateChange('lifeEvents', [...currentEvents, event])

        // Grant EXP for adding life event
        if (financeState.gameProfile) {
            let newExp = financeState.gameProfile.exp + 50;
            let newLevel = financeState.gameProfile.level;
            let nextLevelExp = financeState.gameProfile.nextLevelExp;
            while (newExp >= nextLevelExp) {
                newLevel++;
                newExp -= nextLevelExp;
                nextLevelExp = Math.floor(nextLevelExp * 1.5);
            }
            onStateChange('gameProfile', {
                ...financeState.gameProfile,
                exp: newExp,
                level: newLevel,
                nextLevelExp: nextLevelExp
            })
        }
    }, [financeState.lifeEvents, financeState.gameProfile, onStateChange])

    const handleRemoveEvent = useCallback((eventId: string) => {
        const currentEvents = financeState.lifeEvents || []
        const updated = currentEvents.filter(e => e.id !== eventId)
        onStateChange('lifeEvents', updated)
    }, [financeState.lifeEvents, onStateChange])


    return (
        <div className="space-y-8">

            {/* 1. Header Summary Section (New) */}
            <FinanceSummaryHeader
                financeState={financeState}
                onMyDataConnect={onMyDataConnect}
            />

            {/* 2. Main Grid Layout (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Input (40%) */}
                <div className="lg:col-span-5 space-y-8 h-fit"> {/* h-fit to align top */}
                    <OnboardingGuide />

                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" /> 자산 데이터 입력
                        </h3>
                        {/* Scrollable Container within the fixed height column if needed, but FinanceInput has its own scroll */}
                        <FinanceInput financeState={financeState} onChange={onStateChange} />
                    </div>

                    {/* Life Event Selector */}
                    <LifeEventSelector
                        financeState={financeState}
                        onAddEvent={handleAddEvent}
                        onRemoveEvent={handleRemoveEvent}
                    />
                </div>

                {/* Right Column: Visualization (60%) */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Gamification Dashboard (Compact) */}
                    {financeState.gameProfile && (
                        <GamificationDashboard gameProfile={financeState.gameProfile} />
                    )}

                    {/* Asset Overview Card */}
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <PieIcon className="w-5 h-5 text-blue-500" /> 자산 포트폴리오
                            </h3>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md">실시간 & 수기 자산 합산</span>
                        </div>

                        <div className="w-full h-[320px]">
                            <AssetPieChart assets={financeState.assets} />
                        </div>
                    </div>

                    {/* Projection Card */}
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-500" /> 은퇴 자산 시뮬레이션
                            </h3>
                            <span className="text-xs text-slate-500 font-normal">90세까지 시뮬레이션</span>
                        </div>
                        <RetirementChart financeState={financeState} />
                        <p className="text-center text-slate-500 text-xs mt-4">
                            * 연 수익률 5%, 물가상승률 3% 가정 (현재 가치 기준)
                        </p>
                    </div>

                    {/* AI Analysis Report */}
                    <FinanceAIAnalysis financeState={financeState} />
                </div>
            </div>
        </div>
    )
}
