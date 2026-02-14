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

export const getMarketBenchmarking = (userAge: number, mode: 'insurance' | 'finance') => {
    if (mode === 'insurance') {
        const standard = getStandardCoverage(userAge, 'male'); // Default to male for baseline
        return {
            top10: {
                cancer: standard.cancer * 1.5,
                brain: standard.brain * 1.5,
                heart: standard.heart * 1.5,
                medical: standard.medical,
                death: standard.death * 2
            },
            average: standard
        };
    } else {
        return {
            top10: {
                savingsRate: 45,
                assetGrowth: 8,
                investmentRatio: 60
            },
            average: {
                savingsRate: 25,
                assetGrowth: 4,
                investmentRatio: 30
            }
        };
    }
};

export const getActionPlan = (userState: UserState, financeState: FinanceState, gapAnalysis: AnalysisResult, mode: 'insurance' | 'finance' = 'insurance') => {
    const roadmap = {
        shortTerm: { title: "단기 과제 (1~6개월)", items: [] as any[] },
        midTerm: { title: "중기 과제 (6개월~2년)", items: [] as any[] },
        longTerm: { title: "장기 과제 (2년 이후)", items: [] as any[] }
    };

    if (mode === 'insurance') {
        // Short Term
        if (gapAnalysis.score < 60) {
            roadmap.shortTerm.items.push({ icon: "🚨", title: "주요 진단비 긴급 보완", desc: "암/뇌/심 진단비가 표준 대비 현저히 낮습니다. 가성비 높은 무해지 상품으로 즉시 보완하세요." });
        } else {
            roadmap.shortTerm.items.push({ icon: "🔍", title: "기존 증권 분석 및 중복 제거", desc: "중복된 실손이나 불필요한 특약을 정리하여 보험료 누수를 차단하세요." });
        }

        // Mid Term
        roadmap.midTerm.items.push({ icon: "🏥", title: "수술비 및 간병인 담보 확보", desc: "진단비 이후의 치료 효율을 높이기 위해 수술비와 간병인 지원 특약을 비갱신형으로 준비하세요." });

        // Long Term
        roadmap.longTerm.items.push({ icon: "🛡️", title: "노후 자산 보전 전략 수립", desc: "70세 이후 치료비 급증기에 대비하여 저강도 납입형 간병 보험 등을 장기적으로 검토하세요." });
    } else {
        const savingsRate = ((financeState.currentIncome - financeState.currentExpenses) / (financeState.currentIncome || 1)) * 100;

        // Short Term
        if (savingsRate < 30) {
            roadmap.shortTerm.items.push({ icon: "💳", title: "지출 구조 혁신 (CASH FLOW)", desc: "고정 지출을 재점검하여 저축률을 최소 30% 이상으로 끌어올리는 체질 개선이 시급합니다." });
        } else {
            roadmap.shortTerm.items.push({ icon: "💰", title: "비상 예비 자금 확보", desc: "월 지출액의 3~6배 수준을 상시 인출 가능한 모바일 통장에 예치하세요." });
        }

        // Mid Term
        roadmap.midTerm.items.push({ icon: "📈", title: "적립식 포트폴리오 다각화", desc: "S&P500 등 지수 추종 ETF와 배당 성장주 비중을 점진적으로 50%까지 증대하세요." });

        // Long Term
        roadmap.longTerm.items.push({ icon: "🧘", title: "경제적 자유(FIRE) 시뮬레이션", desc: "자산 수명과 인플레이션을 고려하여 은퇴 시점의 인출 전략(4% Rule)을 정교화하세요." });
    }

    return roadmap;
};

export const getExpertCommentary = (userState: UserState, financeState: FinanceState, gapAnalysis: AnalysisResult, mode: 'insurance' | 'finance' = 'insurance') => {
    const isHighRisk = gapAnalysis.score < 50;
    const benchmarks = getMarketBenchmarking(userState.age, mode);

    if (mode === 'insurance') {
        return {
            executiveSummary: `귀하의 보험 보장 상태를 분석한 결과, ${isHighRisk ? '현재 주요 질병에 대한 노출도가 매우 높습니다. 조속한 보장 리모델링이 필수적입니다.' : '전반적으로 탄탄한 보장 체계를 갖추고 있으나, 연령 증가에 따른 세부 특약 보완이 권장됩니다.'}`,
            marketOutlook: "최근 비급여 의료 서비스 확대와 평균 수명 연장에 따라, 기존의 정액 진단비 보다는 실손 가치를 보존할 수 있는 수술비와 간병인 지원 금액의 중요성이 커지고 있습니다.",
            riskAnalysis: [
                { category: "암/질병 리스크", status: gapAnalysis.score > 70 ? "안정" : "주의", comment: "상위 10% 모델 대비 진단비 확보 수준이 60% 이하로 나타납니다." },
                { category: "사망/가족 리스크", status: userState.coverages.death > 10000 ? "양호" : "주의", comment: "가장으로서의 책임 보장 자산이 물가 상승률을 충분히 반영하고 있습니다." },
                { category: "노후/의료 리스크", status: userState.coverages.medical > 5000 ? "안정" : "보통", comment: "은퇴 후 병원비 지출 급증기에 대한 유동성 대책이 추가로 필요합니다." }
            ],
            benchmarks
        };
    } else {
        const savingsRate = ((financeState.currentIncome - financeState.currentExpenses) / (financeState.currentIncome || 1)) * 100;
        return {
            executiveSummary: `귀하의 재무 건전성을 진단한 결과, ${financeState.currentIncome - financeState.currentExpenses > 0 ? '자산 증식을 위한 기본 토대는 마련되어 있습니다. 이제 효율적인 자산 배분이 핵심입니다.' : '현재 현금 흐름 관리가 시급합니다. 소비 패턴 분석을 통한 저축 여력 확보가 선행되어야 합니다.'}`,
            marketOutlook: "글로벌 거시 경제의 변동성이 커지는 가운데, 예적금 중심의 안전 자산 보다는 인플레이션을 초과 달성할 수 있는 수익형 자산으로의 점진적 이동이 필요합니다.",
            riskAnalysis: [
                { category: "유동성 리스크", status: financeState.assets.cash > 1000 ? "안정" : "취약", comment: "비상시 대응 가능한 현금성 자산 비중이 건강한 수준을 유지 중입니다." },
                { category: "장수 리스크", status: financeState.retirementAge - userState.age > 15 ? "보통" : "주의", comment: "은퇴 후 30년 이상의 생존 기간에 대한 자본 소득 구조가 미흡합니다." },
                { category: "인플레이션 리스크", status: (financeState.assets.stock || 0) > 1000 ? "보통" : "주의", comment: "실물 가치 방어 자산(주식/부동산) 대비 현금 비중이 과도하게 높습니다." }
            ],
            benchmarks
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

