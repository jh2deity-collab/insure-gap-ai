import { CoverageData, DietRecommendation } from "@/types";

/**
 * Identifies over-coverage and provides reduction recommendations.
 */
export function calculateDietRecommendations(
    userCoverages: CoverageData,
    standardData: CoverageData
): DietRecommendation[] {
    const recommendations: DietRecommendation[] = [];

    // Premium Estimation Constants (simplified per ₩1,000,000 coverage)
    const premiumRates: Record<string, number> = {
        cancer: 120,    // ₩120 per ₩1M
        brain: 150,     // ₩150 per ₩1M
        heart: 150,     // ₩150 per ₩1M
        death: 40,      // ₩40 per ₩1M
        medical: 2      // ₩2 per ₩1M (indemnity is flat, but for simulation)
    };

    Object.entries(userCoverages).forEach(([key, amount]) => {
        const cat = key as keyof CoverageData;
        const standard = standardData[cat];

        if (standard <= 0) return;

        // Rule 1: Over-coverage (Over 150% of standard)
        if (amount > standard * 1.5) {
            const target = Math.round(standard * 1.1); // Diet goal: 110% of standard
            const reductionAmount = amount - target;

            // Calculate Savings: (Reduction / 1,000,000) * Rate
            const savings = Math.round((reductionAmount / 100) * (premiumRates[cat] || 100));

            recommendations.push({
                category: cat,
                currentAmount: amount,
                targetAmount: target,
                savingsPotential: savings,
                reason: `권장 수준(${standard.toLocaleString()}만원) 대비 ${((amount / standard) * 100).toFixed(0)}%로 과도하게 가입되어 있습니다.`,
                priority: amount > standard * 2 ? 'high' : 'medium'
            });
        }
    });

    // Rule 2: Multiple Medical Indemnity (Specific logic for 'medical')
    // In real life, indemnity pays proportionally. Having multiple is purely waste.
    if (catIsMedical(userCoverages) && userCoverages.medical > 1) {
        // This is a mockup since our data structure treats medical as 'amount'
        // Let's assume if it's over 10000, it's possibly redundant or high limit.
        // But for this simulation, we check for flag-like behavior if we had multiple items.
    }

    return recommendations;
}

function catIsMedical(coverages: CoverageData): boolean {
    return 'medical' in coverages;
}
