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
                    price: Math.round(t.trade_price / 10000), // Convert to '만원'
                    name: marketInfo?.korean_name || symbol
                };
            });
        } else {
            // Stock - Mocking for now
            const mockPrices: Record<string, { price: number; name: string }> = {
                "AAPL": { price: 32, name: "Apple Inc." }, // ~32만원
                "TSLA": { price: 40, name: "Tesla Inc." },
                "NVDA": { price: 20, name: "NVIDIA" },
                "005930": { price: 7, name: "삼성전자" },
                "000660": { price: 18, name: "SK하이닉스" },
            };

            symbols.forEach(s => {
                const symbol = s.toUpperCase();
                if (mockPrices[symbol]) {
                    results[symbol] = mockPrices[symbol];
                } else {
                    // Random price for demo (in 만원)
                    results[symbol] = {
                        price: Math.floor(Math.random() * 50) + 1,
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
