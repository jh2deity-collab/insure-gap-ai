export interface CoverageData {
    cancer: number;
    brain: number;
    heart: number;
    medical: number;
    death: number;
}

export interface TrackedAsset {
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
    currency: 'KRW' | 'USD';
    type: 'stock' | 'crypto';
}

export interface UserState {
    name: string;
    age: number;
    gender: 'male' | 'female';
    coverages: CoverageData;
}

export interface StandardData {
    ageGroup: number;
    gender: 'male' | 'female';
    recommended: CoverageData;
}

export interface AnalysisResult {
    score: number;
    gapCount: number;
}

export interface FinanceAssets {
    cash: number;
    stock: number;
    realEstate: number;
    pension: number; // 개인연금/퇴직연금 자산
    insurance: number; // 보장성/중도환급금 자산
    crypto: number;
    trackedStocks?: TrackedAsset[];
    trackedCrypto?: TrackedAsset[];
}

export interface FinanceState {
    name: string;
    age: number;
    gender?: 'male' | 'female';
    retirementAge: number;
    targetMonthlyIncome: number; // 은퇴 후 희망 월 생활비
    currentIncome: number;
    currentExpenses: number;
    nationalPension: number; // 예상 국민연금 월 수령액
    assets: FinanceAssets;
}
