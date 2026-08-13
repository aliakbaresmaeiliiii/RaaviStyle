"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { FaIcon } from "@/components/fa-icon";
import { requestOtp } from "@/lib/auth";
import { messages } from "@/lib/i18n";
import { formatNationalMobile, isValidMobile } from "@/lib/phone";

export function PhoneForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [isPending, startTransition] = useTransition();
  const phoneRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const hintId = useId();
  const phoneValid = isValidMobile(phone);

  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

  function showError(message: string) {
    setError(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!phoneValid) {
      showError(messages.errors.invalidPhone);
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await requestOtp(phone);
      if (result && !result.ok) {
        showError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-sm text-mocha lg:hidden">
        {messages.login.panelKicker}
      </p>
      <h2 className="mt-2 text-3xl font-medium leading-snug">
        {messages.login.formTitle}
      </h2>
      <p className="mt-3 text-[0.95rem] leading-7 text-muted">
        {messages.login.formBody}
      </p>

      <label className="mt-9 mb-2 block text-sm text-cocoa" htmlFor="phone">
        {messages.login.phoneLabel}
      </label>
      <div
        dir="ltr"
        className={`flex overflow-hidden rounded-2xl border bg-surface transition ${
          error
            ? "border-error"
            : phoneValid
              ? "border-mocha"
              : "border-line focus-within:border-mocha focus-within:shadow-[0_0_0_4px_rgba(164,120,100,0.16)]"
        } ${shake ? "login-shake" : ""}`}
      >
        <span className="flex items-center bg-oat/70 px-4 text-sm text-cocoa">
          +۹۸
        </span>
        <input
          id="phone"
          ref={phoneRef}
          name="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          inputMode="numeric"
          required
          placeholder="۹۱۲ ۱۲۳ ۴۵۶۷"
          value={phone}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hintId}
          onChange={(event) => {
            setPhone(formatNationalMobile(event.target.value));
            setError("");
          }}
          className="h-16 min-w-0 flex-1 bg-transparent px-4 text-left text-lg font-normal outline-none"
        />
        {phoneValid ? (
          <span className="flex items-center px-4 text-mocha">
            <FaIcon icon="fa-check" />
          </span>
        ) : null}
      </div>
      <p id={hintId} className="mt-2 text-xs text-taupe">
        {messages.login.phoneHint}
      </p>

      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || !phoneValid}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-mocha text-base font-medium text-bone shadow-[0_12px_30px_rgba(164,120,100,0.28)] transition hover:bg-espresso disabled:cursor-not-allowed disabled:bg-taupe disabled:shadow-none"
      >
        {isPending ? (
          <FaIcon icon="fa-spinner fa-spin" />
        ) : (
          <FaIcon icon="fa-arrow-left" />
        )}
        {isPending ? messages.login.sending : messages.login.continue}
      </button>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs leading-6 text-taupe">
        <FaIcon icon="fa-shield-halved" />
        {messages.login.privacy}
      </p>
    </form>
  );
}
