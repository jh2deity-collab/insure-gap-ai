import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symbols = searchParams.get("symbols")?.split(",") || [];
    const type = searchParams.get("type") || "stock"; // 'stock' or 'crypto'

    if (symbols.length === 0) {
        return NextResponse.json({ error: "No symbols provided" }, { status: 400 });
    }

    try {
        const results: Record<string, { price: number; name: string }> = {};

        if (type === "crypto") {
            // Fetch from Upbit for KRW pairs
            const marketResp = await fetch("https://api.upbit.com/v1/market/all");
            const markets = await marketResp.json();

            const targetSymbols = symbols.map(s => `KRW-${s.toUpperCase()}`);
            const tickerResp = await fetch(`https://api.upbit.com/v1/ticker?markets=${targetSymbols.join(",")}`);
            const tickers = await tickerResp.json();

            tickers.forEach((t: any) => {
                const symbol = t.market.split("-")[1];
                const marketInfo = markets.find((m: any) => m.market === t.market);
                results[symbol] = {
                    price: t.trade_price,
                    name: marketInfo?.korean_name || symbol
                };
            });
        } else {
            // Stock - Mocking for now as Yahoo Finance often needs a library 
            // In a real scenario, we'd use yahoo-finance2 or a paid API
            // For this project, we'll provide some major stock prices and mock others
            const mockPrices: Record<string, { price: number; name: string }> = {
                "AAPL": { price: 235000, name: "Apple Inc." }, // Rough KRW
                "TSLA": { price: 280000, name: "Tesla Inc." },
                "NVDA": { price: 150000, name: "NVIDIA" },
                "005930": { price: 72000, name: "삼성전자" },
                "000660": { price: 185000, name: "SK하이닉스" },
            };

            symbols.forEach(s => {
                const symbol = s.toUpperCase();
                if (mockPrices[symbol]) {
                    results[symbol] = mockPrices[symbol];
                } else {
                    // Random price for demo
                    results[symbol] = {
                        price: Math.floor(Math.random() * 50000) + 10000,
                        name: `${symbol} (Stock)`
                    };
                }
            });
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error("Price fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
    }
}
