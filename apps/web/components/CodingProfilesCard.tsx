"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import LeetCodeCard from "./atoms/LeetcodeCodingCard";
import CodeforcesCard from "./atoms/CodeforcesCodingCard";

interface CodingProfilesCardProps {
  userEmail?: string | null;
}

export default function CodingProfilesCard({
  userEmail,
}: CodingProfilesCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expandedProfile, setExpandedProfile] = useState<
    "leetcode" | "codeforces" | null
  >(null);

  const [savedLeetcodeUsername, setSavedLeetcodeUsername] = useState("");
  const [leetcodeConnected, setLeetcodeConnected] = useState(false);

  const [savedCodeforcesUsername, setSavedCodeforcesUsername] = useState("");
  const [codeforcesLoading, setCodeforcesLoading] = useState(false);
  const [codeforcesError, setCodeforcesError] = useState("");
  const [codeforcesConnected, setCodeforcesConnected] = useState(false);

  useEffect(() => {
    const lcUsername = localStorage.getItem("blitzcode_leetcode_username");
    if (lcUsername) {
      setSavedLeetcodeUsername(lcUsername);
      setLeetcodeConnected(true);
    }

    const cfUsername = localStorage.getItem("blitzcode_codeforces_username");
    if (cfUsername) {
      setSavedCodeforcesUsername(cfUsername);
      setCodeforcesConnected(true);
    }
  }, []);

  useEffect(() => {
    const verification = searchParams.get("codeforces_verification");
    if (!verification) return;

    if (verification === "success") {
      const verifiedUsername = searchParams.get("username");

      if (!verifiedUsername) {
        setCodeforcesError(
          "Codeforces verification succeeded, but the account information was missing."
        );
        setCodeforcesLoading(false);
        setExpandedProfile(null);
        return;
      }

      localStorage.setItem("blitzcode_codeforces_username", verifiedUsername);
      setSavedCodeforcesUsername(verifiedUsername);
      setCodeforcesConnected(true);
      setCodeforcesError("");
      setCodeforcesLoading(false);
      setExpandedProfile(null);

      router.replace("/profile");
      return;
    }

    if (verification === "failed") {
      const error = searchParams.get("error");
      const message = searchParams.get("message");

      switch (error) {
        case "authorization_cancelled":
          setCodeforcesError("You cancelled Codeforces verification.");
          break;
        case "account_mismatch":
          setCodeforcesError(
            "The Codeforces account you authorized does not match the handle you entered."
          );
          break;
        case "verification_expired":
          setCodeforcesError(
            "Your verification session expired. Please start again."
          );
          break;
        case "provider_unavailable":
          setCodeforcesError(
            "Codeforces is currently unavailable. Please try again later."
          );
          break;
        case "token_exchange_failed":
          setCodeforcesError(
            "Could not complete Codeforces verification. Please try again."
          );
          break;
        case "identity_missing":
          setCodeforcesError("Could not identify your Codeforces account.");
          break;
        case "oauth_not_configured":
          setCodeforcesError(
            "Codeforces verification is not configured correctly."
          );
          break;
        case "authorization_failed":
          setCodeforcesError(
            "Codeforces authorization failed. Please try again."
          );
          break;
        default:
          setCodeforcesError(
            message || "Codeforces verification failed. Please try again."
          );
      }

      setCodeforcesLoading(false);
      setCodeforcesConnected(false);
      setExpandedProfile(null);

      router.replace("/profile");
    }
  }, [searchParams, router]);

  const getApiError = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        fallback
      );
    }

    if (error instanceof Error) {
      return error.message || fallback;
    }

    return fallback;
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
      <LeetCodeCard
        isExpanded={expandedProfile === "leetcode"}
        isOtherExpanded={expandedProfile === "codeforces"}
        savedUsername={savedLeetcodeUsername}
        setSavedUsername={setSavedLeetcodeUsername}
        isConnected={leetcodeConnected}
        setIsConnected={setLeetcodeConnected}
        onExpand={() => setExpandedProfile("leetcode")}
        onBack={() => setExpandedProfile(null)}
        getApiError={getApiError}
      />

      <CodeforcesCard
        isExpanded={expandedProfile === "codeforces"}
        isOtherExpanded={expandedProfile === "leetcode"}
        savedUsername={savedCodeforcesUsername}
        setSavedUsername={setSavedCodeforcesUsername}
        isConnected={codeforcesConnected}
        setIsConnected={setCodeforcesConnected}
        error={codeforcesError}
        setError={setCodeforcesError}
        loading={codeforcesLoading}
        setLoading={setCodeforcesLoading}
        onExpand={() => setExpandedProfile("codeforces")}
        onBack={() => setExpandedProfile(null)}
        getApiError={getApiError}
      />
    </div>
  );
}