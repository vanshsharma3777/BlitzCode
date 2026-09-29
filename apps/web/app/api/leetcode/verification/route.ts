import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { redis } from "../../../../lib/configs/redis";

const VERIFICATION_TTL = 60 * 15;

const verificationQuery = `
  query VerifyLeetCodeUser($username: String!) {
    matchedUser(username: $username) {
      username

      profile {
        aboutMe
      }
    }
  }
`;

async function getLeetCodeAboutMe(username: string) {
  const response = await axios.post(
    process.env.LEETCODE_GRAPHQL_URL!   ,
    {
      query: verificationQuery,
      variables: { username },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  const result = response.data;

  if (result.errors) {
    throw new Error("LeetCode API error");
  }

  return {
    username: result.data?.matchedUser?.username,
    aboutMe: result.data?.matchedUser?.profile?.aboutMe ?? "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const { action, username } = await request.json();

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "LeetCode username is required",
        },
        { status: 400 }
      );
    }

    const key = `leetcode:verification:${username}`;

    if (action === "generate") {
      const token = `BLITZ-${crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase()}`;

      await redis.set(
        key,
        {
          token,
          username,
        },
        {
          ex: VERIFICATION_TTL,
        }
      );

      return NextResponse.json({
        success: true,
        token,
        expiresIn: VERIFICATION_TTL,
      });
    }

    if (action === "verify") {
      const verification = await redis.get<{
        token: string;
        username: string;
      }>(key);

      if (!verification) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Verification token expired.",
          },
          { status: 400 }
        );
      }

      const profile = await getLeetCodeAboutMe(username);

      if (!profile.username) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "LeetCode user not found.",
          },
          { status: 404 }
        );
      }

      const verified = profile.aboutMe.includes(
        verification.token
      );

      if (!verified) {
        return NextResponse.json({
          success: false,
          verified: false,
          error: "Verification token not found.",
        });
      }

      await redis.del(key);

      return NextResponse.json({
        success: true,
        verified: true,
        username: profile.username,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("LeetCode verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      { status: 500 }
    );
  }
}