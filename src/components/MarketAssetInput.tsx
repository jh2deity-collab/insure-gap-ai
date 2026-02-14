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
        <div className="bg-slate-900/50 rounded-2xl border border-slate-700 p-4 mt-2">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-300 text-xs font-bold flex items-center gap-2">
                    {type === 'stock' ? <TrendingUp className="w-3 h-3 text-blue-400" /> : <Wallet className="w-3 h-3 text-emerald-400" />}
                    실시간 {type === 'stock' ? '주식' : '코인'} 관리
                </h4>
                <div className="text-slate-400 text-[10px] font-mono">
                    Total: <span className="text-white font-bold">{(totalValue / 1).toLocaleString()}</span> 만원
                </div>
            </div>

            {/* Input Row */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder={type === 'stock' ? "티커 (AAPL, 삼성전자...)" : "코인 (BTC, ETH...)"}
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <input
                    type="number"
                    placeholder="수량"
                    value={newQty || ""}
                    onChange={(e) => setNewQty(parseFloat(e.target.value))}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                    onClick={addAsset}
                    disabled={loading || !newSymbol || newQty <= 0}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {assets.map((asset) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${type === 'stock' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {asset.symbol.substring(0, 3)}
                                </div>
                                <div>
                                    <p className="text-white text-[11px] font-bold">{asset.name}</p>
                                    <p className="text-slate-500 text-[9px]">{asset.quantity.toLocaleString()}주/개 × {asset.currentPrice.toLocaleString()}만원</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-blue-400 text-[11px] font-mono font-bold">+{(asset.quantity * asset.currentPrice).toLocaleString()}</p>
                                    <p className="text-slate-600 text-[9px] flex items-center justify-end gap-1">
                                        Live <ArrowUpRight className="w-2 h-2" />
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeAsset(asset.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {assets.length === 0 && (
                    <div className="text-center py-6 text-slate-600 text-[11px] italic">
                        연동된 자산이 없습니다. 티커와 수량을 입력하세요.
                    </div>
                )}
            </div>
        </div>
    )
}
