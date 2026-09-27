import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { redis } from "../../../../lib/configs/redis";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql/";

const CACHE_TTL = 60 * 30; // 30 minutes

const query = `
  query BlitzCodeLeetCodeProfile(
    $username: String!
    $year: Int
  ) {
    matchedUser(username: $username) {
      username

      profile {
        realName
        userAvatar
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        location
        skillTags
        postViewCount
        ranking
        reputation
      }

      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }

        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }

      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }

      badges {
        id
        displayName
        icon
        creationDate
      }

      languageProblemCount {
        languageName
        problemsSolved
      }
    }

    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }

    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
    }

    recentAcSubmissionList(
      username: $username
      limit: 20
    ) {
      id
      title
      titleSlug
      timestamp
      lang
    }
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        if (!username) {
            return NextResponse.json(
                {
                    success: false,
                    error: "LeetCode username is required",
                },
                { status: 400 }
            );
        }

        const year = new Date().getFullYear();

        /*
         * Redis cache key
         */
        const cacheKey = `leetcode:${username}:${year}`;

        /*
         * Check Redis first
         */
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log(`Redis HIT: ${cacheKey}`);

            return NextResponse.json(cachedData, {
                headers: {
                    "X-Cache": "HIT",
                },
            });
        }

        console.log(`Redis MISS: ${cacheKey}`);

        /*
         * Fetch from LeetCode
         */
        const response = await axios.post(
            LEETCODE_GRAPHQL_URL,
            {
                query,
                variables: {
                    username,
                    year,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

        const result = response.data;

        /*
         * GraphQL errors
         */
        if (result.errors) {
            console.error(
                "LeetCode GraphQL Error:",
                result.errors
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "LeetCode API returned an error",
                    details: result.errors,
                },
                { status: 502 }
            );
        }

        const data = result.data;

        /*
         * User not found
         */
        if (!data?.matchedUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "LeetCode user not found",
                },
                { status: 404 }
            );
        }

        /*
         * Build BlitzCode response
         */
        const responseData = {
            success: true,

            data: {
                username: data.matchedUser.username,

                profile: data.matchedUser.profile,

                stats: {
                    submissions:
                        data.matchedUser.submitStatsGlobal,

                    calendar:
                        data.matchedUser.userCalendar,

                    languages:
                        data.matchedUser.languageProblemCount,
                },

                badges: data.matchedUser.badges,

                contest:
                    data.userContestRanking,

                contestHistory:
                    data.userContestRankingHistory,

                recentSubmissions:
                    data.recentAcSubmissionList,
            },
        };

        /*
         * Store in Upstash Redis
         *
         * EX = expiration time in seconds
         */
        await redis.set(
            cacheKey,
            responseData,
            {
                ex: CACHE_TTL,
            }
        );

        console.log(
            `Redis SET: ${cacheKey} (${CACHE_TTL}s)`
        );

        return NextResponse.json(
            responseData,
            {
                headers: {
                    "X-Cache": "MISS",
                },
            }
        );

    } catch (error) {

        if (axios.isAxiosError(error)) {

            console.error(
                "LeetCode Axios Error:",
                error.response?.data || error.message
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to contact LeetCode",
                    details:
                        error.response?.data ||
                        error.message,
                },
                {
                    status:
                        error.response?.status || 502,
                }
            );
        }

        console.error(
            "LeetCode API Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
            },
            { status: 500 }
        );
    }
}