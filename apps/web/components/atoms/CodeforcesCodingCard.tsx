"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ExternalLink,
  Loader2,
  Link as LinkIcon,
  Check,
  Award,
  ArrowLeft,
  ShieldCheck,
  Unlink,
  BarChart3,
} from "lucide-react";

interface CodeforcesCardProps {
  isExpanded: boolean;
  isOtherExpanded: boolean;
  savedUsername: string;
  setSavedUsername: (val: string) => void;
  isConnected: boolean;
  setIsConnected: (val: boolean) => void;
  error: string;
  setError: (val: string) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
  onExpand: () => void;
  onBack: () => void;
  getApiError: (error: unknown, fallback: string) => string;
}

export default function CodeforcesCard({
  isExpanded,
  isOtherExpanded,
  savedUsername,
  setSavedUsername,
  isConnected,
  setIsConnected,
  error,
  setError,
  loading,
  setLoading,
  onExpand,
  onBack,
  getApiError,
}: CodeforcesCardProps) {
  const router = useRouter();

  const [username, setUsername] = useState(savedUsername);
  const [imgError, setImgError] = useState(false);

  const handleAdd = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Enter your Codeforces handle.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError("");
      onExpand();

      const profileResponse = await axios.get(
        `/api/codeforces/${encodeURIComponent(trimmedUsername)}`,
        {
          validateStatus: () => true,
        }
      );

      const profileData = profileResponse.data;

      if (!profileData?.success) {
        setError(
          profileData?.error ||
            profileData?.message ||
            "Could not find this Codeforces profile."
        );
        onBack();
        return;
      }

      const actualUsername = profileData?.data?.profile?.handle;

      if (!actualUsername) {
        setError("Codeforces profile response is missing the handle.");
        onBack();
        return;
      }

      const verificationResponse = await axios.post(
        "/api/codeforces/verification",
        {
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
            "Could not start Codeforces verification."
        );
        onBack();
        return;
      }

      const authorizationUrl = verificationData?.authorizationUrl;

      if (!authorizationUrl) {
        setError("Codeforces authorization URL was not returned.");
        onBack();
        return;
      }

      setUsername(actualUsername);
      window.location.href = authorizationUrl;
    } catch (err) {
      console.error("Failed to start Codeforces verification:", err);
      setError(
        getApiError(
          err,
          "Could not start Codeforces verification. Please try again."
        )
      );
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    localStorage.removeItem("blitzcode_codeforces_username");
    setSavedUsername("");
    setUsername("");
    setIsConnected(false);
    setError("");
    setLoading(false);
    onBack();
  };

  return (
    <div
      className={`group relative z-10 overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] hover:border-orange-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all duration-500 ease-in-out ${
        isExpanded
          ? "md:col-span-2"
          : isOtherExpanded
          ? "hidden"
          : "md:col-span-1"
      }`}
    >
      {/* Glow Line & Decorative Background Effects */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80" />
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
      <Award className="pointer-events-none absolute -right-4 -bottom-6 w-36 h-36 text-orange-400 opacity-[0.035] -rotate-12 transition-transform duration-500 group-hover:rotate-0" />

      <div className="relative">
        {isExpanded && (
          <button
            onClick={() => {
              setError("");
              onBack();
            }}
            className="mb-4 flex items-center gap-1.5 text-xs text-[var(--secondary-text)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/25 shadow-[0_0_18px_-4px_rgba(249,115,22,0.5)] flex items-center justify-center shrink-0 w-11 h-11">
              {!imgError ? (
                <img
                  src="/codeforces.png"
                  alt="Codeforces Logo"
                  className="w-5 h-5 object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Award className="w-5 h-5 text-orange-400" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                Codeforces Profile
              </h2>

              <p className="text-xs text-[var(--secondary-text)]">
                Showcase competitive ratings & ranks
              </p>
            </div>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
              Verified
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[var(--secondary-text)] bg-[var(--bg-sec)] border border-[var(--borders)] px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
              Not connected
            </div>
          )}
        </div>

        {/* Connect Form */}
        {!isConnected ? (
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
                  placeholder="e.g. tourist"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] text-xs text-[var(--primary-text)] outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/15 transition-all disabled:opacity-60"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={loading || !username.trim()}
                className="h-11 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    Connect
                  </>
                )}
              </button>
            </div>

            <p className="flex items-start gap-1.5 text-[11px] text-[var(--secondary-text)]">
              <ShieldCheck className="w-3.5 h-3.5 mt-px shrink-0 text-orange-400/80" />
              We&apos;ll redirect you to authenticate your Codeforces handle.
            </p>

            {error && (
              <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 px-3 py-2.5">
                <p className="text-xs leading-5 text-rose-400">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* Verified State Banner */
          <div className="p-3.5 rounded-2xl bg-[var(--bg-sec)] border border-[var(--borders)] flex items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 text-sm font-extrabold uppercase text-white shadow-lg shadow-orange-500/20">
                {savedUsername.charAt(0) || "C"}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[var(--secondary-text)] uppercase font-mono font-semibold">
                  Verified Handle
                </p>

                <p className="font-mono font-semibold text-sm text-[var(--primary-text)] truncate">
                  {savedUsername}
                </p>
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
              Unlink
            </button>
          </div>
        )}
      </div>

      {/* CTA Button */}
      {isConnected && (
        <button
          onClick={() =>
            router.push(
              `/profile/codeforces?username=${encodeURIComponent(
                savedUsername
              )}`
            )
          }
          className="relative mt-5 w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer transition-all"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          View Detailed Stats
        </button>
      )}
    </div>
  );
}