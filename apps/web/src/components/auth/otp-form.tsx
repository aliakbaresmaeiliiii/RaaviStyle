"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { requestOtp, verifyOtp } from "@/lib/auth";
import { messages } from "@/lib/i18n";
import { formatPhoneForDisplay, toAsciiDigits } from "@/lib/phone";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

type OtpFormProps = {
  phone: string;
};

export function OtpForm({ phone }: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isPending, startTransition] = useTransition();
  const otpRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  useEffect(() => {
    otpRef.current?.focus();
    const timer = window.setInterval(() => {
      setCountdown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function showError(message: string) {
    setError(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  function handleOtpChange(value: string) {
    const digits = toAsciiDigits(value).replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(digits);
    setError("");

    if (digits.length === OTP_LENGTH) {
      submitOtp(digits);
    }
  }

  function submitOtp(code: string) {
    setError("");
    startTransition(async () => {
      const result = await verifyOtp(phone, code);
      if (result && !result.ok) {
        showError(result.error);
        setOtp("");
        otpRef.current?.focus();
      }
    });
  }

  function handleResend() {
    setError("");
    startTransition(async () => {
      const result = await requestOtp(phone);
      if (result && !result.ok) {
        showError(result.error);
        return;
      }

      setOtp("");
      setCountdown(RESEND_SECONDS);
      otpRef.current?.focus();
    });
  }

  return (
    <div>
      <p className="text-sm text-mocha">{messages.login.eyebrow}</p>
      <h2 className="mt-2 text-3xl font-medium leading-snug">
        {messages.login.verifyTitle}
      </h2>
      <p className="mt-3 text-[0.95rem] leading-7 text-muted">
        {messages.login.verifyBody(formatPhoneForDisplay(phone))}
      </p>
      <Link
        href="/login"
        className="mt-3 inline-flex items-center gap-2 text-sm text-mocha hover:text-espresso"
      >
        <FaIcon icon="fa-pen" />
        {messages.login.changeNumber}
      </Link>

      <div className={`mt-8 ${shake ? "login-shake" : ""}`}>
        <label className="sr-only" htmlFor="otp">
          {messages.login.otpLabel}
        </label>
        <div className="relative">
          <input
            id="otp"
            ref={otpRef}
            value={otp}
            onChange={(event) => handleOtpChange(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoCorrect="off"
            spellCheck={false}
            maxLength={OTP_LENGTH}
            disabled={isPending}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="absolute inset-0 z-10 cursor-text opacity-0"
          />
          <div dir="ltr" className="flex gap-2.5">
            {Array.from({ length: OTP_LENGTH }).map((_, index) => {
              const filled = Boolean(otp[index]);
              const active = otp.length === index && !isPending;

              return (
                <div
                  key={index}
                  className={`flex h-16 flex-1 items-center justify-center rounded-2xl border text-xl font-medium transition ${
                    error
                      ? "border-error bg-error/5"
                      : active
                        ? "border-mocha bg-surface shadow-[0_0_0_4px_rgba(164,120,100,0.18)]"
                        : filled
                          ? "border-mocha bg-mocha/10"
                          : "border-line bg-surface"
                  }`}
                >
                  {otp[index] ?? ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}

      {isPending ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-mocha">
          <FaIcon icon="fa-spinner fa-spin" />
          {messages.login.verifying}
        </p>
      ) : null}

      {process.env.NODE_ENV === "development" ? (
        <p className="mt-4 text-xs leading-6 text-taupe">
          {messages.login.devHint}
        </p>
      ) : null}

      <button
        type="button"
        disabled={countdown > 0 || isPending}
        onClick={handleResend}
        className="mt-8 text-sm text-cocoa hover:text-mocha disabled:cursor-not-allowed disabled:text-taupe"
      >
        {countdown > 0
          ? messages.login.resendIn(countdown)
          : messages.login.resend}
      </button>
    </div>
  );
}
