"use client"

import { Check, FileText, X } from "lucide-react"
import { useEffect, useState } from "react"

interface DownloadCompleteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DownloadComplete({ isOpen, onClose }: DownloadCompleteProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setShow(true)
            // Auto close/fade could be added here
        } else {
            setShow(false)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300">
            <div
                className={`bg-[#1A1F2C] border border-blue-500/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,102,255,0.2)] transform transition-all duration-500 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <div className="relative p-8 text-center">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full point-events-none" />

                    {/* Icon */}
                    <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-[spin_3s_linear_infinite]" style={{ borderTopColor: '#0066FF' }} />
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Text */}
                    <h3 className="text-2xl font-bold text-white mb-2">다운로드 완료!</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        상세 솔루션 리포트가<br />
                        PDF 형식으로 저장되었습니다.
                    </p>

                    {/* File Preview Mock */}
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-white/5 flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-200 text-sm font-bold">InsureGap_Report.pdf</p>
                            <p className="text-slate-500 text-xs">방금 전 • 2.4 MB</p>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-white text-[#1A1F2C] rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}
