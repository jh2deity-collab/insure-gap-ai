import { HealthMetrics, HealthRisk } from "@/types";

/**
 * Calculates health risks based on medical metrics and family history.
 * returns a list of risks categorized by coverage areas.
 */
export function calculateHealthRisks(metrics: HealthMetrics): HealthRisk[] {
    const risks: HealthRisk[] = [];

    // 1. Heart & Brain (Cardiovascular Risks)
    let heartRisk = 0;
    let brainRisk = 0;
    let heartReasons: string[] = [];
    let brainReasons: string[] = [];

    // Blood Pressure check
    if (metrics.bloodPressure.systolic >= 140 || metrics.bloodPressure.diastolic >= 90) {
        heartRisk += 40;
        brainRisk += 50;
        heartReasons.push("고혈압 징후 관찰 (심혈관 질환 위험 증가)");
        brainReasons.push("고혈압 징후 관찰 (뇌혈관 질환 위험 증가)");
    } else if (metrics.bloodPressure.systolic >= 130) {
        heartRisk += 20;
        brainRisk += 20;
        heartReasons.push("주의 혈압 단계");
    }

    // BMI check
    if (metrics.bmi >= 30) {
        heartRisk += 30;
        heartReasons.push("비만 단계 (심장 부담 증가)");
    } else if (metrics.bmi >= 25) {
        heartRisk += 15;
        heartReasons.push("과체중 단계");
    }

    // Smoking
    if (metrics.smoking) {
        heartRisk += 20;
        brainRisk += 20;
        heartReasons.push("흡연 (심혈관 건강 악화 요인)");
        brainReasons.push("흡연 (뇌졸중 위험 증가)");
    }

    // Family History - Heart/Brain
    if (metrics.familyHistory.includes('heart')) {
        heartRisk += 30;
        heartReasons.push("심장 질환 가족력 보유");
    }
    if (metrics.familyHistory.includes('brain')) {
        brainRisk += 30;
        brainReasons.push("뇌혈관 질환 가족력 보유");
    }

    if (heartRisk > 0) {
        risks.push({
            category: 'heart',
            riskLevel: Math.min(100, heartRisk),
            reason: heartReasons.join(", ")
        });
    }

    if (brainRisk > 0) {
        risks.push({
            category: 'brain',
            riskLevel: Math.min(100, brainRisk),
            reason: brainReasons.join(", ")
        });
    }

    // 2. Cancer
    let cancerRisk = 0;
    let cancerReasons: string[] = [];

    if (metrics.familyHistory.includes('cancer')) {
        cancerRisk += 50;
        cancerReasons.push("암 가족력 보유 (유전적 요인 고려 필요)");
    }

    if (metrics.smoking) {
        cancerRisk += 20;
        cancerReasons.push("흡연 (폐암 및 각종 암 발병률 증가)");
    }

    if (cancerRisk > 0) {
        risks.push({
            category: 'cancer',
            riskLevel: Math.min(100, cancerRisk),
            reason: cancerReasons.join(", ")
        });
    }

    // 3. Medical/Life (General Metabolic risk)
    if (metrics.glucose >= 126) {
        risks.push({
            category: 'medical',
            riskLevel: 40,
            reason: "공복혈당 높음 (당뇨 관련 합병증 주의)"
        });
    }

    return risks;
}
