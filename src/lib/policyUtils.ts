import { PolicyRisk } from "@/types";

export function analyzePolicyRisks(text: string): PolicyRisk[] {
    const risks: PolicyRisk[] = [];

    // Normalize text for easier matching
    const normalizedText = text.replace(/\s+/g, ' ');

    // 1. Exclusions (면책)
    if (normalizedText.includes("면책") || normalizedText.includes("지급하지 않는") || normalizedText.includes("보장개시일")) {
        // Check specifics
        if (normalizedText.includes("90일")) {
            risks.push({
                id: "risk-exclusion-90",
                title: "면책 기간 존재 (90일)",
                description: "가입 후 90일 이내 진단 시 보험금이 전혀 지급되지 않을 수 있습니다.",
                level: "critical",
                clauseSnippet: "계약일로부터 90일 지난 날의 다음날부터 보장"
            });
        } else {
            risks.push({
                id: "risk-exclusion-general",
                title: "면책 사유 주의",
                description: "약관에 '보험금을 지급하지 않는 사유'가 포함되어 있습니다. 꼼꼼한 확인이 필요합니다.",
                level: "warning",
                clauseSnippet: "회사는 다음 중 어느 한가지의 경우에 의하여 보험금 지급사유가 발생한 때에는 보험금을 지급하지 않습니다"
            });
        }
    }

    // 2. Reductions (감액)
    if (normalizedText.includes("감액") || normalizedText.includes("50% 지급") || normalizedText.includes("1년 미만")) {
        risks.push({
            id: "risk-reduction-year",
            title: "감액 지급 기간 (1년 미만)",
            description: "가입 후 1년(또는 2년) 이내 진단 시 가입 금액의 50%만 지급될 수 있습니다.",
            level: "warning",
            clauseSnippet: "1년 미만 진단 확정 시 해당 보험금의 50% 지급"
        });
    }

    // 3. Renewals (갱신형)
    if (normalizedText.includes("갱신형") || normalizedText.includes("점차 증가") || normalizedText.includes("변동될 수")) {
        risks.push({
            id: "risk-renewal",
            title: "갱신형 특약 포함",
            description: "향후 연령 증가 및 위험률 변동에 따라 보험료가 인상될 수 있는 갱신형 담보가 포함되어 있습니다.",
            level: "info",
            clauseSnippet: "이 특약은 갱신형으로 갱신 시 보험료가 인상될 수 있습니다"
        });
    }

    // 4. CI/Critical Illness specific (중대한)
    if (normalizedText.includes("중대한") && (normalizedText.includes("치명적") || normalizedText.includes("영구적"))) {
        risks.push({
            id: "risk-ci-definition",
            title: "까다로운 지급 조건 (CI)",
            description: "'중대한' 질병 정의에 부합해야만 지급되므로 일반적인 진단보다 조건이 까다로울 수 있습니다.",
            level: "critical",
            clauseSnippet: "중대한 암이라 함은..."
        });
    }

    return risks;
}
