export interface LeetCodeData {
    username: string;

    profile: {
        realName: string | null;
        userAvatar: string;
        aboutMe: string | null;
        school: string | null;
        websites: string[];
        countryName: string | null;
        company: string | null;
        jobTitle: string | null;
        location: string | null;
        skillTags: string[];
        postViewCount: number;
        ranking: number;
        reputation: number;
    };

    stats: {
        submissions: {
            acSubmissionNum: {
                difficulty: string;
                count: number;
                submissions: number;
            }[];

            totalSubmissionNum: {
                difficulty: string;
                count: number;
                submissions: number;
            }[];
        };

        calendar: {
            activeYears: number[];
            streak: number;
            totalActiveDays: number;
            submissionCalendar: string;
        };

        languages: {
            languageName: string;
            problemsSolved: number;
        }[];
    };

    badges: {
        id: string;
        displayName: string;
        icon: string;
        creationDate: string;
    }[];

    contest: {
        attendedContestsCount: number;
        rating: number;
        globalRanking: number;
        totalParticipants: number;
        topPercentage: number;
    } | null;

    contestHistory: {
        attended: boolean;
        rating: number;
        ranking: number;
    }[];

    recentSubmissions: {
        id: string;
        title: string;
        titleSlug: string;
        timestamp: string;
        lang: string;
    }[];
}