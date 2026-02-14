"use client"

import { Camera, Loader2, Sparkles, Check, AlertCircle } from "lucide-react"
import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { UserState } from "@/types"
import { motion } from "framer-motion"

interface InputSectionProps {
    userState: UserState;
    onChange: (key: string, value: string | number | { key: string; value: number }) => void;
}

export default function InputSection({ userState, onChange }: InputSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [scanning, setScanning] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanning(true);
        setScanSuccess(false);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;

                const response = await fetch('/api/ai/ocr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64 })
                });

                const result = await response.json();

                if (response.ok && result.data) {
                    // Update all coverages: Accumulate new values to existing ones
                    let addedTotal = 0;
                    Object.entries(result.data).forEach(([key, value]) => {
                        const currentVal = userState.coverages[key as keyof typeof userState.coverages] || 0;
                        const newVal = (value as number);
                        if (newVal > 0) {
                            addedTotal += newVal;
                            onChange('coverage', { key, value: currentVal + newVal });
                        }
                    });
                    setScanSuccess(true);
                    setTimeout(() => setScanSuccess(false), 3000);
                    alert(`총 ${Object.keys(result.data).length}개 항목에서 ${addedTotal.toLocaleString()}만원의 보장이 추가되었습니다.`);
                } else {
                    alert(result.error || "분석에 실패했습니다. 다시 시도해주세요.");
                }
                setScanning(false);
            };
        } catch (err) {
            console.error("Upload Error:", err);
            setScanning(false);
            alert("이미지 처리 중 오류가 발생했습니다.");
        }
    };

    const sliders = [
        { key: 'cancer', label: '암 진단비', max: 20000, step: 1000 },
        { key: 'brain', label: '뇌혈관 진단비', max: 20000, step: 1000 },
        { key: 'heart', label: '심장 질환', max: 20000, step: 1000 },
        { key: 'medical', label: '실손 의료비', max: 50000, step: 5000 },
        { key: 'death', label: '사망 보험금', max: 100000, step: 10000 },
    ];

    return (
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            {/* AI OCR Scanner Button */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                    <Camera className="w-16 h-16" />
                </div>
                <div className="relative z-10 text-center">
                    <h4 className="text-white font-black text-sm mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        AI 보험 증권 간편 스캔
                    </h4>
                    <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                        복잡한 증권 내용을 일일이 입력할 필요 없습니다.<br />
                        사진 한 장으로 보장 내역을 자동 분석합니다.
                    </p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={scanning}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 ${scanSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        {scanning ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>정밀 분석 중...</span>
                            </>
                        ) : scanSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                <span>분석 완료! 반영되었습니다.</span>
                            </>
                        ) : (
                            <>
                                <Camera className="w-5 h-5" />
                                <span>증권 사진 업로드하기</span>
                            </>
                        )}
                    </button>
                    <p className="mt-3 text-[10px] text-slate-500 italic">
                        * 권장 형식: 보장 표가 잘 보이는 선명한 사진
                    </p>
                </div>
            </div>
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
