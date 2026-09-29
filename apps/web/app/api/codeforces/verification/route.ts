import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username = body?.username?.trim();

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "Codeforces handle is required",
        },
        { status: 400 }
      );
    }

    const clientId = process.env.CODEFORCES_CLIENT_ID;
    const clientSecret = process.env.CODEFORCES_CLIENT_SECRET;
    const redirectUri = process.env.CODEFORCES_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error(
        "Missing Codeforces OAuth environment variables"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Codeforces OAuth is not configured",
        },
        { status: 500 }
      );
    }

    const config = await oidc.discovery(
      new URL("https://codeforces.com"),
      clientId,
      clientSecret
    );

    const codeVerifier =
      oidc.randomPKCECodeVerifier();

    const codeChallenge =
      await oidc.calculatePKCECodeChallenge(
        codeVerifier
      );

    const state = oidc.randomState();

    const nonce = oidc.randomNonce();

    const authorizationUrl =
      oidc.buildAuthorizationUrl(config, {
        redirect_uri: redirectUri,
        scope: "openid",

        response_type: "code",

        code_challenge: codeChallenge,
        code_challenge_method: "S256",

        state,
        nonce,
      });

    const response = NextResponse.json({
      success: true,
      authorizationUrl: authorizationUrl.href,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 10 * 60,
      path: "/",
    };

    response.cookies.set(
      "codeforces_oauth_state",
      state,
      cookieOptions
    );

    response.cookies.set(
      "codeforces_oauth_nonce",
      nonce,
      cookieOptions
    );

    response.cookies.set(
      "codeforces_oauth_code_verifier",
      codeVerifier,
      cookieOptions
    );

    response.cookies.set(
      "codeforces_verification_username",
      username,
      cookieOptions
    );

    return response;
  } catch (error) {
    console.error(
      "Failed to start Codeforces verification:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to start Codeforces verification",
      },
      { status: 500 }
    );
  }
}