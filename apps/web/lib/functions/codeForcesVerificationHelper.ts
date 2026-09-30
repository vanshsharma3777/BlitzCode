export const getCodeforcesVerificationError = (
  errorCode: string | null
): string => {
  switch (errorCode) {
    case "authorization_cancelled":
      return "You cancelled Codeforces verification.";

    case "authorization_failed":
      return "Codeforces authorization failed. Please try again.";

    case "verification_expired":
      return "Your verification session expired. Please start again.";

    case "provider_unavailable":
      return "Codeforces is currently unavailable. Please try again later.";

    case "token_exchange_failed":
      return "Could not complete Codeforces verification. Please try again.";

    case "identity_missing":
      return "Could not identify your Codeforces account.";

    case "account_mismatch":
      return "The Codeforces account you authorized does not match the handle you entered.";

    case "oauth_not_configured":
      return "Codeforces verification is not configured correctly.";

    default:
      return "Codeforces verification failed. Please try again.";
  }
};