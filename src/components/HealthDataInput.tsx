"use client"

import { useState } from "react"
import { Activity, Heart, Brain, Scissors, Info, Thermometer, UserPlus, Trash2 } from "lucide-react"
import { HealthMetrics, UserState } from "@/types"

interface HealthDataInputProps {
    healthMetrics?: HealthMetrics;
    onChange: (metrics: HealthMetrics) => void;
}

export default function HealthDataInput({ healthMetrics, onChange }: HealthDataInputProps) {
    const defaultMetrics: HealthMetrics = {
        bmi: 22,
        bloodPressure: { systolic: 120, diastolic: 80 },
        glucose: 90,
        familyHistory: [],
        smoking: false
    };

    const metrics = healthMetrics || defaultMetrics;

    const updateMetrics = (updates: Partial<HealthMetrics>) => {
        onChange({ ...metrics, ...updates });
    };

    const toggleFamilyHistory = (type: string) => {
        const current = metrics.familyHistory || [];
        const next = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        updateMetrics({ familyHistory: next });
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-white">건강 지표 설정 (MyData 연동 시뮬레이션)</h3>
            </div>

            {/* Blood Pressure */}
            <div className="space-y-3">
                <label className="text-xs text-slate-400 font-medium flex justify-between">
                    <span>혈압 (수축기/이완기)</span>
                    <span className="text-emerald-400">{metrics.bloodPressure.systolic} / {metrics.bloodPressure.diastolic} mmHg</span>
                </label>
                <div className="space-y-2">
                    <input
                        type="range" min="90" max="200" step="1"
                        value={metrics.bloodPressure.systolic}
                        onChange={(e) => updateMetrics({ bloodPressure: { ...metrics.bloodPressure, systolic: parseInt(e.target.value) } })}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <input
                        type="range" min="60" max="130" step="1"
                        value={metrics.bloodPressure.diastolic}
                        onChange={(e) => updateMetrics({ bloodPressure: { ...metrics.bloodPressure, diastolic: parseInt(e.target.value) } })}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            {/* BMI & Glucose */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 flex justify-between">
                        <span>BMI 지수</span>
                        <span className="text-emerald-400">{metrics.bmi}</span>
                    </label>
                    <input
                        type="number"
                        value={metrics.bmi}
                        onChange={(e) => updateMetrics({ bmi: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 flex justify-between">
                        <span>공복 혈당</span>
                        <span className="text-emerald-400">{metrics.glucose}</span>
                    </label>
                    <input
                        type="number"
                        value={metrics.glucose}
                        onChange={(e) => updateMetrics({ glucose: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Family History */}
            <div className="space-y-3">
                <label className="text-xs text-slate-400 font-medium">주요 가족력</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'cancer', label: '암', icon: Scissors },
                        { id: 'brain', label: '뇌질환', icon: Brain },
                        { id: 'heart', label: '심장질환', icon: Heart }
                    ].map((item) => {
                        const active = metrics.familyHistory.includes(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggleFamilyHistory(item.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${active
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Smoking */}
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs text-slate-300">현재 흡연 여부</span>
                </div>
                <button
                    onClick={() => updateMetrics({ smoking: !metrics.smoking })}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${metrics.smoking ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${metrics.smoking ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
                * 실제 MyData 연동 시 국민건강보험공단의 최근 10년 검진 데이터를 자동으로 불러옵니다.
            </p>
        </div>
    )
}
