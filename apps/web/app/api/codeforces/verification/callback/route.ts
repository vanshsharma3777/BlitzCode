import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";

export async function GET(request: NextRequest) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const clientId =
    process.env.CODEFORCES_CLIENT_ID;

  const clientSecret =
    process.env.CODEFORCES_CLIENT_SECRET;

  const redirectUri =
    process.env.CODEFORCES_REDIRECT_URI;

  if (
    !clientId ||
    !clientSecret ||
    !redirectUri
  ) {
    console.error(
      "Codeforces OAuth configuration is missing"
    );

    return failureRedirect(
      appUrl,
      "oauth_not_configured",
      "Codeforces verification is currently unavailable."
    );
  }

  const currentUrl = new URL(request.url);

  const callbackError =
    currentUrl.searchParams.get("error");

  const callbackErrorDescription =
    currentUrl.searchParams.get(
      "error_description"
    );

  if (callbackError) {
    console.log(
      "Codeforces OAuth error:",
      callbackError,
      callbackErrorDescription
    );

    if (callbackError === "access_denied") {
      return failureRedirect(
        appUrl,
        "authorization_cancelled",
        "Codeforces verification was cancelled."
      );
    }

    return failureRedirect(
      appUrl,
      "authorization_failed",
      "Codeforces authorization failed. Please try again."
    );
  }



  const state =
    request.cookies.get(
      "codeforces_oauth_state"
    )?.value;

  const nonce =
    request.cookies.get(
      "codeforces_oauth_nonce"
    )?.value;

  const codeVerifier =
    request.cookies.get(
      "codeforces_oauth_code_verifier"
    )?.value;

  const requestedUsername =
    request.cookies.get(
      "codeforces_verification_username"
    )?.value;
  if (!state) {
    return failureRedirect(
      appUrl,
      "verification_expired",
      "Your Codeforces verification session has expired. Please start again."
    );
  }

  if (!nonce) {
    return failureRedirect(
      appUrl,
      "verification_expired",
      "Your Codeforces verification session has expired. Please start again."
    );
  }

  if (!codeVerifier) {
    return failureRedirect(
      appUrl,
      "verification_expired",
      "Your Codeforces verification session has expired. Please start again."
    );
  }

  if (!requestedUsername) {
    return failureRedirect(
      appUrl,
      "verification_expired",
      "Your Codeforces verification session has expired. Please start again."
    );
  }

  let config;

  try {
    config = await oidc.discovery(
      new URL("https://codeforces.com"),
      clientId,
      clientSecret
    );
  } catch (error) {
    console.error(
      "Codeforces OIDC discovery failed:",
      error
    );

    return failureRedirect(
      appUrl,
      "provider_unavailable",
      "Could not connect to Codeforces. Please try again later."
    );
  }

  let tokens;

  try {
    tokens =
      await oidc.authorizationCodeGrant(
        config,
        currentUrl,
        {
          pkceCodeVerifier: codeVerifier,
          expectedState: state,
          expectedNonce: nonce,
          idTokenExpected: true,
        }
      );
  } catch (error) {
    console.error(
      "Codeforces authorization code exchange failed:",
      error
    );

    return failureRedirect(
      appUrl,
      "token_exchange_failed",
      "Could not complete Codeforces verification. Please try again."
    );
  }
  const claims = tokens.claims();

  if (!claims) {
    console.error(
      "Codeforces ID token claims are missing"
    );

    return failureRedirect(
      appUrl,
      "identity_missing",
      "Could not retrieve your Codeforces account information."
    );
  }

  console.log(
    "Codeforces ID token claims:",
    claims
  );

  const codeforcesUsername =
    typeof claims.handle === "string"
      ? claims.handle
      : null;

  const rating =
    typeof claims.rating === "number"
      ? claims.rating
      : null;

  const avatar =
    typeof claims.avatar === "string"
      ? claims.avatar
      : null;

  if (!codeforcesUsername) {
    console.error(
      "Codeforces handle missing from ID token"
    );

    return failureRedirect(
      appUrl,
      "identity_missing",
      "Could not identify your Codeforces account."
    );
  }


  const requested =
    requestedUsername.toLowerCase();

  const authenticated =
    codeforcesUsername.toLowerCase();

  if (requested !== authenticated) {
    console.log(
      `Codeforces account mismatch. Requested: ${requestedUsername}, Authenticated: ${codeforcesUsername}`
    );

    return failureRedirect(
      appUrl,
      "account_mismatch",
      `You authenticated as "${codeforcesUsername}", but you entered "${requestedUsername}". Please authenticate with the correct Codeforces account.`
    );
  }

  console.log(
    `Codeforces account verified: ${codeforcesUsername}`
  );

  const successUrl = new URL(
    "/profile",
    appUrl
  );

  successUrl.searchParams.set(
    "codeforces_verification",
    "success"
  );

  successUrl.searchParams.set(
    "username",
    codeforcesUsername
  );

  if (rating !== null) {
    successUrl.searchParams.set(
      "rating",
      String(rating)
    );
  }

  if (avatar) {
    successUrl.searchParams.set(
      "avatar",
      avatar
    );
  }

  const response =
    NextResponse.redirect(successUrl);

  clearOAuthCookies(response);

  return response;
}
function failureRedirect(
  appUrl: string,
  errorCode: string,
  message: string
) {
  const url = new URL(
    "/profile",
    appUrl
  );

  url.searchParams.set(
    "codeforces_verification",
    "failed"
  );

  url.searchParams.set(
    "error",
    errorCode
  );

  url.searchParams.set(
    "message",
    message
  );

  const response =
    NextResponse.redirect(url);

  clearOAuthCookies(response);

  return response;
}

function clearOAuthCookies(
  response: NextResponse
) {
  const cookies = [
    "codeforces_oauth_state",
    "codeforces_oauth_nonce",
    "codeforces_oauth_code_verifier",
    "codeforces_verification_username",
  ];

  for (const cookie of cookies) {
    response.cookies.set(
      cookie,
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      }
    );
  }
}