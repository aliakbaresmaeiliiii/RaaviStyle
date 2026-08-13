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
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [sent, setSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSending, startSending] = useTransition();
  const [isVerifying, startVerifying] = useTransition();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const requested = useRef(false);
  const errorId = useId();
  const code = digits.join("");

  function showError(message: string) {
    setError(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  function focusInput(index: number) {
    const node = inputsRef.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))];
    node?.focus();
    node?.select();
  }

  function sendCode() {
    setError("");
    startSending(async () => {
      const result = await requestOtp(phone);
      if (result && !result.ok) {
        showError(result.error);
        setDevOtp("");
        return;
      }

      setSent(true);
      setDevOtp(result?.devOtp ?? "");
      setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setCountdown(RESEND_SECONDS);
      focusInput(0);
    });
  }

  useEffect(() => {
    if (requested.current) {
      return;
    }

    requested.current = true;
    sendCode();
    focusInput(0);
  }, [phone]);

  useEffect(() => {
    if (!sent || countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sent, countdown]);

  function applyDigits(next: string[], startIndex: number) {
    setDigits(next);
    setError("");

    const filled = next.join("");
    if (filled.length === OTP_LENGTH) {
      submitOtp(filled);
      return;
    }

    const nextEmpty = next.findIndex((digit, index) => index >= startIndex && !digit);
    focusInput(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty);
  }

  function handleChange(index: number, value: string) {
    const incoming = toAsciiDigits(value).replace(/\D/g, "");
    if (!incoming) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];
    incoming.split("").forEach((digit, offset) => {
      if (index + offset < OTP_LENGTH) {
        next[index + offset] = digit;
      }
    });
    applyDigits(next, index + incoming.length);
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];

      if (next[index]) {
        next[index] = "";
        setDigits(next);
        return;
      }

      if (index > 0) {
        next[index - 1] = "";
        setDigits(next);
        focusInput(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(index + 1);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const incoming = toAsciiDigits(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!incoming) {
      return;
    }

    const next = Array.from({ length: OTP_LENGTH }, (_, index) => incoming[index] ?? "");
    applyDigits(next, incoming.length);
  }

  function submitOtp(value: string) {
    setError("");
    startVerifying(async () => {
      const result = await verifyOtp(phone, value);
      if (result && !result.ok) {
        showError(result.error);
        setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
        focusInput(0);
      }
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
        <div dir="ltr" className="flex gap-2.5">
          {digits.map((digit, index) => {
            const active = index === (code.length === OTP_LENGTH ? OTP_LENGTH - 1 : code.length);

            return (
              <input
                key={index}
                ref={(node) => {
                  inputsRef.current[index] = node;
                }}
                id={index === 0 ? "otp" : undefined}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                onFocus={(event) => event.currentTarget.select()}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                autoCorrect="off"
                spellCheck={false}
                maxLength={index === 0 ? OTP_LENGTH : 1}
                disabled={isVerifying}
                aria-label={`${messages.login.otpLabel} ${index + 1}`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={`h-16 w-full rounded-2xl border bg-surface text-center text-xl font-medium outline-none transition ${
                  error
                    ? "border-error bg-error/5"
                    : active
                      ? "border-mocha shadow-[0_0_0_4px_rgba(164,120,100,0.18)]"
                      : digit
                        ? "border-mocha bg-mocha/10"
                        : "border-line"
                }`}
              />
            );
          })}
        </div>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}

      {isSending || isVerifying ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-mocha">
          <FaIcon icon="fa-spinner fa-spin" />
          {isVerifying ? messages.login.verifying : messages.login.sending}
        </p>
      ) : null}

      {devOtp ? (
        <p className="mt-4 rounded-xl bg-oat px-4 py-3 text-center text-lg tracking-[0.4em] text-espresso">
          {devOtp}
        </p>
      ) : null}

      {process.env.NODE_ENV === "development" && !devOtp ? (
        <p className="mt-4 text-xs leading-6 text-taupe">
          {messages.login.devHint}
        </p>
      ) : null}

      <button
        type="button"
        disabled={(sent && countdown > 0) || isSending}
        onClick={sendCode}
        className="mt-8 text-sm text-cocoa hover:text-mocha disabled:cursor-not-allowed disabled:text-taupe"
      >
        {sent && countdown > 0
          ? messages.login.resendIn(countdown)
          : messages.login.resend}
      </button>
    </div>
  );
}
