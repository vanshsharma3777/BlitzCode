"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ExternalLink,
  Loader2,
  Link as LinkIcon,
  Check,
  Code,
  Copy,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";

type LeetCodeVerificationStep =
  | "idle"
  | "pending"
  | "verifying"
  | "error";

interface LeetCodeCardProps {
  isExpanded: boolean;
  isOtherExpanded: boolean;
  savedUsername: string;
  setSavedUsername: (val: string) => void;
  isConnected: boolean;
  setIsConnected: (val: boolean) => void;
  onExpand: () => void;
  onBack: () => void;
  getApiError: (error: unknown, fallback: string) => string;
}

export default function LeetCodeCard({
  isExpanded,
  isOtherExpanded,
  savedUsername,
  setSavedUsername,
  isConnected,
  setIsConnected,
  onExpand,
  onBack,
  getApiError,
}: LeetCodeCardProps) {
  const router = useRouter();

  const [username, setUsername] = useState(savedUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [verificationStep, setVerificationStep] =
    useState<LeetCodeVerificationStep>("idle");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAdd = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Enter your LeetCode username");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError("");
      onExpand();

      const profileResponse = await axios.get(
        `/api/leetcode/${encodeURIComponent(trimmedUsername)}`,
        {
          validateStatus: () => true,
        }
      );

      const profileData = profileResponse.data;

      if (!profileData?.success) {
        setError(
          profileData?.error ||
            profileData?.message ||
            "Could not find this LeetCode profile."
        );
        onBack();
        return;
      }

      const actualUsername = profileData?.data?.username;

      if (!actualUsername) {
        setError("LeetCode profile response is missing the username.");
        onBack();
        return;
      }

      const verificationResponse = await axios.post(
        "/api/leetcode/verification",
        {
          action: "generate",
          username: actualUsername,
        },
        {
          validateStatus: () => true,
        }
      );

      const verificationData = verificationResponse.data;

      if (!verificationData?.success) {
        setError(
          verificationData?.error ||
            verificationData?.message ||
            "Could not generate verification token."
        );
        onBack();
        return;
      }

      const genToken = verificationData?.token;

      if (!genToken) {
        setError("Verification token was not returned by the server.");
        onBack();
        return;
      }

      setUsername(actualUsername);
      setToken(genToken);
      setVerificationStep("pending");
    } catch (err) {
      console.error("Failed to start LeetCode verification:", err);
      setError(
        getApiError(
          err,
          "Something went wrong while starting LeetCode verification."
        )
      );
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("LeetCode username is missing.");
      return;
    }

    if (!token) {
      setError(
        "Verification token is missing. Please restart verification."
      );
      return;
    }

    try {
      setVerificationStep("verifying");
      setError("");

      const response = await axios.post("/api/leetcode/verification", {
        action: "verify",
        username: trimmedUsername,
      });

      if (!response.data?.success) {
        setError(
          response.data?.error ||
            response.data?.message ||
            "Verification failed."
        );
        setVerificationStep("pending");
        return;
      }

      if (!response.data?.verified) {
        setError(
          response.data?.error ||
            response.data?.message ||
            "Verification failed. Make sure you added the verification code to your LeetCode profile."
        );
        setVerificationStep("pending");
        return;
      }

      const verifiedUsername = response.data?.username || trimmedUsername;

      localStorage.setItem(
        "blitzcode_leetcode_username",
        verifiedUsername
      );

      setSavedUsername(verifiedUsername);
      setUsername(verifiedUsername);
      setIsConnected(true);
      setToken("");
      setError("");
      setVerificationStep("idle");
      onBack();
    } catch (err) {
      console.error("LeetCode verification failed:", err);
      setError(
        getApiError(
          err,
          "Verification failed. Make sure you added the verification code to your profile."
        )
      );
      setVerificationStep("pending");
    }
  };

  const handleCopyToken = async () => {
    if (!token) {
      setError("There is no verification code to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy token:", err);
      setError("Could not copy the verification code.");
    }
  };

  const handleCancelVerification = () => {
    setVerificationStep("idle");
    setToken("");
    setError("");
    setCopied(false);
    onBack();
  };

  const handleRemove = () => {
    localStorage.removeItem("blitzcode_leetcode_username");
    setSavedUsername("");
    setUsername("");
    setIsConnected(false);
    setVerificationStep("idle");
    setToken("");
    setError("");
    setCopied(false);
    onBack();
  };

  return (
    <div
      className={`relative z-10 overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all duration-500 ease-in-out ${
        isExpanded
          ? "md:col-span-2"
          : isOtherExpanded
          ? "hidden"
          : "md:col-span-1"
      }`}
    >
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80" />

      <div>
        {isExpanded && (
          <button
            onClick={() => {
              handleCancelVerification();
            }}
            className="mb-4 flex items-center gap-1.5 text-xs text-[var(--secondary-text)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 w-10 h-10">
              {!imgError ? (
                <img
                  src="/leetcode.png"
                  alt="LeetCode Logo"
                  className="w-5 h-5 object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Code className="w-5 h-5 text-orange-400" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                LeetCode Profile
              </h2>

              <p className="text-xs text-[var(--secondary-text)]">
                Showcase problem solving stats
              </p>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
              Verified
            </div>
          )}
        </div>

        {!isConnected && verificationStep === "idle" && (
          <div className="space-y-3 mt-4">
            <label className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider font-semibold">
              Username
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleAdd();
                    }
                  }}
                  disabled={loading}
                  placeholder="e.g. __sharmaji01__"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] text-xs text-[var(--primary-text)] outline-none focus:border-orange-400/60 transition-colors disabled:opacity-60"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={loading || !username.trim()}
                className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    Connect
                  </>
                )}
              </button>
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>
        )}

        {!isConnected &&
          (verificationStep === "pending" ||
            verificationStep === "verifying") && (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-orange-500/5 border border-orange-500/20 p-4">
                <p className="text-xs font-semibold text-orange-300">
                  Verify ownership
                </p>

                <p className="mt-2 text-xs leading-5 text-[var(--secondary-text)]">
                  Add the following verification code to your LeetCode{" "}
                  <span className="font-semibold text-[var(--primary-text)]">
                    ReadMe
                  </span>{" "}
                  section. This code is temporary and is only required to
                  verify that you own this profile. Once verification is
                  complete, you can remove or change it.
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--bg-sec)] border border-[var(--borders)] p-4">
                <p className="text-[10px] uppercase tracking-wider font-mono text-[var(--secondary-text)]">
                  Verification Code
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono font-bold tracking-wider text-orange-400 break-all">
                    {token}
                  </code>

                  <button
                    onClick={handleCopyToken}
                    disabled={verificationStep === "verifying"}
                    className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
                    title="Copy verification code"
                  >
                    {copied ? (
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-xs text-[var(--secondary-text)] space-y-2">
                <p>1. Open your LeetCode profile.</p>
                <p>2. Edit your About Me section.</p>
                <p>3. Add the code shown above.</p>
                <p>4. Save your LeetCode profile.</p>
                <p>5. Come back here and click Verify.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleVerify}
                  disabled={verificationStep === "verifying"}
                  className="flex-1 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  {verificationStep === "verifying" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Verify Ownership
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancelVerification}
                  disabled={verificationStep === "verifying"}
                  className="h-10 px-4 rounded-xl border border-[var(--borders)] text-xs text-[var(--secondary-text)] hover:text-[var(--primary-text)] transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}
            </div>
          )}

        {isConnected && (
          <div className="p-3.5 rounded-2xl bg-[var(--bg-sec)] border border-[var(--borders)] flex items-center justify-between mt-4">
            <div>
              <p className="text-[10px] text-[var(--secondary-text)] uppercase font-mono font-semibold">
                Verified Handle
              </p>

              <p className="font-mono font-semibold text-sm text-[var(--primary-text)]">
                {savedUsername}
              </p>
            </div>

            <button
              onClick={handleRemove}
              className="text-xs text-rose-400 hover:underline cursor-pointer"
            >
              Unlink
            </button>
          </div>
        )}
      </div>

      {isConnected && (
        <button
          onClick={() =>
            router.push(
              `/profile/leetcode?username=${encodeURIComponent(savedUsername)}`
            )
          }
          className="mt-5 w-full h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Detailed Stats
        </button>
      )}
    </div>
  );
}