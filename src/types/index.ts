export interface CoverageData {
    cancer: number;
    brain: number;
    heart: number;
    medical: number;
    death: number;
}

export interface UserState {
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
    crypto: number;
}

export interface FinanceState {
    age: number;
    retirementAge: number;
    targetMonthlyIncome: number; // 은퇴 후 희망 월 생활비
    currentIncome: number;
    currentExpenses: number;
    assets: FinanceAssets;
}
