"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { UserState } from "@/types"
import { motion } from "framer-motion"

interface InputSectionProps {
    userState: UserState;
    onChange: (key: string, value: string | number | { key: string; value: number }) => void;
}

export default function InputSection({ userState, onChange }: InputSectionProps) {
    const sliders = [
        { key: 'cancer', label: '암 진단비', max: 20000, step: 1000 },
        { key: 'brain', label: '뇌혈관 진단비', max: 20000, step: 1000 },
        { key: 'heart', label: '심장 질환', max: 20000, step: 1000 },
        { key: 'medical', label: '실손 의료비', max: 50000, step: 5000 },
        { key: 'death', label: '사망 보험금', max: 100000, step: 10000 },
    ];

    return (
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="mb-6">
                <Label className="text-slate-400 mb-2 block">성함 (Name)</Label>
                <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={userState.name || ""}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <Label className="text-slate-400 mb-2 block">생년월일 (Birth Date)</Label>
                    <input
                        type="date"
                        value={userState.birthDate}
                        onChange={(e) => onChange('birthDate', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all [color-scheme:dark]"
                    />
                </div>
                <div>
                    <Label className="text-slate-400 mb-2 block">성별 (Gender)</Label>
                    <div className="flex bg-slate-900 rounded-md p-1 border border-slate-700">
                        {['male', 'female'].map((g) => (
                            <button
                                key={g}
                                onClick={() => onChange('gender', g)}
                                className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${userState.gender === g
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {g === 'male' ? '남성' : '여성'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {sliders.map((item) => (
                    <div key={item.key}>
                        <div className="flex justify-between mb-2">
                            <Label className="text-slate-300">{item.label}</Label>
                            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md px-2 py-0.5 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                <input
                                    type="number"
                                    value={userState.coverages[item.key as keyof typeof userState.coverages]}
                                    onChange={(e) => onChange('coverage', { key: item.key, value: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="w-16 bg-transparent text-blue-400 font-mono font-bold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-slate-500 text-xs ml-1">만원</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={item.max}
                            step={item.step}
                            value={userState.coverages[item.key as keyof typeof userState.coverages]}
                            onChange={(e) => onChange('coverage', { key: item.key, value: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
