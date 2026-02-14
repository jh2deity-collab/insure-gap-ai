import { UserState, FinanceState, CoverageData, FinanceAssets } from "@/types";

export interface MyDataBatch {
    user: Partial<UserState>;
    finance: Partial<FinanceState>;
    foundItems: number;
}

/**
 * Returns a high-fidelity mock dataset that simulates fetching real data from MyData nodes.
 */
export const getMockMyData = (name: string): MyDataBatch => {
    return {
        user: {
            name: name || "홍길동",
            birthDate: "1990-05-15",
            coverages: {
                cancer: 8000,
                brain: 3000,
                heart: 3000,
                medical: 5000,
                death: 10000
            } as CoverageData,
            healthMetrics: {
                bmi: 23.5,
                bloodPressure: { systolic: 125, diastolic: 82 },
                glucose: 95,
                familyHistory: ["cancer"],
                smoking: false
            }
        },
        finance: {
            currentIncome: 450,
            currentExpenses: 280,
            assets: {
                cash: 5200,
                stock: 3500,
                realEstate: 45000,
                pension: 1200,
                insurance: 450,
                crypto: 800
            } as FinanceAssets,
            nationalPension: 15,
            targetMonthlyIncome: 500,
            retirementAge: 65,
            trackedAssets: {
                "삼성전자": 82000,
                "비트코인": 95000000,
                "현대차": 245000
            }
        },
        foundItems: 12
    };
};

export const AVAILABLE_INSTITUTIONS = [
    { id: 'shinhan', name: '신한은행', type: 'bank' },
    { id: 'kb', name: 'KB국민은행', type: 'bank' },
    { id: 'samsung_life', name: '삼성생명', type: 'insurance' },
    { id: 'hyundai_card', name: '현대카드', type: 'card' },
    { id: 'kakao', name: '카카오뱅크', type: 'bank' },
    { id: 'db', name: 'DB손해보험', type: 'insurance' }
];
