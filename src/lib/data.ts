import { StandardData } from "@/types";

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

export const getStandardCoverage = (age: number, gender: 'male' | 'female') => {
    const ageGroup = Math.floor(age / 10) * 10;
    const data = STANDARD_DATA.find(d => d.ageGroup === ageGroup && d.gender === gender);
    return data ? data.recommended : STANDARD_DATA[2].recommended; // Default to 40s Male if not found
};

export const calculateGapScore = (user: any, standard: any) => {
    let totalScore = 0;
    let gapCount = 0;
    const keys = ['cancer', 'brain', 'heart', 'medical', 'death'];

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
