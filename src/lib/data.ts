import { UserState, FinanceState, CoverageData, AnalysisResult, StandardData } from "@/types";

export const STANDARD_DATA: StandardData[] = [
    // 20s Male
    {
        ageGroup: 20,
        gender: 'male',
        recommended: { cancer: 5000, brain: 3000, heart: 3000, medical: 10000, death: 10000 }
    },
    // 30s Male
    {
        ageGroup: 30,
        gender: 'male',
        recommended: { cancer: 7000, brain: 5000, heart: 5000, medical: 10000, death: 20000 }
    },
    // 40s Male
    {
        ageGroup: 40,
        gender: 'male',
        recommended: { cancer: 10000, brain: 7000, heart: 7000, medical: 10000, death: 30000 }
    },
    // 50s Male
    {
        ageGroup: 50,
        gender: 'male',
        recommended: { cancer: 10000, brain: 10000, heart: 10000, medical: 10000, death: 30000 }
    },
    // 20s Female
    {
        ageGroup: 20,
        gender: 'female',
        recommended: { cancer: 5000, brain: 3000, heart: 3000, medical: 10000, death: 5000 }
    },
    // 30s Female
    {
        ageGroup: 30,
        gender: 'female',
        recommended: { cancer: 7000, brain: 5000, heart: 5000, medical: 10000, death: 10000 }
    },
    // 40s Female
    {
        ageGroup: 40,
        gender: 'female',
        recommended: { cancer: 10000, brain: 7000, heart: 7000, medical: 10000, death: 15000 }
    },
    // 50s Female
    {
        ageGroup: 50,
        gender: 'female',
        recommended: { cancer: 10000, brain: 10000, heart: 10000, medical: 10000, death: 15000 }
    }
];

export const getStandardCoverage = (age: number, gender: 'male' | 'female'): CoverageData => {
    const ageGroup = Math.floor(age / 10) * 10;
    const data = STANDARD_DATA.find(d => d.ageGroup === ageGroup && d.gender === gender);
    const fallback = STANDARD_DATA.length > 2 ? STANDARD_DATA[2].recommended : STANDARD_DATA[0].recommended;
    return data ? data.recommended : fallback;
};

export const calculateGapScore = (user: CoverageData, standard: CoverageData): AnalysisResult => {
    let totalScore = 0;
    let gapCount = 0;
    const keys: (keyof CoverageData)[] = ['cancer', 'brain', 'heart', 'medical', 'death'];

    keys.forEach(key => {
        const userVal = user[key];
        const stdVal = standard[key];
        const ratio = Math.min(userVal / stdVal, 1); // Cap at 100%
        totalScore += ratio * 20; // 5 categories * 20 = 100
        if (ratio < 0.7) gapCount++;
    });

    return {
        score: Math.round(totalScore),
        gapCount
    };
};

export const getLifeStageAdvice = (age: number) => {
    if (age < 30) {
        return {
            title: "사회초년생: 가성비 중심 보장 설계",
            advice: "수입이 적은 시기이므로 저렴한 보험료로 큰 질병에 대비하는 실손보험과 암 진단비 위주의 설계가 중요합니다. 종신보험보다는 정기보험이나 뇌/심장 진단비를 실속 있게 챙기세요.",
            priority: ["실손 의료비", "암 진단비", "재해/상해"]
        };
    } else if (age < 50) {
        return {
            title: "가정의 기둥: 가족을 위한 책임 보장",
            advice: "가족의 생계를 책임지는 시기입니다. 본인의 유고 시 남겨진 가족을 위한 사망 보험금 및 큰 병에 걸렸을 때 치료와 소득 상실을 보전할 수 있는 고액 진단비 확보가 최우선입니다.",
            priority: ["사망 보험금", "2대 질병(뇌/심)", "가족 일상생활 배상책임"]
        };
    } else {
        return {
            title: "은퇴 준비기: 노후를 위한 집중 관리",
            advice: "은퇴 이후 병원비 지출이 급증하는 시기입니다. 갱신형보다는 비갱신형으로 납입을 마치고, 수술비나 간병인 지원금 등 노후에 실질적으로 도움이 되는 담보를 점검해야 합니다.",
            priority: ["수술비/간병비", "치매/장해", "연금/자산 보전"]
        };
    }
};

export const getActionPlan = (userState: UserState, financeState: { currentIncome: number; currentExpenses: number }, gapAnalysis: AnalysisResult, mode: 'insurance' | 'finance' = 'insurance') => {
    const plans = [];

    if (mode === 'insurance') {
        // 1. Insurance Gap Plan
        if (gapAnalysis.score < 60) {
            plans.push({
                icon: "🚨",
                title: "보장 공백 긴급 보완",
                desc: "현재 보장 점수가 매우 낮습니다. 우선순위가 높은 조기 진단비(암/뇌/심)부터 월 3~5만원대 실속형으로 긴급 보완이 필요합니다."
            });
        } else if (gapAnalysis.gapCount > 0) {
            plans.push({
                icon: "⚖️",
                title: "보장 밸런스 리모델링",
                desc: "전반적인 점수는 양호하나 특정 항목에 공백이 있습니다. 기존 보험의 중복되는 부분을 줄이고 부족한 항목으로 가성비 있게 전환하세요."
            });
        } else {
            plans.push({
                icon: "✅",
                title: "보장 유지 및 정기 점검",
                desc: "현재 보장은 완벽합니다. 무리한 추가 가입보다는 기존 계약을 잘 유지하고 2년마다 건강검진 결과에 맞춰 업데이트하세요."
            });
        }

        // Life-stage Action for Insurance
        if (userState.age >= 40) {
            plans.push({
                icon: "🏥",
                title: "노후 간병 및 수술비 대비",
                desc: "건강 상태가 변하기 전, 갱신이 없는 수술비나 간병인 지원금 담보를 미리 확보하여 노후 병원비 리스크를 제거하세요."
            });
        } else {
            plans.push({
                icon: "🛡️",
                title: "조기 진단 자산 확보",
                desc: "젊은 시기에 건강체 할인 등을 활용하여 고정된 진단비 자산을 최대한 저렴하게 확보하는 것이 유리합니다."
            });
        }
    } else {
        // 2. Financial Plan
        const savingsRate = ((financeState.currentIncome - financeState.currentExpenses) / (financeState.currentIncome || 1)) * 100;
        if (savingsRate < 20) {
            plans.push({
                icon: "💰",
                title: "현금흐름 개선 (저축률 제고)",
                desc: "현재 저축률이 낮아 경제적 자유 도달이 늦어지고 있습니다. 고정 지출을 10%만 절감하여 종잣돈 마련 속도를 1.5배 높이세요."
            });
        } else {
            plans.push({
                icon: "📈",
                title: "투자 포트폴리오 다각화",
                desc: "저축 여력은 훌륭합니다. 현금 비중이 너무 높지 않은지 점검하고, 배당주나 ETF 등 인플레이션을 방어할 수 있는 자산으로 배분하세요."
            });
        }

        // Life-stage Action for Finance
        if (userState.age < 40) {
            plans.push({
                icon: "🚀",
                title: "자기계발 및 소득 파이프라인 확장",
                desc: "젊은 시기에 보험보다 '인적 자본' 투자가 더 중요합니다. 소득을 높여 저축 절대 금액을 늘리는 데 집중하세요."
            });
        } else {
            plans.push({
                icon: "🏦",
                title: "자산 수명 연장 전략",
                desc: "은퇴가 가시화되는 시기에는 수익성보다는 안정성과 현금 흐름(Cash Flow) 위주로 자산을 재배치해야 합니다."
            });
        }
    }

    return plans;
};

export const getExpertCommentary = (userState: UserState, financeState: FinanceState, gapAnalysis: AnalysisResult, mode: 'insurance' | 'finance' = 'insurance') => {
    const isHighRisk = gapAnalysis.score < 50;

    if (mode === 'insurance') {
        return {
            executiveSummary: `귀하의 보험 보장 상태를 분석한 결과, ${isHighRisk ? '현재 주요 질병에 대한 노출도가 매우 높습니다. 조속한 보장 리모델링이 필수적입니다.' : '전반적으로 탄탄한 보장 체계를 갖추고 있으나, 연령 증가에 따른 세부 특약 보완이 권장됩니다.'}`,
            marketOutlook: "최근 비급여 의료 서비스 확대와 평균 수명 연장에 따라, 기존의 정액 진단비 보다는 실손 가치를 보존할 수 있는 수술비와 간병인 지원 금액의 중요성이 커지고 있습니다.",
            riskAnalysis: [
                { category: "암/질병 리스크", status: gapAnalysis.score > 70 ? "안정" : "주의", comment: "가장 빈번하게 발생하는 중대 질환에 대한 대비 수준을 나타냅니다." },
                { category: "사망/가족 리스크", status: userState.coverages.death > 10000 ? "양호" : "주의", comment: "경제 활동 중단 시 남겨진 가족의 생활권을 보호하기 위한 지표입니다." },
                { category: "노후/의료 리스크", status: userState.coverages.medical > 5000 ? "안정" : "보통", comment: "은퇴 후 급격히 늘어나는 의료비 지출에 대한 방어력을 의미합니다." }
            ]
        };
    } else {
        return {
            executiveSummary: `귀하의 재무 건전성을 진단한 결과, ${financeState.currentIncome - financeState.currentExpenses > 0 ? '자산 증식을 위한 기본 토대는 마련되어 있습니다. 이제 효율적인 자산 배분이 핵심입니다.' : '현재 현금 흐름 관리가 시급합니다. 소비 패턴 분석을 통한 저축 여력 확보가 선행되어야 합니다.'}`,
            marketOutlook: "글로벌 거시 경제의 변동성이 커지는 가운데, 예적금 중심의 안전 자산 보다는 인플레이션을 초과 달성할 수 있는 수익형 자산으로의 점진적 이동이 필요합니다.",
            riskAnalysis: [
                { category: "유동성 리스크", status: financeState.assets.cash > 1000 ? "안정" : "취약", comment: "예기치 못한 상황에 즉각 대응할 수 있는 비상 예비 자금의 충분 여부입니다." },
                { category: "장수 리스크", status: financeState.retirementAge - userState.age > 15 ? "보통" : "주의", comment: "은퇴 후 자산 소진 속도가 연장된 수명을 따라갈 수 있는지 분석한 결과입니다." },
                { category: "인플레이션 리스크", status: financeState.assets.stock > 1000 ? "보통" : "주의", comment: "화폐 가치 하락에 따라 실질 구매력이 감소하는 위협에 대한 방어 수준입니다." }
            ]
        };
    }
};

export const getStressTestResults = (financeState: FinanceState, mode: 'insurance' | 'finance' = 'insurance') => {
    if (mode === 'insurance') {
        return [
            { scenario: "중대 질병 동시 진단", impact: "가계 경제 일시 마비 (치료비+생활비)", measure: "진단비 중심의 3대 질환 집중 보완" },
            { scenario: "생애 최장 정기 건강검진", impact: "잠재적 질환 발견에 따른 가입 제한", measure: "건강할 때 비갱신형 위주의 장기 계약 확보" },
            { scenario: "비급여 의료비 본인부담 상향", impact: "실질 의료비 지출 30% 증가", measure: "수술비 담보 및 간병비 정액 지급 형태 강화" }
        ];
    } else {
        return [
            { scenario: "인플레이션 가속 (5%)", impact: "자산 실질 구매력 15% 하락", measure: "실물 자산 및 배당 중심 자산 비중 확대" },
            { scenario: "조기 은퇴 권고 (명예퇴직)", impact: "자산 형성 기간 5년 단축", measure: "즉시 연금화 가능한 유동성 자산 확보" },
            { scenario: "금리 변동 및 시장 하락", impact: "금융 자산 평가액 일시적 감소", measure: "포트폴리오 리밸런싱 및 분산 투자 강화" }
        ];
    }
};

