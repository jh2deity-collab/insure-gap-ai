"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, TrendingUp, Wallet, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TrackedAsset } from "@/types"

interface MarketAssetInputProps {
    type: 'stock' | 'crypto';
    onAssetsChange: (assets: TrackedAsset[]) => void;
    initialAssets?: TrackedAsset[];
}

export default function MarketAssetInput({ type, onAssetsChange, initialAssets = [] }: MarketAssetInputProps) {
    const [assets, setAssets] = useState<TrackedAsset[]>(initialAssets)
    const [newSymbol, setNewSymbol] = useState("")
    const [newQty, setNewQty] = useState<number>(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        onAssetsChange(assets)
    }, [assets])

    const fetchPrice = async (symbol: string) => {
        try {
            const resp = await fetch(`/api/finance/prices?symbols=${symbol}&type=${type}`)
            const data = await resp.json()
            if (data[symbol.toUpperCase()]) {
                return data[symbol.toUpperCase()]
            }
            return null
        } catch (err) {
            console.error("Price fetch failed", err)
            return null
        }
    }

    const addAsset = async () => {
        if (!newSymbol || newQty <= 0) return
        setLoading(true)

        const symbol = newSymbol.toUpperCase()
        const priceData = await fetchPrice(symbol)

        if (priceData) {
            const newAsset: TrackedAsset = {
                id: Math.random().toString(36).substr(2, 9),
                symbol,
                name: priceData.name,
                quantity: newQty,
                currentPrice: priceData.price,
                currency: type === 'stock' ? 'KRW' : 'KRW', // Simplified for demo
                type
            }
            setAssets(prev => [...prev, newAsset])
            setNewSymbol("")
            setNewQty(0)
        } else {
            alert("유효한 티커를 찾을 수 없습니다.")
        }
        setLoading(false)
    }

    const removeAsset = (id: string) => {
        setAssets(prev => prev.filter(a => a.id !== id))
    }

    const totalValue = assets.reduce((sum, a) => sum + (a.quantity * a.currentPrice), 0)

    return (
        <div className="bg-slate-900/60 rounded-3xl border border-slate-700/80 p-6 mt-4 shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-10 blur-3xl rounded-full ${type === 'stock' ? 'bg-blue-500' : 'bg-emerald-500'}`} />

            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${type === 'stock' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {type === 'stock' ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                    </div>
                    <h4 className="text-white text-base font-black tracking-tight">
                        실시간 {type === 'stock' ? '주식' : '코인'} 자산 합계
                    </h4>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Estimated Value</p>
                    <p className={`text-4xl font-black font-mono tracking-tighter ${type === 'stock' ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {totalValue.toLocaleString()}
                        <span className="text-lg font-bold text-slate-500 ml-1">만원</span>
                    </p>
                </div>
            </div>

            {/* Input Row - Expanded */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-[2]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder={type === 'stock' ? "티커 검색 (AAPL, 005930...)" : "코인 검색 (BTC, ETH...)"}
                            value={newSymbol}
                            onChange={(e) => setNewSymbol(e.target.value)}
                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl pl-12 pr-4 py-3 text-base text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="number"
                            placeholder="수량"
                            value={newQty || ""}
                            onChange={(e) => setNewQty(parseFloat(e.target.value))}
                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-blue-500 transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>
                <button
                    onClick={addAsset}
                    disabled={loading || !newSymbol || newQty <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    자산 추가하기
                </button>
            </div>

            {/* List - Taller & More Readable */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {assets.map((asset) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 group hover:border-slate-500/50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${type === 'stock' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    {asset.symbol.substring(0, 4)}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">{asset.name}</p>
                                    <p className="text-slate-500 text-[11px] font-medium">{asset.quantity.toLocaleString()}주/개 × {asset.currentPrice.toLocaleString()}만원</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="text-right">
                                    <p className="text-blue-400 text-sm font-black font-mono">+{(asset.quantity * asset.currentPrice).toLocaleString()}</p>
                                    <p className="text-slate-600 text-[10px] flex items-center justify-end gap-1 font-bold">
                                        LIVE <ArrowUpRight className="w-3 h-3" />
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeAsset(asset.id)}
                                    className="text-slate-600 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {assets.length === 0 && (
                    <div className="text-center py-10 text-slate-600 text-sm italic border-2 border-dashed border-slate-800 rounded-3xl">
                        등록된 자산이 없습니다. 위에서 추가해 보세요!
                    </div>
                )}
            </div>
        </div>
    )
}

import { Loader2 } from "lucide-react"
