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
    birthDate: string;
    gender: 'male' | 'female';
    coverages: CoverageData;
    healthMetrics?: HealthMetrics;
    myData?: MyDataConnection;
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

export interface LifeEvent {
    id: string;
    type: 'marriage' | 'childbirth' | 'house' | 'car' | 'education' | 'other';
    name: string;
    age: number;
    cost: number; // 일회성 비용 (만원)
    monthlyCost?: number; // 월 추가 지출 (만원)
    duration?: number; // 지속 기간 (년)
}

export interface FinancialMBTI {
    type: string; // e.g. "RSPL"
    scores: {
        R: number; // Risk-taking
        S: number; // Spender
        P: number; // Planner
        L: number; // Logic
    };
    timestamp: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    rewardExp: number;
    isCompleted: boolean;
    progress: number;
    maxProgress: number; // e.g. 100 (%) or 1000000 (Amount)
}

export interface GamificationState {
    level: number;
    exp: number;
    nextLevelExp: number;
    badges: string[]; // Badge IDs
    dailyLogin: string; // YYYY-MM-DD
    activeChallenges: Challenge[];
}

export interface FinanceState {
    name: string;
    age: number;
    birthDate: string;
    gender?: 'male' | 'female';
    retirementAge: number;
    targetMonthlyIncome: number; // 은퇴 후 희망 월 생활비
    currentIncome: number;
    currentExpenses: number;
    nationalPension: number; // 예상 국민연금 월 수령액
    assets: FinanceAssets;
    lifeEvents: LifeEvent[];
    financialProfile?: FinancialMBTI;
    gameProfile?: GamificationState;
    myData?: MyDataConnection;
    trackedAssets?: Record<string, number>;
}

export interface FamilyMember extends UserState {
    id: string;
    relation: 'self' | 'spouse' | 'child' | 'parent';
}

export interface FamilyState {
    members: FamilyMember[];
}

export type RiskLevel = 'critical' | 'warning' | 'info';

export interface PolicyRisk {
    id: string;
    title: string;          // e.g., "면책 기간 주의"
    description: string;    // e.g., "가입 후 90일 이내 암 진단 시 보장 금액이 0원입니다."
    level: RiskLevel;
    clauseSnippet?: string; // The detected text segment
}

export interface HealthMetrics {
    bmi: number;
    bloodPressure: { systolic: number; diastolic: number };
    glucose: number;
    familyHistory: string[]; // ['cancer', 'heart', 'brain']
    smoking: boolean;
}

export interface HealthRisk {
    category: keyof CoverageData;
    riskLevel: number; // 0 to 100
    reason: string;
}

export interface DietRecommendation {
    category: keyof CoverageData;
    currentAmount: number;
    targetAmount: number;
    savingsPotential: number; // Estimated premium reduction in Won
    reason: string;
    priority: 'high' | 'medium';
}

export interface MyDataConnection {
    isConnected: boolean;
    lastSync?: string;
    institutions: string[];
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
}

// Update UserState or FinanceState to include HealthMetrics?
// Let's add it to UserState since it's more about "Insurance (Person)"
export interface UserState {
    name: string;
    age: number;
    birthDate: string;
    gender: 'male' | 'female';
    coverages: CoverageData;
    healthMetrics?: HealthMetrics; // Optional health data
}
