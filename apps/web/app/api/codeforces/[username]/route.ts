import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { redis } from "../../../../lib/configs/redis";
const CODEFORCES_API = "https://codeforces.com/api";

const CACHE_TTL = 60 * 30; // 30 minutes

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
          error: "Codeforces username is required",
        },
        { status: 400 }
      );
    }

    const handle = username.trim();

    if (!handle) {
      return NextResponse.json(
        {
          success: false,
          error: "Codeforces username is required",
        },
        { status: 400 }
      );
    }


    const cacheKey = `codeforces:${handle.toLowerCase()}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
        },
      });
    }


    const [userResponse, ratingResponse, submissionsResponse] =
      await Promise.all([
        axios.get(`${CODEFORCES_API}/user.info`, {
          params: {
            handles: handle,
          },
          timeout: 10000,
        }),

        axios.get(`${CODEFORCES_API}/user.rating`, {
          params: {
            handle: handle,
          },
          timeout: 10000,
        }),

        axios.get(`${CODEFORCES_API}/user.status`, {
          params: {
            handle: handle,
            from: 1,
            count: 1000,
          },
          timeout: 10000,
        }),
      ]);



    if (userResponse.data.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          error:
            userResponse.data.comment ||
            "Codeforces user not found",
        },
        { status: 404 }
      );
    }

    if (ratingResponse.data.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          error:
            ratingResponse.data.comment ||
            "Failed to fetch Codeforces rating",
        },
        { status: 502 }
      );
    }

    if (submissionsResponse.data.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          error:
            submissionsResponse.data.comment ||
            "Failed to fetch Codeforces submissions",
        },
        { status: 502 }
      );
    }

    const user = userResponse.data.result[0];
    const ratingHistory = ratingResponse.data.result;
    const submissions = submissionsResponse.data.result;


    const solvedProblems = new Set<string>();

    let acceptedSubmissions = 0;

    for (const submission of submissions) {
      if (submission.verdict === "OK") {
        acceptedSubmissions++;

        const problem = submission.problem;

        const problemKey =
          `${problem.contestId ?? "gym"}-${problem.index}`;

        solvedProblems.add(problemKey);
      }
    }

    const totalSubmissions = submissions.length;

    const contestCount = ratingHistory.length;

    const latestRating =
      ratingHistory.length > 0
        ? ratingHistory[ratingHistory.length - 1]
        : null;

    const highestRating =
      ratingHistory.length > 0
        ? Math.max(
            ...ratingHistory.map(
              (contest: { newRating: number }) =>
                contest.newRating
            )
          )
        : user.maxRating ?? 0;



    const responseData = {
      success: true,

      data: {
        profile: {
          handle: user.handle,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          country: user.country ?? null,
          city: user.city ?? null,
          organization: user.organization ?? null,
          contribution: user.contribution ?? 0,

          rank: user.rank ?? null,
          rating: user.rating ?? null,

          maxRank: user.maxRank ?? null,
          maxRating: user.maxRating ?? null,

          avatar: user.avatar,
          titlePhoto: user.titlePhoto,

          registrationTime: user.registrationTimeSeconds,
          lastOnlineTime: user.lastOnlineTimeSeconds,
          friendOfCount: user.friendOfCount ?? 0,
        },

        stats: {
          solvedProblems: solvedProblems.size,
          acceptedSubmissions,
          totalSubmissions,

          contestsParticipated: contestCount,

          highestRating,

          currentRating:
            user.rating ?? latestRating?.newRating ?? null,
        },

        ratingHistory,

        recentSubmissions: submissions.slice(0, 20),
      },
    };



    await redis.set(cacheKey, responseData, {
      ex: CACHE_TTL,
    });

    return NextResponse.json(responseData, {
      headers: {
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Codeforces Axios Error:",
        error.response?.data || error.message
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to contact Codeforces",
          details:
            error.response?.data || error.message,
        },
        {
          status: error.response?.status || 502,
        }
      );
    }

    console.error("Codeforces API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}