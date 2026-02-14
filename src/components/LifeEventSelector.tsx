"use client"

import { useState } from "react"
import { LifeEvent, FinanceState } from "@/types"
import { Heart, Baby, Home, Car, GraduationCap, Sparkles, Plus, X, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LifeEventSelectorProps {
    financeState: FinanceState;
    onAddEvent: (event: LifeEvent) => void;
    onRemoveEvent: (eventId: string) => void;
}

const EVENT_TYPES = [
    { type: 'marriage', label: '결혼', icon: Heart, defaultCost: 3000, color: 'text-pink-400 bg-pink-400/10' },
    { type: 'childbirth', label: '출산', icon: Baby, defaultCost: 1000, color: 'text-green-400 bg-green-400/10' },
    { type: 'house', label: '주택 구입', icon: Home, defaultCost: 50000, color: 'text-blue-400 bg-blue-400/10' },
    { type: 'car', label: '차량 구입', icon: Car, defaultCost: 4000, color: 'text-orange-400 bg-orange-400/10' },
    { type: 'education', label: '자녀 교육', icon: GraduationCap, defaultCost: 5000, color: 'text-purple-400 bg-purple-400/10' },
    { type: 'other', label: '기타 이벤트', icon: Sparkles, defaultCost: 1000, color: 'text-slate-400 bg-slate-400/10' },
]

export default function LifeEventSelector({ financeState, onAddEvent, onRemoveEvent }: LifeEventSelectorProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [config, setConfig] = useState({
        age: financeState.age + 1,
        cost: 0
    })

    const handleTypeSelect = (typeData: any) => {
        setSelectedType(typeData.type)
        setConfig({
            age: financeState.age + 3, // Default 3 years later
            cost: typeData.defaultCost
        })
    }

    const handleAdd = () => {
        if (!selectedType) return;

        const typeData = EVENT_TYPES.find(t => t.type === selectedType)!

        const newEvent: LifeEvent = {
            id: crypto.randomUUID(),
            type: selectedType as any,
            name: typeData.label,
            age: config.age,
            cost: config.cost
        }

        onAddEvent(newEvent)
        setSelectedType(null)
    }

    return (
        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    라이프 이벤트 시뮬레이터
                </h3>
                <span className="text-xs text-slate-400">미래의 큰 지출을 계획해보세요</span>
            </div>

            {/* Existing Events Timeline */}
            {financeState.lifeEvents && financeState.lifeEvents.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
                    {financeState.lifeEvents.sort((a, b) => a.age - b.age).map(event => {
                        const typeData = EVENT_TYPES.find(t => t.type === event.type) || EVENT_TYPES[5]
                        const Icon = typeData.icon
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="shrink-0 relative group"
                            >
                                <div className={`p-3 rounded-xl border border-slate-700 bg-slate-800 flex flex-col items-center min-w-[80px]`}>
                                    <div className={`p-1.5 rounded-full mb-1 ${typeData.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-white">{event.age}세</span>
                                    <span className="text-[10px] text-slate-400">{event.name}</span>
                                    <span className="text-[10px] text-slate-500">-{event.cost.toLocaleString()}만</span>

                                    <button
                                        onClick={() => onRemoveEvent(event.id)}
                                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* Event Selector Grid */}
            {!selectedType ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {EVENT_TYPES.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => handleTypeSelect(item)}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-all"
                        >
                            <div className={`p-2 rounded-full ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-slate-300">{item.label}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-4"
                >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h4 className="font-bold text-white">이벤트 설정</h4>
                        <button onClick={() => setSelectedType(null)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">발생 나이</span>
                                <span className="text-white font-bold">{config.age}세 ({config.age - financeState.age}년 후)</span>
                            </div>
                            <input
                                type="range"
                                min={financeState.age + 1}
                                max={80}
                                value={config.age}
                                onChange={(e) => setConfig({ ...config, age: Number(e.target.value) })}
                                className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">필요 비용 (만원)</span>
                                <span className="text-white font-bold">{config.cost.toLocaleString()}만원</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100000}
                                step={100}
                                value={config.cost}
                                onChange={(e) => setConfig({ ...config, cost: Number(e.target.value) })}
                                className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> 추가하기
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
