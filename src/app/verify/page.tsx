"use client"

import { Suspense } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoShieldHalfSharp } from "react-icons/io5";

import { Button, Alert, Snackbar } from "@mui/material";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OtpBox from "@/components/OtpBox";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const startResendTimer = useCallback(() => {
    setResendTimer(60);
  }, []);

  const handleChangeOtp = (value: string) => {
    setOtp(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("No email found. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      setSuccessOpen(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || !email) return;

    setError(null);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Failed to resend OTP");
        return;
      }

      startResendTimer();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center text-blue-800">
        <IoShieldHalfSharp size={70} />
      </div>
      <div className="text-center py-2">
        <h2 className="py-2 text-gray-700 text-xl lg:text-2xl font-semibold">
          Verify OTP
        </h2>
        <p className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide leading-5">
          OTP sent to{" "}
          <span className="font-bold text-blue-700">
            {email || "your email"}
          </span>
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 py-4">
        <OtpBox length={6} onChange={handleChangeOtp} />

        <div className="w-full">
          <Button
            type="submit"
            variant="contained"
            className="w-full! py-3! font-bold!"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>

        <div className="text-center text-gray-600 font-medium flex flex-col items-center justify-center gap-y-4">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || !email}
            className={`text-sm font-bold transition-colors ${
              resendTimer > 0 || !email
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500 hover:text-blue-700"
            }`}
          >
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>

          <Link
            href={"/login"}
            className="hover:text-blue-500 font-bold flex items-center gap-2"
          >
            Back to login <FaArrowRightLong />
          </Link>
        </div>
      </form>

      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          Email verified! Redirecting to login...
        </Alert>
      </Snackbar>
    </>
  );
}

function VerifyOtp() {
  return (
    <section className="relative overflow-hidden py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
      <div className="container">
        <div className="bg-white border border-gray-200 py-5 px-4 sm:px-8 rounded-md shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-auto">
          <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
            <VerifyOtpForm />
          </Suspense>
        </div>
      </div>

      <div className="circle-1 bg-blue-500 opacity-20 size-70 rounded-full absolute bottom-0 -left-[16%]"></div>
      <div className="circle-2 bg-blue-500 opacity-20 size-70 rounded-full absolute top-0 -right-[16%]"></div>
    </section>
  );
}

export default VerifyOtp;
